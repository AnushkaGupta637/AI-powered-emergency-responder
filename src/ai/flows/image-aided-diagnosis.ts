'use server';
/**
 * @fileOverview An AI agent that diagnoses injuries from images and provides first aid instructions.
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
      "A photo of an injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the injury.'),
});
export type ImageAidedDiagnosisInput = z.infer<typeof ImageAidedDiagnosisInputSchema>;

const ImageAidedDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the injury.'),
  firstAidInstructions: z.string().describe('First aid instructions for the injury.'),
});
export type ImageAidedDiagnosisOutput = z.infer<typeof ImageAidedDiagnosisOutputSchema>;

export async function imageAidedDiagnosis(
  input: ImageAidedDiagnosisInput
): Promise<ImageAidedDiagnosisOutput> {
  return imageAidedDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageAidedDiagnosisPrompt',
  input: {
    schema: z.object({
      imageDataUri: z
        .string()
        .describe(
          "A photo of an injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      description: z.string().describe('The description of the injury.'),
    }),
  },
  output: {
    schema: z.object({
      diagnosis: z.string().describe('The diagnosis of the injury.'),
      firstAidInstructions: z.string().describe('First aid instructions for the injury.'),
    }),
  },
  prompt: `You are a medical expert specializing in diagnosing injuries from images. Please provide a diagnosis and first aid instructions based on the image and description.

Description: {{{description}}}
Image: {{media url=imageDataUri}}`,
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
  const {output} = await prompt(input);
  return output!;
});
