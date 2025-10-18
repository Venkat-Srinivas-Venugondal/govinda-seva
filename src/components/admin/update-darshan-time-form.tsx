'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { Clock } from 'lucide-react';

const darshanSchema = z.object({
  waitTime: z.coerce.number().min(0, 'Wait time must be a positive number.'),
});

type DarshanFormValues = z.infer<typeof darshanSchema>;

interface UpdateDarshanTimeFormProps {
  currentWaitTime?: number;
}

export function UpdateDarshanTimeForm({ currentWaitTime }: UpdateDarshanTimeFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<DarshanFormValues>({
    resolver: zodResolver(darshanSchema),
    defaultValues: {
      waitTime: currentWaitTime ?? 0,
    }
  });

  const onSubmit: SubmitHandler<DarshanFormValues> = async (data) => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    try {
      const darshanTimesCollection = collection(firestore, 'darshanTimes');
      await addDoc(darshanTimesCollection, {
        waitTime: data.waitTime,
        timestamp: serverTimestamp(),
        updatedBy: user.uid,
      });
      toast({ title: 'Success', description: 'Darshan wait time has been updated.' });
    } catch (e: any) {
      console.error('Error updating darshan time:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update wait time.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex items-center gap-2">
      <Input
        type="number"
        {...register('waitTime')}
        className="h-8"
        aria-label="Darshan wait time in minutes"
      />
      <Button type="submit" size="sm" className="h-8">
        Update
      </Button>
      {errors.waitTime && <p className="text-xs text-destructive">{errors.waitTime.message}</p>}
    </form>
  );
}
