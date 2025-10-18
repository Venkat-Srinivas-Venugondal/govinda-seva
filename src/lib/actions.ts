'use server';

import { z } from 'zod';
import { predictCrowd } from '@/ai/flows/crowd-prediction';

const CrowdPredictionInputSchema = z.object({
  currentDarshanWaitTime: z.coerce.number().min(0, "Wait time cannot be negative."),
  specialEvents: z.string().min(1, "Special events information is required."),
  weather: z.string().min(1, "Weather information is required."),
});

type PredictionState = {
  prediction?: {
    predictedDarshanTime: string;
    congestionLevel: string;
    reasoning: string;
  };
  error?: string;
  inputErrors?: z.ZodIssue[];
};

export async function predictCrowdAction(
  prevState: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const validatedFields = CrowdPredictionInputSchema.safeParse({
    currentDarshanWaitTime: formData.get('currentDarshanWaitTime'),
    specialEvents: formData.get('specialEvents'),
    weather: formData.get('weather'),
  });

  if (!validatedFields.success) {
    return {
      inputErrors: validatedFields.error.issues,
    };
  }
  
  try {
    const result = await predictCrowd(validatedFields.data);
    return { prediction: result };
  } catch (e: any) {
    console.error(e);
    return { error: 'An error occurred while making the prediction.' };
  }
}
