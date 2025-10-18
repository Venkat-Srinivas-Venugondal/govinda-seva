import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

export default function MapPage() {
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
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31034.80165977103!2d79.348946!3d13.683333!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b0add0a539b%3A0x425533434b9d53b1!2sTirumala%20Temple!5e1!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tirumala Temple Map"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
