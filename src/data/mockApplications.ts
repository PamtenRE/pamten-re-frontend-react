// src/data/mockApplications.ts

export interface ApplicationStage {
  stage: string;
  completed: boolean;
}

export interface AppliedJob {
  id: string;
  jobId: string;
  company: string;
  position: string;
  status: 'interview_scheduled' | 'under_review' | 'scheduled' | 'rejected' | 'accepted';
  appliedDate: string;
  department: string;
  location: string;
  salaryRange: string;
  applicationStages: ApplicationStage[];
}

export const mockAppliedJobs: AppliedJob[] = [
  {
    id: '1',
    jobId: 'job-1',
    company: 'Tech Corp',
    position: 'Senior Frontend Developer',
    status: 'interview_scheduled',
    appliedDate: '2025-10-10',
    department: 'Engineering',
    location: 'San Francisco, CA',
    salaryRange: '$120k - $150k',
    applicationStages: [
      { stage: 'Application sent', completed: true },
      { stage: 'Viewed', completed: true },
      { stage: 'Shortlisted', completed: true },
      { stage: 'Interviewed', completed: true },
      { stage: 'Selected', completed: false }
    ]
  },
  {
    id: '2',
    jobId: 'job-2',
    company: 'StartupXYZ',
    position: 'Full Stack Engineer',
    status: 'under_review',
    appliedDate: '2025-10-12',
    department: 'Product',
    location: 'Remote',
    salaryRange: '$100k - $130k',
    applicationStages: [
      { stage: 'Application sent', completed: true },
      { stage: 'Viewed', completed: true },
      { stage: 'Shortlisted', completed: false },
      { stage: 'Interviewed', completed: false },
      { stage: 'Selected', completed: false }
    ]
  },
  {
    id: '3',
    jobId: 'job-3',
    company: 'Innovation Labs',
    position: 'React Developer',
    status: 'scheduled',
    appliedDate: '2025-10-08',
    department: 'Technology',
    location: 'New York, NY',
    salaryRange: '$110k - $140k',
    applicationStages: [
      { stage: 'Application sent', completed: true },
      { stage: 'Viewed', completed: true },
      { stage: 'Shortlisted', completed: true },
      { stage: 'Interviewed', completed: false },
      { stage: 'Selected', completed: false }
    ]
  },
  {
    id: '4',
    jobId: 'job-4',
    company: 'Digital Solutions',
    position: 'UI/UX Developer',
    status: 'rejected',
    appliedDate: '2025-10-05',
    department: 'Design',
    location: 'Austin, TX',
    salaryRange: '$95k - $120k',
    applicationStages: [
      { stage: 'Application sent', completed: true },
      { stage: 'Viewed', completed: true },
      { stage: 'Shortlisted', completed: false },
      { stage: 'Interviewed', completed: false },
      { stage: 'Selected', completed: false }
    ]
  },
  {
    id: '5',
    jobId: 'job-5',
    company: 'CloudTech Inc',
    position: 'Backend Developer',
    status: 'accepted',
    appliedDate: '2025-09-28',
    department: 'Infrastructure',
    location: 'Seattle, WA',
    salaryRange: '$130k - $160k',
    applicationStages: [
      { stage: 'Application sent', completed: true },
      { stage: 'Viewed', completed: true },
      { stage: 'Shortlisted', completed: true },
      { stage: 'Interviewed', completed: true },
      { stage: 'Selected', completed: true }
    ]
  }
];

// Enhanced application timeline data with multiple metrics (last 7 days)
export const mockApplicationTimeline = [
  { 
    day: 'Mon', 
    applied: 1,
    rejected: 0,
    accepted: 0,
    interviews: 0
  },
  { 
    day: 'Tue', 
    applied: 0,
    rejected: 0,
    accepted: 0,
    interviews: 1
  },
  { 
    day: 'Wed', 
    applied: 2,
    rejected: 1,
    accepted: 0,
    interviews: 0
  },
  { 
    day: 'Thu', 
    applied: 1,
    rejected: 0,
    accepted: 0,
    interviews: 1
  },
  { 
    day: 'Fri', 
    applied: 0,
    rejected: 0,
    accepted: 1,
    interviews: 0
  },
  { 
    day: 'Sat', 
    applied: 0,
    rejected: 0,
    accepted: 0,
    interviews: 1
  },
  { 
    day: 'Sun', 
    applied: 1,
    rejected: 0,
    accepted: 0,
    interviews: 0
  }
];