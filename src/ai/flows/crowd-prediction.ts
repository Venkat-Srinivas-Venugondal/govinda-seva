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
      'A description of the current parking availability, e.g., 