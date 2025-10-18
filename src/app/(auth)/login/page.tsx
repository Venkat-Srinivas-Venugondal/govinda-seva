'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, Shield, User, UserCheck } from 'lucide-react';
import Link from 'next/link';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<'devotee' | 'volunteer' | 'admin'>('devotee');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState<FirebaseUser | null>(null);

  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const onEmailSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    if (!auth) return;
    setLoading(true);
    setNeedsVerification(null);

    try {
      // First, try to sign in
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
      // Redirect based on the selected tab role
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'volunteer') router.push('/volunteer/dashboard');
      else router.push('/');

    } catch (error: any) {
      // If sign-in fails, check the error code
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, so create a new account
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          await sendEmailVerification(newUserCredential.user);
          toast({
            title: 'Account Created!',
            description: 'Please check your email and click the verification link to complete registration.',
          });
          setNeedsVerification(newUserCredential.user);
        } catch (registerError: any) {
          toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: registerError.message,
          });
        }
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'The email or password you entered is incorrect.',
        });
      } else {
        // Handle other errors
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

  const handleTabChange = (value: string) => {
    setRole(value as any);
    emailForm.reset();
    setNeedsVerification(null);
  };

  const renderEmailForm = () => (
    <form className="space-y-4" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input id={`${role}-email`} type="email" {...emailForm.register('email')} placeholder="you@example.com" />
        {emailForm.formState.errors.email && <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input id={`${role}-password`} type="password" {...emailForm.register('password')} />
        {emailForm.formState.errors.password && <p className="text-sm text-destructive">{emailForm.formState.errors.password.message}</p>}
      </div>
      
      {needsVerification ? (
         <div className="flex flex-col space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Please verify your email to continue.</p>
            <Button type="button" variant="secondary" onClick={handleResendVerification} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Resend Verification Email
            </Button>
         </div>
      ) : (
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In / Register
        </Button>
      )}

    </form>
  );

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Govinda Seva Portal</CardTitle>
          <CardDescription>Welcome! Please select your role to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devotee" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devotee"><User className="mr-2" />Devotee</TabsTrigger>
              <TabsTrigger value="volunteer"><UserCheck className="mr-2" />Volunteer</TabsTrigger>
              <TabsTrigger value="admin"><Shield className="mr-2" />Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="devotee" className="pt-6">
              {renderEmailForm()}
            </TabsContent>
            <TabsContent value="volunteer" className="pt-6">
              {renderEmailForm()}
            </TabsContent>
            <TabsContent value="admin" className="pt-6">
              {renderEmailForm()}
            </TabsContent>
          </Tabs>

           <div className="mt-6 text-center text-sm">
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
