// src/components/candidate/AppliedJobsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/utils/api";

const statusConfig = {
  interview_scheduled: {
    label: "Interview Scheduled",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  under_review: {
    label: "Under Review",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  accepted: {
    label: "Accepted",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
};

export default function AppliedJobsSection() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      if (!isAuthenticated || !user?.userId || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(
          `/api/applications/v1/candidate/${user.userId}`,
          {},
          token
        );
        const apps = Array.isArray(data) ? data : data?.applications || [];
        setRecentJobs(apps.slice(0, 3));
      } catch (e: any) {
        // Check if the error is actually a "no applications" response
        let errorObj = e;
        if (typeof e?.message === "string") {
          try {
            errorObj = JSON.parse(e.message);
          } catch {
            // Not JSON, keep original error
          }
        }

        // If error indicates no data (BUSINESS_ERROR is commonly used for "not found"),
        // treat as empty result instead of error
        if (
          errorObj?.error === "BUSINESS_ERROR" ||
          (typeof errorObj?.message === "string" &&
            (errorObj.message.toLowerCase().includes("not found") ||
              errorObj.message.toLowerCase().includes("no data") ||
              errorObj.message.toLowerCase().includes("no applications") ||
              errorObj.message.toLowerCase().includes("no results")))
        ) {
          // Silently treat as empty - don't show error
          setRecentJobs([]);
          setError(null);
        } else {
          // Only show error for actual failures
          setError(e?.message || "Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecentApplications();
  }, [isAuthenticated, user, token]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Your Applied Jobs!
        </h2>
        <button
          onClick={() => router.push("/candidate/applications")}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
        >
          View All →
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 italic">
        Track Your applications and see what next in your career journey 🚀
      </p>

      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
        {!loading &&
          !error &&
          recentJobs.map((job) => {
            const statusInfo = statusConfig[
              job.status as keyof typeof statusConfig
            ] || {
              label: job.status || "Unknown",
              className:
                "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
            };
            const isExpanded = expandedId === job.id;

            return (
              <div
                key={job.id}
                className="glass rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Job Card Header - Always Visible */}
                <div
                  className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer"
                  onClick={() => toggleExpand(job.id)}
                >
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                      {job.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.position}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Applied: {job.appliedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content - Job Details & Status */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🏢</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {job.position}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.department}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                          {job.salaryRange}
                        </p>
                      </div>
                    </div>

                    {/* Application Progress Tracker */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center">
                        Application Status
                      </h4>

                      {/* Progress Bar with Checkpoints */}
                      <div className="relative px-4">
                        {/* Connection Line */}
                        <div
                          className="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"
                          style={{ left: "10%", right: "10%" }}
                        />

                        {/* Completed Progress Line */}
                        <div
                          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                          style={{
                            left: "10%",
                            width: `${
                              (job.applicationStages.filter(
                                (s: any) => s.completed
                              ).length -
                                1) *
                              20
                            }%`,
                          }}
                        />

                        {/* Stage Checkpoints */}
                        <div className="relative flex justify-between items-start">
                          {job.applicationStages.map(
                            (stage: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex flex-col items-center"
                                style={{ width: "20%" }}
                              >
                                {/* Blob Checkpoint */}
                                <div className="relative z-10 mb-3">
                                  {stage.completed ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                                      <svg
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600" />
                                  )}
                                </div>

                                {/* Stage Text */}
                                <p
                                  className={`text-xs text-center leading-tight ${
                                    stage.completed
                                      ? "text-gray-900 dark:text-white font-semibold"
                                      : "text-gray-500 dark:text-gray-500"
                                  }`}
                                >
                                  {stage.stage}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Centered Action Button */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/candidate/applications");
                        }}
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
