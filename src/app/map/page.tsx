'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon, Loader2, AlertTriangle } from 'lucide-react';

export default function MapPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  const tirumalaLocation = { lat: 13.683333, lng: 79.348946 };
  
  // Use user's location if available, otherwise default to Tirumala
  const centerLocation = location || tirumalaLocation;

  // Add a marker for the user's location if available
  const markerQuery = location ? `&q=${location.lat},${location.lng}` : `&q=${tirumalaLocation.lat},${tirumalaLocation.lng}`;
  
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31034.80165977103!2d${centerLocation.lng}!3d${centerLocation.lat}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b0add0a539b%3A0x425533434b9d53b1!2sTirumala%20Temple!5e1!3m2!1sen!2sin!4v1700000000000`;


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapIcon className="size-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Temple Complex Map</CardTitle>
                  <CardDescription>
                    Interactive satellite view of the temple and surrounding areas.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                {loading && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p>Fetching your location...</p>
                  </div>
                )}
                {error && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-8" />
                    <p className="max-w-xs text-center">{error}</p>
                  </div>
                )}
                {!loading && !error && (
                  <iframe
                    src={`https://maps.google.com/maps?q=${location?.lat},${location?.lng}&hl=es;z=14&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Temple Complex Map"
                  ></iframe>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
