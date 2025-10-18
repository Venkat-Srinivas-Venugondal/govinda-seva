import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, Wind } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">Govinda Seva</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/login">
              <Button>
                <LogIn className="mr-2 size-4" />
                Staff Login
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
