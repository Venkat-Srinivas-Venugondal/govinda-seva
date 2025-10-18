'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Siren, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

type SosStatus = 'idle' | 'sending' | 'success' | 'error';

export function SosButton() {
  const [status, setStatus] = useState<SosStatus>('idle');
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleSosClick = () => {
    if (status === 'sending') return;
    setStatus('sending');

    if (!user) {
       toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to send an SOS alert.',
      });
      setStatus('error');
      return;
    }

    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support location services.',
      });
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!firestore) return;
        
        const alertsCollection = collection(firestore, 'emergencyAlerts');
        addDocumentNonBlocking(alertsCollection, {
          latitude,
          longitude,
          timestamp: serverTimestamp(),
          sentBy: user.uid,
        });

        toast({
          title: 'SOS Alert Sent',
          description: 'Help is on the way. Staff have been notified of your location.',
        });
        setStatus('success');
      },
      (error) => {
        console.error('Geolocation Error:', error);
        toast({
          variant: 'destructive',
          title: 'Could Not Get Location',
          description: 'Please ensure location services are enabled for your browser and try again.',
        });
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getButtonContent = () => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-16 w-16 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16" />;
      case 'error':
        return <XCircle className="h-16 w-16" />;
      case 'idle':
      default:
        return <Siren className="h-16 w-16" />;
    }
  };

  return (
    <Button
      onClick={handleSosClick}
      disabled={status === 'sending' || status === 'success'}
      className={cn(
        'h-48 w-48 rounded-full border-8 shadow-2xl transition-all duration-300',
        'bg-red-500 text-white hover:bg-red-600',
        'focus:ring-4 focus:ring-red-400 focus:ring-offset-4 focus:ring-offset-background',
        'disabled:opacity-80',
        status === 'sending' && 'border-blue-500 bg-blue-400',
        status === 'success' && 'border-green-600 bg-green-500',
        status === 'error' && 'border-yellow-600 bg-yellow-500'
      )}
    >
      <div className="flex flex-col items-center justify-center">
        {getButtonContent()}
        <span className="mt-4 text-2xl font-bold">
          {status === 'idle' ? 'SOS' : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </Button>
  );
}
