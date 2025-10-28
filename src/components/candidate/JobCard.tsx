"use client";

import { useState } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { useToast } from "@/components/ui/Toast";

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
    jobType?: string;
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  isApplied?: boolean;
  isSaved?: boolean;
}

export default function JobCard({
  job,
  onApply,
  onSave,
  isApplied = false,
  isSaved = false,
}: JobCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const handleApplyClick = () => {
    if (isApplied) {
      addToast({
        type: "info",
        title: "Already Applied",
        message: "You have already applied to this job!",
      });
      return;
    }
    setShowModal(true);
  };

  const handleApplicationSuccess = () => {
    onApply?.(job.jobId);
  };

  return (
    <>
      <div className="glass border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl transition-all duration-300 relative">
        {isApplied && (
          <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Applied
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {job.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {job.organizationName}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
          {job.city}, {job.state}
        </p>

        {job.employmentType && (
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {job.employmentType}
            </span>
          </div>
        )}

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

        <div className="flex gap-2">
          <button
            onClick={handleApplyClick}
            disabled={isApplied}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isApplied
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </button>
          <button
            onClick={() => onSave?.(job.jobId)}
            className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 ${
              isSaved
                ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {isSaved ? "★ Saved" : "☆ Save Job"}
          </button>
        </div>
      </div>

      <JobApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        job={{
          jobId: job.jobId,
          title: job.title,
          organizationName: job.organizationName,
          city: job.city,
          state: job.state,
          jobType: job.jobType || job.employmentType,
        }}
        onSuccess={handleApplicationSuccess}
      />
    </>
  );
}
