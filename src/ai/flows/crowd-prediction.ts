// src/ai/flows/crowd-prediction.ts
'use server';
/**
 * @fileOverview Predicts crowd inflow and congestion levels using real-time data.
 *
 * - predictCrowd - A function that predicts crowd conditions.
 * - CrowdPredictionInput - The input type for the predictCrowd function.
 * - CrowdPredictionOutput - The return type for the predictCrowd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrowdPredictionInputSchema = z.object({
  currentDarshanWaitTime: z
    .number()
    .describe('The current estimated darshan wait time in minutes.'),
  parkingAvailability: z
    .string()
    .describe(
      'A description of the current parking availability, e.g., "75% full"'
    ),
  specialEvents: z
    .string()
    .describe(
      'Any special events happening, e.g., "Pournami Garuda Seva this evening"'
    ),
  weather: z
    .string()
    .describe('Current weather conditions, e.g., "Clear and sunny, 32°C"'),
});
export type CrowdPredictionInput = z.infer<typeof CrowdPredictionInputSchema>;

const CrowdPredictionOutputSchema = z.object({
    predictedInflow: z.string().describe('The predicted crowd inflow level (e.g., Low, Medium, High, Very High).'),
    congestionLevel: z.string().describe('The predicted congestion level in key areas (e.g., Low, Moderate, High).'),
    reasoning: z.string().describe('A brief explanation for the prediction.'),
});
export type CrowdPredictionOutput = z.infer<typeof CrowdPredictionOutputSchema>;


export async function predictCrowd(input: CrowdPredictionInput): Promise<CrowdPredictionOutput> {
    return predictCrowdFlow(input);
}

const prompt = ai.definePrompt({
    name: 'crowdPredictionPrompt',
    input: { schema: CrowdPredictionInputSchema },
    output: { schema: CrowdPredictionOutputSchema },
    prompt: `You are an AI assistant for the Govinda Seva temple management app. Your task is to predict crowd inflow and congestion levels based on the following real-time data:

- Current Darshan Wait Time: {{{currentDarshanWaitTime}}} minutes
- Parking Availability: {{{parkingAvailability}}}
- Special Events: {{{specialEvents}}}
- Weather: {{{weather}}}

Analyze this information and provide a prediction with the following fields:
1.  **predictedInflow**: Estimate the overall crowd movement into the temple complex (e.g., Low, Medium, High, Very High).
2.  **congestionLevel**: Predict the level of crowding in key areas like the main temple, queue complexes, and prasadam counters (e.g., Low, Moderate, High).
3.  **reasoning**: Briefly explain why you made this prediction, citing the provided data.

Higher wait times, limited parking, special events, and pleasant weather usually indicate higher inflow and congestion.
`,
});


const predictCrowdFlow = ai.defineFlow(
  {
    name: 'predictCrowdFlow',
    inputSchema: CrowdPredictionInputSchema,
    outputSchema: CrowdPredictionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
