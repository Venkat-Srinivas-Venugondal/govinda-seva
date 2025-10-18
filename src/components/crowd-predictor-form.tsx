'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { predictCrowdAction } from '@/lib/actions';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Predicting...
        </>
      ) : (
        'Predict Crowd Level'
      )}
    </Button>
  );
}

export function CrowdPredictorForm() {
  const [state, formAction] = useActionState(predictCrowdAction, initialState);

  return (
    <form action={formAction}>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentDarshanWaitTime">Current Darshan Wait Time (minutes)</Label>
          <Input id="currentDarshanWaitTime" name="currentDarshanWaitTime" type="number" defaultValue="90" required />
          {state.inputErrors?.find(e => e.path.includes('currentDarshanWaitTime')) && (
            <p className="text-sm text-destructive">{state.inputErrors.find(e => e.path.includes('currentDarshanWaitTime'))?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="parkingAvailability">Parking Availability</Label>
          <Input id="parkingAvailability" name="parkingAvailability" defaultValue="Limited spots available in main areas" required />
          {state.inputErrors?.find(e => e.path.includes('parkingAvailability')) && (
            <p className="text-sm text-destructive">{state.inputErrors.find(e => e.path.includes('parkingAvailability'))?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialEvents">Special Events</Label>
          <Input id="specialEvents" name="specialEvents" defaultValue="Pournami Garuda Seva this evening" required />
           {state.inputErrors?.find(e => e.path.includes('specialEvents')) && (
            <p className="text-sm text-destructive">{state.inputErrors.find(e => e.path.includes('specialEvents'))?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="weather">Weather</Label>
          <Input id="weather" name="weather" defaultValue="Clear and sunny, 32°C" required />
           {state.inputErrors?.find(e => e.path.includes('weather')) && (
            <p className="text-sm text-destructive">{state.inputErrors.find(e => e.path.includes('weather'))?.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <SubmitButton />

        {state?.prediction && (
          <Card className="w-full bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Sparkles className="text-primary" />
                AI Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-semibold">Predicted Inflow:</h4>
                    <p className="font-bold text-lg text-primary">{state.prediction.predictedInflow}</p>
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold">Congestion Level:</h4>
                    <p className="font-bold text-lg text-primary">{state.prediction.congestionLevel}</p>
                </div>
                <div className="space-y-1 flex items-start gap-2 pt-2">
                    <Lightbulb className="mt-1 size-5 shrink-0 text-accent" />
                    <div>
                        <h4 className="font-semibold">Reasoning:</h4>
                        <p className="text-sm text-muted-foreground">{state.prediction.reasoning}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        )}
        {state?.error && (
            <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                <p>{state.error}</p>
            </div>
        )}
      </CardFooter>
    </form>
  );
}
