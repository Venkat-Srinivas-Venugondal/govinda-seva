import { ReportIssueForm } from '@/components/report-issue-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ReportIssuePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12 md:py-24">
          <ReportIssueForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
