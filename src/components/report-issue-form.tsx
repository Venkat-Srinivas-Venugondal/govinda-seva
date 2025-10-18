'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wrench } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  location: z.string().min(5, {
    message: 'Location must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

export function ReportIssueForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Database not available.",
        });
        return;
    }
    if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to report an issue.",
        });
        return;
    }

    try {
      const issuesCollection = collection(firestore, 'issueReports');
      await addDocumentNonBlocking(issuesCollection, {
        ...values,
        reportedBy: user.uid,
        status: 'New',
        timestamp: serverTimestamp(),
      });
      
      toast({
        title: 'Report Submitted',
        description: 'Thank you for your help in improving our facilities.',
      });
      form.reset();
    } catch (e: any) {
       console.error("Error submitting issue:", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not submit your report. Please try again.",
        });
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Wrench className="size-8 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-3xl">Report an Issue</CardTitle>
            <CardDescription>
              Help us maintain the temple by reporting non-emergency problems.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Near Hall 12, Vaikuntam Complex" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide a specific location for the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Description of Issue</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The water cooler is leaking continuously."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the problem in as much detail as possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full">
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
