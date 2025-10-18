
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function DevoteeLoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState<FirebaseUser | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!auth) return;
    setLoading(true);
    setNeedsVerification(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        setNeedsVerification(userCredential.user);
        toast({
          variant: 'destructive',
          title: 'Email Not Verified',
          description: 'Please check your email to verify your account.',
        });
        setLoading(false);
        return;
      }
      
      toast({ title: 'Login Successful', description: `Welcome back!` });
      router.push('/'); 
    } catch (error: any) {
       toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Incorrect email or password.',
        });
    } finally {
      setLoading(false);
    }
  };

   const handleResendVerification = async () => {
    if (!needsVerification) return;
    setLoading(true);
    try {
      await sendEmailVerification(needsVerification);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Resend Email',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Devotee Login</CardTitle>
          <CardDescription>Sign in to access pilgrim services.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onLoginSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            
             {needsVerification ? (
               <div className="flex flex-col space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">Your email is not verified.</p>
                  <Button type="button" variant="secondary" onClick={handleResendVerification} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Resend Verification Email
                  </Button>
               </div>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            )}
          </form>

           <div className="mt-6 text-center text-sm">
            {"Don't have an account?"}{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up <ArrowRight className="inline-block size-4" />
            </Link>
          </div>
           <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-muted-foreground hover:underline">
             Not a devotee?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
