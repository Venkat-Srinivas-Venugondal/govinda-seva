'use client';

import { useMemo } from 'react';
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
import { StaffShifts, placeholderStaffShifts } from '@/lib/staff-shifts';
import { format } from 'date-fns';
import { Users, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function StaffDetailsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // Use placeholder data directly instead of Firestore
  const allStaff: StaffShifts[] = placeholderStaffShifts;
  const isLoadingStaff = false;

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // The date might be a Firebase Timestamp, so we convert it.
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    return format(jsDate, 'PPpp'); // e.g., Jun 20, 2024, 2:30 PM
  };

  const getStatus = (shift: StaffShifts) => {
    return shift.logoutTime ? <Badge variant="secondary">Offline</Badge> : <Badge className="bg-green-500">Online</Badge>;
  };
  
  const isLoading = isUserLoading || isLoadingStaff;

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

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="size-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">Staff & Volunteer Details</CardTitle>
              <CardDescription>
                A log of all staff and volunteer shifts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Logout Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allStaff.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{getStatus(shift)}</TableCell>
                    <TableCell className="font-medium">{shift.staffName}</TableCell>
                    <TableCell>{shift.role}</TableCell>
                    <TableCell>{formatDate(shift.loginTime)}</TableCell>
                    <TableCell>{shift.logoutTime ? formatDate(shift.logoutTime) : 'Active'}</TableCell>
                  </TableRow>
                ))}
                {allStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No staff shifts have been recorded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    