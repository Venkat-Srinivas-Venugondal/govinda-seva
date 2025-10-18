import { SosButton } from '@/components/sos-button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function SosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <h1 className="font-headline text-4xl font-bold text-destructive md:text-5xl">Emergency SOS</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          For use in a personal emergency only. Press and hold the button to send an alert with your location to our staff.
        </p>
        <div className="mt-12">
          <SosButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
