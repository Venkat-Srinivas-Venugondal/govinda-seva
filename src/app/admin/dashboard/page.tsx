'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import type { Issue, SosAlert, StaffShift, DarshanTime } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format, formatDistanceToNow } from 'date-fns';
import { Users, AlertTriangle, Wrench, Loader2, Clock } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { UpdateDarshanTimeForm } from '@/components/admin/update-darshan-time-form';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map');

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'issueReports'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const alertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'emergencyAlerts'), orderBy('timestamp', 'desc'));
  }, [firestore]);
  
  const darshanTimesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'darshanTimes'), orderBy('timestamp', 'desc'), limit(1));
  }, [firestore]);
  
  const staffShiftsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'staffShifts'), orderBy('loginTime', 'desc'));
  }, [firestore]);


  const { data: issues, isLoading: isLoadingIssues } = useCollection<Issue>(issuesQuery);
  const { data: alerts, isLoading: isLoadingAlerts } = useCollection<SosAlert & { latitude: number; longitude: number }>(alertsQuery);
  const { data: darshanTimes, isLoading: isLoadingDarshan } = useCollection<DarshanTime>(darshanTimesQuery);
  const { data: staffShifts, isLoading: isLoadingStaff } = useCollection<StaffShift>(staffShiftsQuery);
  
  const latestDarshanTime = darshanTimes?.[0];

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'New': return <Badge variant="destructive">New</Badge>;
      case 'In Progress': return <Badge variant="secondary" className="bg-yellow-400 text-black">In Progress</Badge>;
      case 'Resolved': return <Badge className="bg-green-500">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${hours}hr ${remainingMinutes}m`;
  };
  
  const isLoading = isUserLoading || isLoadingIssues || isLoadingAlerts || isLoadingDarshan || isLoadingStaff;

  if (isLoading) {
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

  const openIssuesCount = issues?.filter(i => i.status !== 'Resolved').length ?? 0;
  const activeAlertsCount = alerts?.length ?? 0;
  const activeStaffCount = staffShifts?.filter(s => !s.logoutTime).length ?? 0;


  return (
    <div 
      className="relative min-h-screen p-4 md:p-8"
    >
       <div 
        className="absolute inset-0 z-0 opacity-75" 
        style={{
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/e1/TTD-Logo.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div className="absolute inset-0 bg-background/80 z-0"></div>
      <div className="relative z-10">
        <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Live overview of temple operations.</p>
        
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/staff">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStaffCount}</div>
                <p className="text-xs text-muted-foreground">Volunteers and Staff currently on duty</p>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openIssuesCount}</div>
              <p className="text-xs text-muted-foreground">Total unresolved issues reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active SOS Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAlertsCount}</div>
              <p className="text-xs text-muted-foreground">Immediate attention required</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Darshan Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestDarshanTime ? formatWaitTime(latestDarshanTime.waitTime) : 'N/A'}</div>
              <UpdateDarshanTimeForm currentWaitTime={latestDarshanTime?.waitTime} />
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
                {alerts?.map((alert) => (
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
                    {alerts && alerts.map(alert => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </TableCell>
                        <TableCell>
                          Lat: {alert.latitude.toFixed(4)}, Lon: {alert.longitude.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right">
                          {alert.timestamp ? formatDistanceToNow(alert.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {alerts && alerts.length === 0 && (
                      <TableRow><TableCell colSpan={3} className="text-center">No active SOS alerts.</TableCell></TableRow>
                    )}
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
                  {issues && issues.map(issue => (
                    <TableRow key={issue.id}>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>
                          <div className="font-medium">{issue.description}</div>
                          <div className="text-xs text-muted-foreground">{issue.location}</div>
                      </TableCell>
                      <TableCell>{issue.timestamp ? formatDistanceToNow(issue.timestamp.toDate(), { addSuffix: true }) : 'just now'}</TableCell>
                    </TableRow>
                  ))}
                  {issues && issues.length === 0 && (
                      <TableRow><TableCell colSpan={3} className="text-center">No issues reported.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
