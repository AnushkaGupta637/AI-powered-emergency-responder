'use server';
/**
 * @fileOverview An AI agent that diagnoses injuries from images, estimates severity, and provides first aid instructions.
 *
 * - imageAidedDiagnosis - A function that handles the image-aided diagnosis process.
 * - ImageAidedDiagnosisInput - The input type for the imageAidedDiagnosis function.
 * - ImageAidedDiagnosisOutput - The return type for the imageAidedDiagnosis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImageAidedDiagnosisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of an injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Can be empty if only description is provided."
    )
    .optional(), // Make image optional for text-based analysis
  description: z.string().describe('The description of the injury or emergency. Required if image is not provided.'),
});
export type ImageAidedDiagnosisInput = z.infer<typeof ImageAidedDiagnosisInputSchema>;

const ImageAidedDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the injury based on the image and/or description.'),
  firstAidInstructions: z.string().describe('First aid instructions for the injury.'),
  severity: z.string().describe("An estimation of the injury's severity (e.g., Minor, Moderate, Severe, Critical)."), // Added severity
});
export type ImageAidedDiagnosisOutput = z.infer<typeof ImageAidedDiagnosisOutputSchema>;

export async function imageAidedDiagnosis(
  input: ImageAidedDiagnosisInput
): Promise<ImageAidedDiagnosisOutput> {
  // Basic validation: Ensure either image or description is provided
  if (!input.imageDataUri && !input.description) {
    throw new Error("Either an image or a description must be provided.");
  }
  return imageAidedDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageAidedDiagnosisPrompt',
  input: {
    schema: z.object({
      imageDataUri: z
        .string()
        .describe(
          "A photo of an injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Can be empty."
        )
        .optional(),
      description: z.string().describe('The description of the injury or emergency.'),
    }),
  },
  output: {
    schema: z.object({
      diagnosis: z.string().describe('The diagnosis of the injury based on the image and/or description.'),
      firstAidInstructions: z.string().describe('First aid instructions for the injury.'),
      severity: z.string().describe("An estimation of the injury's severity (e.g., Minor, Moderate, Severe, Critical)."),
    }),
  },
  // Updated prompt to request severity estimation
  prompt: `You are a medical expert specializing in diagnosing injuries and providing first aid advice. Analyze the provided information (image and/or description) to determine a possible diagnosis, estimate the severity, and provide clear first aid instructions.

Severity levels: Minor, Moderate, Severe, Critical. Base your severity assessment on factors like bleeding, depth, size, location, potential for infection, or signs of shock/distress mentioned or visible.

Description: {{{description}}}
{{#if imageDataUri}}
Image: {{media url=imageDataUri}}
{{else}}
(No image provided)
{{/if}}

Provide the diagnosis, severity, and first aid steps clearly. If the situation seems critical, strongly advise calling emergency services immediately as part of the instructions.`,
});


const imageAidedDiagnosisFlow = ai.defineFlow<
  typeof ImageAidedDiagnosisInputSchema,
  typeof ImageAidedDiagnosisOutputSchema
>({
  name: 'imageAidedDiagnosisFlow',
  inputSchema: ImageAidedDiagnosisInputSchema,
  outputSchema: ImageAidedDiagnosisOutputSchema,
},
async input => {
    // Prepare input for the prompt, handling potentially empty image URI
    const promptInput = {
        description: input.description,
        ...(input.imageDataUri && { imageDataUri: input.imageDataUri }), // Only include imageDataUri if it exists
    };

    const { output } = await prompt(promptInput);

    if (!output) {
        throw new Error("AI failed to generate a response.");
    }

    // Ensure all fields are present, provide defaults if necessary (though schema should enforce)
    return {
        diagnosis: output.diagnosis ?? "Diagnosis undetermined",
        firstAidInstructions: output.firstAidInstructions ?? "Unable to provide instructions. Seek professional help.",
        severity: output.severity ?? "Severity unknown",
    };
});
