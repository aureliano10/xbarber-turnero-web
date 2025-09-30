'use server';
/**
 * @fileOverview AI-powered summarization of customer details and appointment requests for barbers.
 *
 * - summarizeTurnDetails - A function that summarizes turn details using AI.
 * - SummarizeTurnDetailsInput - The input type for the summarizeTurnDetails function.
 * - SummarizeTurnDetailsOutput - The return type for the summarizeTurnDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTurnDetailsInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  appointmentDetails: z.string().describe('Details of the requested appointment (date, time, service).'),
  customerPreferences: z.string().describe('Any specific customer preferences or notes.'),
});
export type SummarizeTurnDetailsInput = z.infer<typeof SummarizeTurnDetailsInputSchema>;

const SummarizeTurnDetailsOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the customer, appointment details, and any preferences.'),
});
export type SummarizeTurnDetailsOutput = z.infer<typeof SummarizeTurnDetailsOutputSchema>;

export async function summarizeTurnDetails(input: SummarizeTurnDetailsInput): Promise<SummarizeTurnDetailsOutput> {
  return summarizeTurnDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTurnDetailsPrompt',
  input: {schema: SummarizeTurnDetailsInputSchema},
  output: {schema: SummarizeTurnDetailsOutputSchema},
  prompt: `As a barber, summarize the following information to quickly understand what needs to be done for the appointment.\n\nCustomer Name: {{{customerName}}}\nAppointment Details: {{{appointmentDetails}}}\nCustomer Preferences: {{{customerPreferences}}}\n\nSummary:`,
});

const summarizeTurnDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeTurnDetailsFlow',
    inputSchema: SummarizeTurnDetailsInputSchema,
    outputSchema: SummarizeTurnDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
