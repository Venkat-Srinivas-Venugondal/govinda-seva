import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Ticket, Clock, MapPin } from 'lucide-react';

const tokenLocations = [
    {
        type: 'Slotted Sarva Darshan (SSD) - Free',
        locations: [
            'Bhudevi Complex, near Alipiri',
            'Srinivasam Complex, opposite Tirupati bus station',
            'Govindaraju Satram, behind Tirupati railway station'
        ],
        timings: '24/7, but issued for the next day. Limited quantity.'
    },
    {
        type: 'Special Entry Darshan (Seeghra Darshan) - ₹300',
        locations: [
            'Online booking at tirupatibalaji.ap.gov.in',
            'Limited current booking at Srinivasam Complex'
        ],
        timings: 'Online quota released periodically. Check website for details.'
    },
    {
        type: 'Divya Darshan - For Pedestrians',
        locations: [
            'Alipiri Mettu (starting point of the main footpath)',
            'Srivari Mettu (shorter footpath)'
        ],
        timings: 'Available along the footpath routes for pilgrims walking to Tirumala.'
    }
]

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
                    Locations and timings for obtaining Darshan tokens.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {tokenLocations.map(token => (
                    <div key={token.type} className="rounded-lg border p-6">
                        <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                            <Ticket className="size-6 text-primary"/>
                            {token.type}
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="font-bold flex items-center gap-2 text-lg"><MapPin className="size-5"/>Locations</h4>
                                <ul className="mt-2 list-disc pl-6 text-muted-foreground space-y-1">
                                    {token.locations.map(loc => <li key={loc}>{loc}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-bold flex items-center gap-2 text-lg"><Clock className="size-5"/>Timings</h4>
                                <p className="mt-2 text-muted-foreground">{token.timings}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>Note: Information is subject to change. Please verify with official TTD sources.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
