'use client';

/**
 * AppliedJobItem Component
 * 
 * Displays a single applied job with company, position, and status badge.
 * Layout matches wireframe with horizontal card layout.
 */

interface AppliedJobItemProps {
  appliedJob: {
    id: string;
    company: string;
    position: string;
    status: 'interview_scheduled' | 'under_review' | 'scheduled' | 'rejected' | 'accepted';
    appliedDate: string;
  };
  onClick?: (id: string) => void;
}

const statusConfig = {
  interview_scheduled: {
    label: 'Interview Scheduled',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  }
};

export default function AppliedJobItem({ appliedJob, onClick }: AppliedJobItemProps) {
  const statusInfo = statusConfig[appliedJob.status];

  return (
    <div 
      className="glass rounded-xl p-6 flex justify-between items-center hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(appliedJob.id)}
    >
      <div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {appliedJob.company}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {appliedJob.position}
        </p>
      </div>
      
      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    </div>
  );
}