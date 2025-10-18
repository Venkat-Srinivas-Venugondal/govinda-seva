'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Wind, UserPlus } from 'lucide-react';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">Govinda Seva</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {isUserLoading ? (
              <Button variant="ghost" disabled>Loading...</Button>
            ) : user ? (
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                    <Link href="/login">
                        <LogIn className="mr-2 size-4" />
                        Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/register">
                        <UserPlus className="mr-2 size-4" />
                        Sign Up
                    </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
