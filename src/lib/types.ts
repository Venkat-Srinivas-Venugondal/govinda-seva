import { Timestamp } from "firebase/firestore";

export type Issue = {
  id: string;
  description: string;
  location: string;
  timestamp: Timestamp;
  status: 'New' | 'In Progress' | 'Resolved';
  reportedBy: string;
};

export type SosAlert = {
  id:string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  sentBy: string;
};

export type BroadcastMessage = {
  id: string;
  message: string;
  target: 'Devotees' | 'Volunteers';
  timestamp: Date;
  sentBy: string;
};
