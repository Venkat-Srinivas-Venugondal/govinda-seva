'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { initialIssues, initialSosAlerts } from '@/lib/mock-data';
import type { Issue, SosAlert } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatDistanceToNow } from 'date-fns';
import { Users, AlertTriangle, Wrench } from 'lucide-react';

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [alerts, setAlerts] = useState<SosAlert[]>(initialSosAlerts);
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map');

  useEffect(() => {
    const issueInterval = setInterval(() => {
      const newIssue: Issue = {
        id: `ISSUE-${Math.floor(Math.random() * 900) + 100}`,
        description: 'New issue detected automatically.',
        location: 'Auto-Generated Location',
        timestamp: new Date(),
        status: 'New',
      };
      setIssues((prev) => [newIssue, ...prev]);
    }, 20000);

    const alertInterval = setInterval(() => {
        const newAlert: SosAlert = {
          id: `SOS-${Math.floor(Math.random() * 900) + 100}`,
          latitude: 13.684 + (Math.random() - 0.5) * 0.01,
          longitude: 79.349 + (Math.random() - 0.5) * 0.01,
          timestamp: new Date(),
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }, 45000);

    return () => {
        clearInterval(issueInterval);
        clearInterval(alertInterval);
    };
  }, []);

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'New': return <Badge variant="destructive">New</Badge>;
      case 'In Progress': return <Badge variant="secondary" className="bg-yellow-400 text-black">In Progress</Badge>;
      case 'Resolved': return <Badge className="bg-green-500">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Live overview of temple operations.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Volunteers and Staff currently on duty</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues.filter(i => i.status !== 'Resolved').length}</div>
            <p className="text-xs text-muted-foreground">Total unresolved issues reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active SOS Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">Immediate attention required</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Live SOS Alerts</CardTitle>
            <CardDescription>Emergency alerts from pilgrims.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              {mapImage && (
                <Image src={mapImage.imageUrl} alt="Map of temple complex" fill className="object-cover" data-ai-hint={mapImage.imageHint} />
              )}
              {alerts.map((alert, index) => (
                <div key={alert.id}
                     className="absolute animate-pulse"
                     style={{
                       top: `${50 + (alert.latitude - 13.684) * 2000}%`,
                       left: `${50 + (alert.longitude - 79.349) * 2000}%`,
                     }}
                >
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-400"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableBody>
                  {alerts.map(alert => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </TableCell>
                      <TableCell>
                         Lat: {alert.latitude.toFixed(4)}, Lon: {alert.longitude.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right">{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Live Issue Reports</CardTitle>
            <CardDescription>Non-emergency issues reported by pilgrims.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[30rem] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map(issue => (
                  <TableRow key={issue.id}>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>
                        <div className="font-medium">{issue.description}</div>
                        <div className="text-xs text-muted-foreground">{issue.location}</div>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(issue.timestamp, { addSuffix: true })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
