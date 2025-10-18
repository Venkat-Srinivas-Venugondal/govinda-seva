
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Ticket, Clock, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const tokenLocations = [
    {
        type: 'Slotted Sarva Darshan (SSD) - Free',
        locations: [
            'Bhudevi Complex, near Alipiri, Tirupati',
            'Srinivasam Complex, opposite Tirupati bus station',
            'Govindaraju Satram, behind Tirupati railway station'
        ],
        timings: '24/7, but tokens are issued for the next day. Limited quantity.'
    },
    {
        type: 'Special Entry Darshan (Seeghra Darshan) - ₹300',
        locations: [
            'Online booking at tirupatibalaji.ap.gov.in',
            'Limited current booking at Srinivasam Complex, Tirupati'
        ],
        timings: 'Online quota is released periodically. Check the official TTD website for details.'
    },
    {
        type: 'Divya Darshan - For Pedestrians',
        locations: [
            'Alipiri Mettu footpath, Tirupati',
            'Srivari Mettu footpath, Srinivasa Mangapuram'
        ],
        timings: 'Available at the starting points of the footpaths for pilgrims walking to Tirumala.'
    }
]

const createMapLink = (location: string) => {
    if (location.startsWith('Online')) {
        return 'https://tirupatibalaji.ap.gov.in/';
    }
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
}

export default function TokenInfoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Info className="size-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Darshan Token Information</CardTitle>
                  <CardDescription>
                    Locations and timings for obtaining Darshan tokens in Tirupati.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-8">
                        {tokenLocations.map(token => (
                            <div key={token.type} className="rounded-lg border p-6">
                                <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                                    <Ticket className="size-6 text-primary"/>
                                    {token.type}
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="font-bold flex items-center gap-2 text-lg"><MapPin className="size-5"/>Locations</h4>
                                        <ul className="mt-2 list-none pl-0 space-y-2">
                                            {token.locations.map(loc => (
                                                <li key={loc}>
                                                    <Link
                                                        href={createMapLink(loc)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                                                    >
                                                        {loc}
                                                        <ExternalLink className="size-4 shrink-0" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold flex items-center gap-2 text-lg"><Clock className="size-5"/>Timings</h4>
                                        <p className="mt-2 text-muted-foreground">{token.timings}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="relative hidden md:block">
                        <Image 
                            src="https://pbs.twimg.com/media/G12nBOcXEAAWXvU?format=jpg&name=large"
                            alt="Tirumala Temple View"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-8">
                    <p>Note: Information is subject to change. Always verify with official TTD sources before your visit.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
