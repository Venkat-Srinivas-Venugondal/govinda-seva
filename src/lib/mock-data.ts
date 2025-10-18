import type { Issue, SosAlert } from './types';

export const initialIssues: Issue[] = [
  {
    id: 'ISSUE-001',
    description: 'Water cooler leaking in Hall 12, causing a slip hazard.',
    location: 'Near Ramulavari Meda',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'New',
  },
  {
    id: 'ISSUE-002',
    description: 'Cleanliness issue near luggage counter. Bins are overflowing.',
    location: 'Vaikuntam Q Complex II',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: 'In Progress',
  },
  {
    id: 'ISSUE-003',
    description: 'A large spill on the floor requires mopping immediately.',
    location: 'Annaprasadam Complex, Floor 1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'Resolved',
  },
  {
    id: 'ISSUE-004',
    description: 'Light fixture flickering in the main waiting area.',
    location: 'Mahadwaram entrance',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'New',
  },
];

export const initialSosAlerts: SosAlert[] = [
  {
    id: 'SOS-001',
    latitude: 13.684,
    longitude: 79.349,
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
];
