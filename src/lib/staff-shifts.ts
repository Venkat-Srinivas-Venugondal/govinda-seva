import data from './staff-shifts.json';
import { Timestamp } from 'firebase/firestore';


export type StaffShifts = {
  id: string;
  staffName: string;
  role: 'Volunteer' | 'Admin' | 'Security';
  loginTime: Timestamp;
  logoutTime?: Timestamp;
};

export const placeholderStaffShifts: StaffShifts[] = data.staffShifts.map(shift => ({
    ...shift,
    loginTime: new Timestamp(shift.loginTime.seconds, shift.loginTime.nanoseconds),
    logoutTime: shift.logoutTime ? new Timestamp(shift.logoutTime.seconds, shift.logoutTime.nanoseconds) : undefined,
}));
