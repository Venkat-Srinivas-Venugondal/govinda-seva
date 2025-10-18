import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Clock, Car, Users, ArrowRight, ShieldAlert, Megaphone, Wrench } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  const infoCards = [
    {
      title: 'Darshan Wait Time',
      value: '90 mins',
      icon: <Clock className="size-8 text-primary" />,
      description: 'Estimated time from VQC-II',
    },
    {
      title: 'Parking Availability',
      value: '75%',
      icon: <Car className="size-8 text-primary" />,
      description: 'Main parking area',
    },
    {
      title: 'Crowd Inflow',
      value: 'High',
      icon: <Users className="size-8 text-primary" />,
      description: 'Prediction for the next hour',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-96 w-full text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-4 text-center">
            <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl">
              Govinda Seva
            </h1>
            <p className="max-w-2xl text-lg text-gray-200 md:text-xl">
              Your Smart Temple Companion for a seamless pilgrimage.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {infoCards.map((card) => (
              <Card key={card.title} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-headline text-2xl font-bold">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="bg-card py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">How can we assist you?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We are here to help. Report non-emergency issues or request immediate help with our SOS feature.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Link href="/report-issue" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-lg">
                  <Wrench className="mx-auto size-12 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold">Report an Issue</h3>
                  <p className="mt-2 text-muted-foreground">Notice a problem? Let us know. Help us improve facilities for all pilgrims.</p>
                  <Button variant="link" className="mt-4 text-primary">
                    File a Report <ArrowRight className="ml-2 size-4" />
                  </Button>
              </Link>
              <Link href="/sos" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-destructive hover:shadow-lg">
                  <ShieldAlert className="mx-auto size-12 text-destructive transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold text-destructive">Emergency SOS</h3>
                  <p className="mt-2 text-muted-foreground">In case of a personal emergency, press the button for immediate assistance.</p>
                  <Button variant="link" className="mt-4 text-destructive">
                    Request Help <ArrowRight className="ml-2 size-4" />
                  </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
