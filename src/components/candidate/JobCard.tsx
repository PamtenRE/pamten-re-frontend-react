"use client";

import { useState, useEffect } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { useAuth } from "@/contexts/AuthContext";

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
  const [saved, setSaved] = useState(isSaved);
  const [animateSave, setAnimateSave] = useState(false);
  const { user } = useAuth();

  // ✅ Sync saved state with localStorage (persistent after refresh)
  useEffect(() => {
    if (!user?.userId) return;
    const key = `saved_jobs_${user.userId}`;
    const savedList = localStorage.getItem(key);
    if (savedList) {
      try {
        const jobs = JSON.parse(savedList);
        const isJobSaved = jobs.some(
          (j: any) => String(j.jobId) === String(job.jobId)
        );
        setSaved(isJobSaved);
      } catch (err) {
        console.error("Failed to parse saved jobs:", err);
      }
    }
  }, [user?.userId, job.jobId]);

  const handleApplyClick = () => {
    if (isApplied) return; // no alert, silent skip
    setShowModal(true);
  };

  const handleApplicationSuccess = () => {
    onApply?.(job.jobId);
  };

  // ✅ Save/Unsave handler (silent + animation)
  const handleSaveClick = () => {
    setSaved((prev) => !prev);
    setAnimateSave(true); // trigger animation
    setTimeout(() => setAnimateSave(false), 300); // reset animation

    onSave?.(job.jobId);
    if (typeof window === "undefined" || !user?.userId) return;

    const key = `saved_jobs_${user.userId}`;
    const savedList = localStorage.getItem(key);
    let jobs = savedList ? JSON.parse(savedList) : [];

    if (saved) {
      // Remove if unsaved
      jobs = jobs.filter((j: any) => String(j.jobId) !== String(job.jobId));
    } else {
      // ✅ Sanitize before saving
      if (!job.jobId || !job.title || !job.organizationName) return;

      const jobData = {
        jobId: String(job.jobId),
        title: job.title.trim(),
        organizationName: job.organizationName.trim(),
        city: job.city || "",
        state: job.state || "",
        jobType: job.jobType || job.employmentType || "Not specified",
        requiredSkills: Array.isArray(job.tags)
          ? job.tags.join(",")
          : job.requiredSkills || "",
        salary: job.salary || "",
      };

      const exists = jobs.some(
        (j: any) => String(j.jobId) === String(job.jobId)
      );
      if (!exists) jobs.unshift(jobData);
    }

    localStorage.setItem(key, JSON.stringify(jobs));
  };

  return (
    <>
      <div className="glass border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-xl transition-all duration-300 relative">
        {/* Applied badge */}
        {isApplied && (
          <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Applied
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {job.title}
        </h3>

        {/* Company */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {job.organizationName}
        </p>

        {/* Location */}
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
          {job.city}, {job.state}
        </p>

        {/* Employment type */}
        {job.employmentType && (
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {job.employmentType}
            </span>
          </div>
        )}

        {/* Tags */}
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

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Apply Button */}
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

          {/* Save Button (with animation) */}
          <button
            onClick={handleSaveClick}
            className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-all duration-200 transform ${
              saved
                ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            } ${animateSave ? "scale-105" : "scale-100"}`}
          >
            {saved ? "★ Saved" : "☆ Save Job"}
          </button>
        </div>
      </div>

      {/* Application modal */}
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
