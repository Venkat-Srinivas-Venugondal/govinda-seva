import { CrowdPredictorForm } from "@/components/crowd-predictor-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function CrowdPredictorPage() {
    return (
        <div className="p-4 md:p-8">
            <Card className="mx-auto max-w-3xl">
                <CardHeader>
                <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-3">
                    <BrainCircuit className="size-8 text-primary" />
                    </div>
                    <div>
                    <CardTitle className="font-headline text-3xl">Crowd Prediction Tool</CardTitle>
                    <CardDescription>
                        Use real-time data to predict crowd inflow and congestion levels.
                    </CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CrowdPredictorForm />
            </Card>
        </div>
    );
}
