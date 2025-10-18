import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, UserCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Staff & Admin Access</CardTitle>
              <CardDescription>Select your role to proceed to the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Link href="/volunteer/dashboard">
                <Button size="lg" className="w-full justify-between text-lg">
                  <div className="flex items-center">
                    <UserCheck className="mr-4 size-6" />
                    Volunteer Dashboard
                  </div>
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button size="lg" variant="secondary" className="w-full justify-between text-lg">
                  <div className="flex items-center">
                    <Shield className="mr-4 size-6" />
                    Admin Dashboard
                  </div>
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
