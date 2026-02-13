
export enum Page {
  Home = '/',
  Program = '/program',
  Apply = '/apply',
  Impact = '/impact',
  About = '/about',
  Sponsor = '/sponsor',
  Board = '/board',
  Login = '/login',
  Staff = '/staff',
  StudentPortal = '/portal'
}

export type ApplicationStatus = 'Applied' | 'Accepted' | 'Waitlisted' | 'Declined';

export type ImpactStage = 'baseline' | 'midpoint' | 'final';

export interface ImpactSnapshot {
  decisionQuality: 1 | 2 | 3 | 4;
  communicationClarity: 1 | 2 | 3 | 4;
  selfManagement: 1 | 2 | 3 | 4;
  financialReasoning: 1 | 2 | 3 | 4;
  confidenceScore: 1 | 2 | 3 | 4;
  notes?: string;
  recordedAt: string;
}

export interface ImpactAssessment {
  baseline?: ImpactSnapshot;
  midpoint?: ImpactSnapshot;
  final?: ImpactSnapshot;
}

export interface Message {
  id: string;
  sender: 'Staff' | 'Parent';
  text: string;
  timestamp: string;
}

export interface Submission {
  week: number;
  title: string;
  content: string; // The student's work
  status: 'Draft' | 'Submitted' | 'Reviewed' | 'Needs Revision';
  feedback?: string;
  revisionPrompt?: string;
  revisedAt?: string;
  submittedAt?: string;
}

export interface Application {
  id: string;
  studentName: string;
  age: number;
  parentName: string;
  parentEmail: string;
  status: ApplicationStatus;
  appliedDate: string;
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid';
  note: string;
  messages: Message[];
  submissions: Submission[];
  impact?: ImpactAssessment;
}
