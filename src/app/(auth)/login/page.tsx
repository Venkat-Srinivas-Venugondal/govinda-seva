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
import { useAuth } from '@/firebase';
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

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState<FirebaseUser | null>(null);

  const loginForm = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

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
          description: 'Please verify your email address to log in. You can resend the verification email.',
        });
        setLoading(false);
        return;
      }
      
      toast({ title: 'Login Successful', description: `Welcome back!` });
      
      // A simple redirect logic. You might want to enhance this based on user roles from Firestore.
      router.push('/'); 

    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'The email or password you entered is incorrect.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: error.message,
        });
      }
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
          <CardTitle className="font-headline text-3xl">Govinda Seva Portal</CardTitle>
          <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...loginForm.register('email')} placeholder="you@example.com" />
              {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...loginForm.register('password')} />
              {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
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
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up <ArrowRight className="inline-block size-4" />
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/" className="text-primary hover:underline flex items-center justify-center">
              <ArrowRight className="size-4 mr-2 transform rotate-180" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
