import { SosButton } from '@/components/sos-button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function SosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className="relative flex flex-1 flex-col items-center justify-center p-4 text-center"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/95/d5/c2/95d5c28634ee8e64058f1e9609d1ad7c.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 text-white">
          <h1 className="font-headline text-4xl font-bold text-destructive md:text-5xl">Emergency SOS</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            For use in a personal emergency only. Press and hold the button to send an alert with your location to our staff.
          </p>
          <div className="mt-12">
            <SosButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
