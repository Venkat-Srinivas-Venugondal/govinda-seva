export type Issue = {
  id: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'New' | 'In Progress' | 'Resolved';
};

export type SosAlert = {
  id:string;
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type BroadcastMessage = {
  id: string;
  message: string;
  target: 'Devotees' | 'Volunteers';
  timestamp: Date;
};
