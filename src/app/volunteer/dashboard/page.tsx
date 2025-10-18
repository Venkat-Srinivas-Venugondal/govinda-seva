'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useUser, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import type { Issue } from '@/lib/types';
import { Wrench, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function VolunteerDashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'issueReports'), orderBy('timestamp', 'desc'));
  }, [firestore]);
  
  const { data: issues, isLoading } = useCollection<Issue>(issuesQuery);

  const handleUpdateStatus = (issueId: string, status: Issue['status']) => {
    if (!firestore) return;
    const issueRef = doc(firestore, 'issueReports', issueId);
    updateDocumentNonBlocking(issueRef, { status });
  };
  
  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'New':
        return <Badge variant="destructive">New</Badge>;
      case 'In Progress':
        return <Badge variant="secondary" className="bg-yellow-400 text-black">In Progress</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-16 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="font-headline text-3xl">Volunteer Task Dashboard</CardTitle>
                  <CardDescription>Live feed of reported issues. Thank you for your service.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues && issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="font-medium">{issue.description}</TableCell>
                        <TableCell>{issue.location}</TableCell>
                        <TableCell>
                          {issue.timestamp ? formatDistanceToNow(issue.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {issue.status === 'New' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(issue.id, 'In Progress')}>
                              <Wrench className="mr-2 size-4" />
                              Accept Task
                            </Button>
                          )}
                          {issue.status === 'In Progress' && (
                            <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(issue.id, 'Resolved')}>
                              <CheckCircle className="mr-2 size-4" />
                              Mark Resolved
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {issues && issues.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No issues reported yet.
                    </div>
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
