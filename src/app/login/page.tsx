
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Shield, UserCog } from 'lucide-react';

const loginOptions = [
  {
    role: 'Devotee',
    description: 'Access pilgrim services, report issues, and use SOS.',
    href: '/login/devotee',
    icon: <User className="size-8 text-primary" />,
  },
  {
    role: 'Volunteer',
    description: 'View and manage assigned tasks and sevice activities.',
    href: '/login/volunteer',
    icon: <Shield className="size-8 text-primary" />,
  },
  {
    role: 'Admin',
    description: 'Access the temple operations and management dashboard.',
    href: '/login/admin',
    icon: <UserCog className="size-8 text-primary" />,
  },
];

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">Govinda Seva Portal</CardTitle>
          <CardDescription>Please select your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-1">
            {loginOptions.map((option) => (
              <Link key={option.role} href={option.href} legacyBehavior>
                <a className="block rounded-lg border bg-background p-6 text-left shadow-sm transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-headline text-2xl font-bold">{option.role} Login</h3>
                      <p className="mt-1 text-muted-foreground">{option.description}</p>
                    </div>
                    <ArrowRight className="ml-auto size-5 text-muted-foreground" />
                  </div>
                </a>
              </Link>
            ))}
          </div>
           <div className="mt-8 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up as a Devotee
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
