// src/ai/flows/emergency-response-offline.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing immediate, AI-powered first aid instructions in offline mode.
 *
 * - emergencyResponseOffline - A function that handles the emergency response process in offline mode.
 * - EmergencyResponseOfflineInput - The input type for the emergencyResponseOffline function.
 * - EmergencyResponseOfflineOutput - The return type for the emergencyResponseOffline function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EmergencyResponseOfflineInputSchema = z.object({
  emergencyDescription: z
    .string()
    .describe(
      'A description of the medical emergency. This can be via voice or text.'
    ),
});
export type EmergencyResponseOfflineInput = z.infer<
  typeof EmergencyResponseOfflineInputSchema
>;

const EmergencyResponseOfflineOutputSchema = z.object({
  firstAidInstructions: z
    .string()
    .describe('Immediate first aid instructions for the described emergency.'),
});
export type EmergencyResponseOfflineOutput = z.infer<
  typeof EmergencyResponseOfflineOutputSchema
>;

export async function emergencyResponseOffline(
  input: EmergencyResponseOfflineInput
): Promise<EmergencyResponseOfflineOutput> {
  return emergencyResponseOfflineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyResponseOfflinePrompt',
  input: {
    schema: z.object({
      emergencyDescription: z
        .string()
        .describe(
          'A description of the medical emergency. This can be via voice or text.'
        ),
    }),
  },
  output: {
    schema: z.object({
      firstAidInstructions: z
        .string()
        .describe('Immediate first aid instructions for the described emergency.'),
    }),
  },
  prompt: `You are an AI-powered first aid assistant designed to provide immediate instructions for medical emergencies, even when offline. A user has described the following emergency:

  {{emergencyDescription}}

  Provide clear and concise first aid instructions. Focus on what the user can do immediately to help the situation.`,
});

const emergencyResponseOfflineFlow = ai.defineFlow<
  typeof EmergencyResponseOfflineInputSchema,
  typeof EmergencyResponseOfflineOutputSchema
>(
  {
    name: 'emergencyResponseOfflineFlow',
    inputSchema: EmergencyResponseOfflineInputSchema,
    outputSchema: EmergencyResponseOfflineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
