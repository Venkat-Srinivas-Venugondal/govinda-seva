'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
import { ArrowRight, Loader2, Shield, User, UserCheck } from 'lucide-react';
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

const RESEND_TIMEOUT = 60; // seconds

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [role, setRole] = useState<'devotee' | 'volunteer' | 'admin'>('devotee');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const phoneForm = useForm<PhoneFormValues>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });
  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const setupRecaptcha = useCallback(() => {
    if (!auth) return;
    
    // Cleanup previous verifier if it exists
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // This callback is usually executed for invisible reCAPTCHA after the user action.
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                toast({ variant: 'destructive', title: 'reCAPTCHA Expired', description: 'Please try sending the OTP again.' });
            }
        });
    } catch (e) {
        console.error("Error creating RecaptchaVerifier:", e);
    }
  }, [auth, toast]);

  useEffect(() => {
    if(auth) {
      setupRecaptcha();
    }
  }, [auth, setupRecaptcha]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, resendTimer]);

  const handleSendOtp = async (data: PhoneFormValues) => {
    if (!auth || !window.recaptchaVerifier) {
      toast({ variant: 'destructive', title: 'Setup Error', description: 'reCAPTCHA is not ready. Please refresh and try again.' });
      return;
    }
    setIsSendingOtp(true);
    
    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, data.phone, verifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      setResendTimer(RESEND_TIMEOUT);
      toast({ title: 'OTP Sent', description: 'Check your phone for the verification code.' });
    } catch (error: any) {
      console.error('Phone sign-in error:', error);
      toast({ variant: 'destructive', title: 'Failed to send OTP', description: error.message || 'Please check the number and try again.' });
      // Reset reCAPTCHA on failure
      setupRecaptcha();
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onPhoneSubmit: SubmitHandler<PhoneFormValues> = (data) => {
    handleSendOtp(data);
  };

  const onOtpSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    if (!confirmationResult) return;
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(data.otp);
      toast({ title: 'Success', description: 'You are now logged in.' });
      router.push('/'); // Redirect to devotee dashboard or homepage
    } catch (error: any) {
      console.error('OTP confirmation error:', error);
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The code you entered is incorrect. Please try again.' });
    } finally {
      setIsVerifyingOtp(false);
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
      if (error.code === 'auth/invalid-credential') {
        toast({ variant: 'destructive', title: 'Login Error', description: 'Invalid email or password.' });
      } else {
        toast({ variant: 'destructive', title: 'Login Error', description: error.message });
      }
    }
  };

  const onEmailRegister: SubmitHandler<EmailFormValues> = async (data) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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
      <div id="recaptcha-container"></div>
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
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...phoneForm.register('phone')} placeholder="+919876543210" />
                    {phoneForm.formState.errors.phone && <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSendingOtp}>
                    {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                   <div className="text-center text-sm text-muted-foreground">
                    An OTP has been sent to {phoneForm.getValues('phone')}.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input id="otp" {...otpForm.register('otp')} placeholder="123456" />
                    {otpForm.formState.errors.otp && <p className="text-sm text-destructive">{otpForm.formState.errors.otp.message}</p>}
                  </div>
                   <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                    {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify OTP
                  </Button>
                  <div className="text-center text-sm">
                     <Button 
                      variant="link" 
                      type="button" 
                      disabled={resendTimer > 0} 
                      onClick={() => onPhoneSubmit(phoneForm.getValues())}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
            <TabsContent value="volunteer" className="pt-6">
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="volunteer-email">Email</Label>
                  <Input id="volunteer-email" type="email" {...emailForm.register('email')} placeholder="volunteer@example.com" />
                  {emailForm.formState.errors.email && <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volunteer-password">Password</Label>
                  <Input id="volunteer-password" type="password" {...emailForm.register('password')} />
                  {emailForm.formState.errors.password && <p className="text-sm text-destructive">{emailForm.formState.errors.password.message}</p>}
                </div>
                <div className="flex flex-col space-y-2">
                    <Button type="button" className="w-full" onClick={emailForm.handleSubmit(onEmailSignIn)}>Sign In</Button>
                    <p className="text-center text-sm text-muted-foreground">New here?</p>
                    <Button type="button" variant="outline" className="w-full" onClick={emailForm.handleSubmit(onEmailRegister)}>Register</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin" className="pt-6">
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" {...emailForm.register('email')} placeholder="admin@example.com" />
                   {emailForm.formState.errors.email && <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" {...emailForm.register('password')} />
                   {emailForm.formState.errors.password && <p className="text-sm text-destructive">{emailForm.formState.errors.password.message}</p>}
                </div>
                <div className="flex flex-col space-y-2">
                    <Button type="button" className="w-full" onClick={emailForm.handleSubmit(onEmailSignIn)}>Sign In</Button>
                     <p className="text-center text-sm text-muted-foreground">New here?</p>
                    <Button type="button" variant="outline" className="w-full" onClick={emailForm.handleSubmit(onEmailRegister)}>Register</Button>
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
    