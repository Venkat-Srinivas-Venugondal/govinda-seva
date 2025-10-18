'use client';

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
import { Clock, Car, Users, ArrowRight, ShieldAlert, Wrench, Map, Info } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const firestore = useFirestore();

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'broadcastMessages'), orderBy('timestamp', 'desc'), limit(1));
  }, [firestore]);
  const { data: announcements, isLoading: isLoadingAnnouncements } = useCollection<{message: string, timestamp: any}>(announcementsQuery);
  const latestAnnouncement = announcements?.[0];

  const darshanTimesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'darshanTimes'), orderBy('timestamp', 'desc'), limit(1));
  }, [firestore]);
  const { data: darshanTimes, isLoading: isLoadingDarshan } = useCollection<{waitTime: number, timestamp: any}>(darshanTimesQuery);
  const latestDarshanTime = darshanTimes?.[0];

  const infoCards = [
    {
      title: 'Darshan Wait Time',
      value: isLoadingDarshan ? 'Loading...' : latestDarshanTime ? `${latestDarshanTime.waitTime} mins` : 'N/A',
      icon: <Clock className="size-8 text-primary" />,
      description: 'Estimated time from VQC-II',
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

        {latestAnnouncement && (
          <section className="bg-accent py-3">
              <div className="container mx-auto px-4 text-center text-accent-foreground">
                  <p className="font-semibold">
                    <span className="font-bold">Latest Announcement:</span> {latestAnnouncement.message}
                  </p>
              </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
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
                Report non-emergency issues, get information, or request immediate help with our SOS feature.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <Link href="/report-issue" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-lg">
                  <Wrench className="mx-auto size-12 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold">Report an Issue</h3>
                  <p className="mt-2 text-muted-foreground">Help us improve facilities for all pilgrims.</p>
              </Link>
              <Link href="/sos" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-destructive hover:shadow-lg">
                  <ShieldAlert className="mx-auto size-12 text-destructive transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold text-destructive">Emergency SOS</h3>
                  <p className="mt-2 text-muted-foreground">For personal emergencies, request immediate help.</p>
              </Link>
               <Link href="/token-info" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-lg">
                  <Info className="mx-auto size-12 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold">Token Information</h3>
                  <p className="mt-2 text-muted-foreground">Find darshan token locations and timings.</p>
              </Link>
               <Link href="/map" className="group block rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-lg">
                  <Map className="mx-auto size-12 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="mt-4 font-headline text-2xl font-bold">Temple Map</h3>
                  <p className="mt-2 text-muted-foreground">Explore the area with a satellite map.</p>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
