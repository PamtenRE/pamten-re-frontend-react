"use client";

/**
 * JobCard Component
 *
 * Displays individual job posting with company info, location, salary, tags, and action buttons.
 * Matches wireframe design with badges and dual action buttons.
 */

interface JobCardProps {
  job: {
    jobId: string;
    title: string;
    organizationName: string;
    city: string;
    state: string;
    postedDate: string;
    salary?: string;
    employmentType?: string;
    tags?: string[];
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export default function JobCard({ job, onApply, onSave }: JobCardProps) {
  return (
    <div className="glass border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
      {/* Job Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {job.title}
      </h3>

      {/* Company Name */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {job.organizationName}
      </p>

      {/* Location */}
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
        {job.city}, {job.state}
      </p>

      {/* Employment Type */}
      {job.employmentType && (
        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {job.employmentType}
          </span>
        </div>
      )}

      {/* Tags/Badges */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onApply?.(job.jobId)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Apply Now
        </button>
        <button
          onClick={() => onSave?.(job.jobId)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
        >
          Save Job
        </button>
      </div>
    </div>
  );
}
