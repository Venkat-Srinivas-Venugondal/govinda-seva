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
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerForm = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onRegisterSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (!auth) return;
    setLoading(true);

    try {
        const newUserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await sendEmailVerification(newUserCredential.user);
        
        toast({
            title: 'Account Created!',
            description: 'Please check your email and click the verification link to complete registration.',
            duration: 8000,
        });
        
        setIsRegistered(true);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'This email address is already in use. Please log in instead.',
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
         <div className="container flex min-h-screen items-center justify-center py-12">
            <Card className="w-full max-w-md shadow-xl text-center">
                 <CardHeader>
                    <CardTitle className="font-headline text-3xl">Registration Successful!</CardTitle>
                    <CardDescription>Please check your inbox.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We've sent a verification link to your email address. Please click the link to activate your account. You can close this page.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
          <CardDescription>Join Govinda Seva to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...registerForm.register('email')} placeholder="you@example.com" />
              {registerForm.formState.errors.email && <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...registerForm.register('password')} />
              {registerForm.formState.errors.password && <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...registerForm.register('confirmPassword')} />
              {registerForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

           <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log In <ArrowRight className="inline-block size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
