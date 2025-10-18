'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';
import { Wrench, CheckCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function VolunteerDashboard() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const newIssue: Issue = {
        id: `ISSUE-${Math.floor(Math.random() * 900) + 100}`,
        description: 'Newly reported automated issue for demonstration.',
        location: 'Random Location ' + Math.floor(Math.random() * 20),
        timestamp: new Date(),
        status: 'New',
      };
      setIssues((prev) => [newIssue, ...prev]);
    }, 15000); // Add a new issue every 15 seconds

    return () => clearInterval(interval);
  }, [isSimulating]);

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
                <div className="flex items-center gap-2">
                   <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <RefreshCw className={cn("size-4", isSimulating && "animate-spin")} />
                    {isSimulating ? 'Live Sync Active' : 'Live Sync Paused'}
                  </p>
                  <Button onClick={() => setIsSimulating(s => !s)} variant="outline">
                    {isSimulating ? 'Pause Sync' : 'Resume Sync'}
                  </Button>
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
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="font-medium">{issue.description}</TableCell>
                        <TableCell>{issue.location}</TableCell>
                        <TableCell>{formatDistanceToNow(issue.timestamp, { addSuffix: true })}</TableCell>
                        <TableCell className="text-right space-x-2">
                          {issue.status === 'New' && (
                            <Button size="sm">
                              <Wrench className="mr-2 size-4" />
                              Accept Task
                            </Button>
                          )}
                          {issue.status === 'In Progress' && (
                            <Button size="sm" variant="secondary">
                              <CheckCircle className="mr-2 size-4" />
                              Mark Resolved
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
