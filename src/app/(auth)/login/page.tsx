
'use client';

import { useEffect, useState, useRef } from 'react';
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
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  ConfirmationResult,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Shield, User, UserCheck } from 'lucide-react';
import Link from 'next/link';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code (e.g., +919876543210).'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [role, setRole] = useState<'devotee' | 'volunteer' | 'admin'>('devotee');

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneFormValues>({ resolver: zodResolver(phoneSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });
  
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    getValues: getEmailValues,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });


  const getRecaptchaVerifier = () => {
    if (!auth) return null;
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, you can proceed with phone sign-in.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });
    }
    return (window as any).recaptchaVerifier;
  };
  
  const onPhoneSubmit: SubmitHandler<PhoneFormValues> = async (data) => {
    if (!auth) return;
    const appVerifier = getRecaptchaVerifier();
    if (!appVerifier) {
        toast({ variant: 'destructive', title: 'Error', description: 'reCAPTCHA verifier not initialized.' });
        return;
    }

    try {
      const result = await signInWithPhoneNumber(auth, data.phone, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Check your phone for the verification code.' });
    } catch (error: any) {
      console.error('Phone sign-in error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please ensure your phone number is correct and try again.' });
      if ((window as any).grecaptcha && (window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
            (window as any).grecaptcha.reset(widgetId);
        });
      }
    }
  };

  const onOtpSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(data.otp);
      toast({ title: 'Success', description: 'You are now logged in.' });
      router.push('/'); // Redirect to devotee dashboard or homepage
    } catch (error: any) {
      console.error('OTP confirmation error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP. Please try again.' });
    }
  };
  
  const onEmailSignIn: SubmitHandler<EmailFormValues> = async (data) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Login Successful', description: `Welcome back, ${role}!` });
      router.push(role === 'admin' ? '/admin/dashboard' : '/volunteer/dashboard');
    } catch (error: any) {
      console.error(`${role} sign-in error:`, error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast({ variant: 'destructive', title: 'Login Error', description: 'Invalid email or password.' });
      } else {
        toast({ variant: 'destructive', title: 'Login Error', description: error.message });
      }
    }
  };

  const onEmailRegister = async () => {
    if (!auth) return;
    const { email, password } = getEmailValues();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Account Created', description: `Welcome, ${role}!` });
      router.push(role === 'admin' ? '/admin/dashboard' : '/volunteer/dashboard');
    } catch (error: any) {
      console.error(`${role} sign-up error:`, error);
      if (error.code === 'auth/email-already-in-use') {
        toast({ variant: 'destructive', title: 'Registration Error', description: 'An account with this email already exists.' });
      } else {
        toast({ variant: 'destructive', title: 'Registration Error', description: error.message });
      }
    }
  };


  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Govinda Seva Portal</CardTitle>
          <CardDescription>Welcome! Please select your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devotee" className="w-full" onValueChange={(v) => setRole(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devotee"><User className="mr-2" />Devotee</TabsTrigger>
              <TabsTrigger value="volunteer"><UserCheck className="mr-2" />Volunteer</TabsTrigger>
              <TabsTrigger value="admin"><Shield className="mr-2" />Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="devotee" className="pt-6">
              {!isOtpSent ? (
                <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...registerPhone('phone')} placeholder="+919876543210" />
                    {phoneErrors.phone && <p className="text-sm text-destructive">{phoneErrors.phone.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Send OTP</Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input id="otp" {...registerOtp('otp')} placeholder="123456" />
                    {otpErrors.otp && <p className="text-sm text-destructive">{otpErrors.otp.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Verify OTP</Button>
                </form>
              )}
            </TabsContent>
            <TabsContent value="volunteer" className="pt-6">
               <form onSubmit={handleEmailSubmit(onEmailSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="volunteer-email">Email</Label>
                  <Input id="volunteer-email" type="email" {...registerEmail('email')} placeholder="volunteer@example.com" />
                  {emailErrors.email && <p className="text-sm text-destructive">{emailErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volunteer-password">Password</Label>
                  <Input id="volunteer-password" type="password" {...registerEmail('password')} />
                  {emailErrors.password && <p className="text-sm text-destructive">{emailErrors.password.message}</p>}
                </div>
                <div className="flex flex-col space-y-2">
                    <Button type="submit" className="w-full">Sign In</Button>
                    <Button type="button" variant="outline" className="w-full" onClick={onEmailRegister}>Register</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin" className="pt-6">
               <form onSubmit={handleEmailSubmit(onEmailSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" {...registerEmail('email')} placeholder="admin@example.com" />
                   {emailErrors.email && <p className="text-sm text-destructive">{emailErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" {...registerEmail('password')} />
                   {emailErrors.password && <p className="text-sm text-destructive">{emailErrors.password.message}</p>}
                </div>
                <div className="flex flex-col space-y-2">
                    <Button type="submit" className="w-full">Sign In</Button>
                    <Button type="button" variant="outline" className="w-full" onClick={onEmailRegister}>Register</Button>
                </div>
              </form>
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

    