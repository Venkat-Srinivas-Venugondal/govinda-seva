import { ReportIssueForm } from '@/components/report-issue-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

export default function ReportIssuePage() {
  const reportIssueImage = PlaceHolderImages.find((img) => img.id === 'report-issue');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <ReportIssueForm />
            {reportIssueImage && (
              <div className="relative aspect-square hidden md:block">
                  <Image
                    src={reportIssueImage.imageUrl}
                    alt={reportIssueImage.description}
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint={reportIssueiImage.imageHint}
                  />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
