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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Send } from 'lucide-react';

const formSchema = z.object({
  target: z.enum(['Devotees', 'Volunteers'], {
    required_error: 'You need to select a target audience.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }).max(280, {
    message: 'Message cannot exceed 280 characters.'
  }),
});

export default function BroadcastPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would use a push notification service.
    console.log('Broadcast Sent:', values);
    toast({
      title: 'Broadcast Sent!',
      description: `Your message has been sent to all ${values.target.toLowerCase()}.`,
    });
    form.reset();
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Megaphone className="size-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">Broadcast Message</CardTitle>
              <CardDescription>
                Send instant notifications to devotees or volunteers.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Target Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Devotees">All Devotees</SelectItem>
                        <SelectItem value="Volunteers">All Volunteers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose who will receive this broadcast notification.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Darshan will be paused for 30 minutes due to a special ritual."
                        className="resize-none"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This message will be sent as a push notification. Keep it concise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 size-4" />
                Send Broadcast
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
