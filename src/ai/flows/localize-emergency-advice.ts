// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow that translates user input and AI-generated first aid advice into the user's local language.
 *
 * - `localizeEmergencyAdvice`: Function to translate emergency input and advice.
 * - `LocalizeEmergencyAdviceInput`: Input type for `localizeEmergencyAdvice`.
 * - `LocalizeEmergencyAdviceOutput`: Output type for `localizeEmergencyAdvice`.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const LocalizeEmergencyAdviceInputSchema = z.object({
  userInput: z.string().describe('The user input describing the emergency in their local language.'),
  advice: z.string().describe('The AI-generated first aid advice in English.'),
  language: z.string().describe('The target language for translation (e.g., es for Spanish).'),
});

export type LocalizeEmergencyAdviceInput = z.infer<
  typeof LocalizeEmergencyAdviceInputSchema
>;

const LocalizeEmergencyAdviceOutputSchema = z.object({
  translatedInput: z.string().describe('The user input translated into the target language.'),
  translatedAdvice: z.string().describe('The AI-generated advice translated into the target language.'),
});

export type LocalizeEmergencyAdviceOutput = z.infer<
  typeof LocalizeEmergencyAdviceOutputSchema
>;

export async function localizeEmergencyAdvice(
  input: LocalizeEmergencyAdviceInput
): Promise<LocalizeEmergencyAdviceOutput> {
  return localizeEmergencyAdviceFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to translate.'),
      language: z.string().describe('The target language for translation (e.g., es for Spanish).'),
    }),
  },
  output: {
    schema: z.object({
      translatedText: z.string().describe('The translated text.'),
    }),
  },
  prompt: `Translate the following text into {{{language}}}:

{{{text}}}`,
});

const localizeEmergencyAdviceFlow = ai.defineFlow<
  typeof LocalizeEmergencyAdviceInputSchema,
  typeof LocalizeEmergencyAdviceOutputSchema
>({
  name: 'localizeEmergencyAdviceFlow',
  inputSchema: LocalizeEmergencyAdviceInputSchema,
  outputSchema: LocalizeEmergencyAdviceOutputSchema,
},
async input => {
  const [translatedInputResult, translatedAdviceResult] = await Promise.all([
    translatePrompt({
      text: input.userInput,
      language: input.language,
    }),
    translatePrompt({
      text: input.advice,
      language: input.language,
    }),
  ]);

  return {
    translatedInput: translatedInputResult.output!.translatedText,
    translatedAdvice: translatedAdviceResult.output!.translatedText,
  };
});
