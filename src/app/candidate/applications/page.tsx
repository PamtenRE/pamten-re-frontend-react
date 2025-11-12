// src/app/candidate/applications/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import { candidateAPI } from "@/lib/api/candidate";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

// Parse error response and provide user-friendly message
const parseErrorMessage = (
  error: any
): { title: string; message: string; actionText?: string } => {
  if (!error) {
    return {
      title: "Something went wrong",
      message: "An unexpected error occurred. Please try refreshing the page.",
    };
  }

  let errorData = error;

  // If error message is a JSON string, parse it
  if (typeof error === "string") {
    try {
      errorData = JSON.parse(error);
    } catch (e) {
      return {
        title: "Error",
        message: error,
      };
    }
  }

  // Handle backend business errors
  if (errorData.error === "BUSINESS_ERROR") {
    // Check if it's a "no data found" error (which is actually not an error)
    const messageText = errorData.message || "";
    if (
      messageText.toLowerCase().includes("not found") ||
      messageText.toLowerCase().includes("no data") ||
      messageText.toLowerCase().includes("no applications") ||
      messageText.toLowerCase().includes("no results")
    ) {
      // This is actually a valid "empty" response, not an error
      return {
        title: "No Applications Yet",
        message:
          "You haven't applied for any jobs yet. Start your journey by browsing available positions!",
      };
    }

    return {
      title: "Service Temporarily Unavailable",
      message:
        "We're experiencing technical difficulties retrieving your applications. This might be a temporary issue. Please try again in a few moments.",
      actionText: "Try Again",
    };
  }

  // Handle 403 Forbidden
  if (errorData.status === 403 || error.includes("403")) {
    return {
      title: "Access Denied",
      message:
        "You don't have permission to view these applications. Please log in again.",
      actionText: "Log In Again",
    };
  }

  // Handle 404 Not Found (actual 404, not just no data)
  if (errorData.status === 404 || error.includes("404")) {
    return {
      title: "Not Found",
      message: "The applications you're looking for couldn't be found.",
    };
  }

  // Handle network errors
  if (error.includes("fetch") || error.includes("network")) {
    return {
      title: "Connection Error",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      actionText: "Try Again",
    };
  }

  // Default error
  return {
    title: "Unable to Load Applications",
    message: errorData.message || error,
    actionText: "Try Again",
  };
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isAuthReady, isLoading } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [timeFilter, setTimeFilter] = useState("all");
  const [applications, setApplications] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [rangeMonths, setRangeMonths] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyApplications, setEmptyApplications] = useState(false);

  useEffect(() => {
    if (!isAuthReady || isLoading) return;

    // Add a small delay to ensure localStorage is fully processed
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/");
        return;
      }
      if (user?.role?.toLowerCase() !== "candidate") {
        router.push("/");
      }
    }, 100); // Small delay to prevent race condition

    return () => clearTimeout(timeout);
  }, [isAuthReady, isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthenticated || !user?.userId || !token) return;
      setLoading(true);
      setError(null);
      setEmptyApplications(false);
      try {
        const apps = await candidateAPI.getApplications(user.userId, token);
        const list = Array.isArray(apps) ? apps : [];
        setApplications(list);
        // TODO: replace when timeline endpoint exists
        setTimeline([]);
        if (list.length === 0) {
          setEmptyApplications(true);
        }
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

        // If error indicates no data, treat as empty state instead of error
        if (
          errorObj?.error === "BUSINESS_ERROR" ||
          (typeof errorObj?.message === "string" &&
            (errorObj.message.toLowerCase().includes("not found") ||
              errorObj.message.toLowerCase().includes("no data") ||
              errorObj.message.toLowerCase().includes("no applications") ||
              errorObj.message.toLowerCase().includes("no results")))
        ) {
          setEmptyApplications(true);
          setError(null);
        } else {
          setError(e?.message || "Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isAuthenticated, user, token]);

  // Calculate analytics (from applications list until analytics endpoint available)
  const totalApplied = applications.length;
  const inReview = applications.filter(
    (j) => j.status === "under_review"
  ).length;
  const interviewsScheduled = applications.filter(
    (j) => j.status === "interview_scheduled" || j.status === "scheduled"
  ).length;
  const accepted = applications.filter((j) => j.status === "accepted").length;
  const rejected = applications.filter((j) => j.status === "rejected").length;

  // Weekly stats (placeholder until analytics endpoint is available)
  const weeklyApplied = 0;
  const weeklyRejected = 0;
  const weeklyAccepted = 0;
  const weeklyInterviews = 0;

  // Build monthly aggregates for simple line chart from applications list
  const monthlyData = useMemo(() => {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - (rangeMonths - 1),
      1
    );
    const buckets: Record<string, { label: string; applied: number }> = {};
    for (let i = 0; i < rangeMonths; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      buckets[key] = {
        label: d.toLocaleString(undefined, { month: "short" }),
        applied: 0,
      };
    }
    applications.forEach((a) => {
      const dt = new Date(a.appliedDate || a.createdAt || 0);
      if (dt >= start && dt <= now) {
        const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
        if (buckets[key]) buckets[key].applied += 1;
      }
    });
    return Object.values(buckets);
  }, [applications, rangeMonths]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter + sort applications
  const filteredJobs = useMemo(() => {
    let list = applications;

    // Filter by status
    if (filterStatus !== "all") {
      list = list.filter((j) => j.status === filterStatus);
    }

    // Filter by time period
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      list = list.filter((j) => {
        const appliedDate = new Date(j.appliedDate || j.createdAt || 0);
        return appliedDate >= filterDate;
      });
    }

    // Sort by date
    list = [...list].sort((a, b) => {
      const aDate = new Date(a.appliedDate || a.createdAt || 0).getTime();
      const bDate = new Date(b.appliedDate || b.createdAt || 0).getTime();
      return sortBy === "recent" ? bDate - aDate : aDate - bDate;
    });

    return list;
  }, [applications, filterStatus, sortBy, timeFilter]);

  // Show loading until auth is ready
  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user?.role?.toLowerCase() !== "candidate") {
    return null;
  }

  return (
    <>
      <CandidateSidebar />

      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-28 md:pl-44 transition-colors duration-300">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your Applied Jobs!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 italic">
              Track Your applications and see what next in your career journey
              🚀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Applications List (2/3) */}
            <div className="lg:col-span-2">
              {/* Simplified Filters */}
              <div className="glass rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      Filter by Status:
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Applications</option>
                      <option value="interview_scheduled">
                        Interview Scheduled
                      </option>
                      <option value="under_review">Under Review</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      Time Period:
                    </label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="3months">Last 3 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      Sort by Date:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                      <option value="recent">Latest to Oldest</option>
                      <option value="oldest">Oldest to Latest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredJobs.length} of {applications.length}{" "}
                applications
                {filterStatus !== "all" &&
                  ` (filtered by ${
                    statusConfig[filterStatus as keyof typeof statusConfig]
                      ?.label || filterStatus
                  })`}
                {timeFilter !== "all" &&
                  ` (${
                    timeFilter === "week"
                      ? "last week"
                      : timeFilter === "month"
                      ? "last month"
                      : "last 3 months"
                  })`}
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center text-gray-500 py-8">
                    Loading...
                  </div>
                )}
                {error && (
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="h-6 w-6 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                              {parseErrorMessage(error).title}
                            </h3>
                            <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                              {parseErrorMessage(error).message}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setError(null);
                              setLoading(false);
                              // Trigger re-fetch
                              window.location.reload();
                            }}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        {parseErrorMessage(error).actionText && (
                          <button
                            onClick={() => {
                              setError(null);
                              setLoading(false);
                              // Trigger re-fetch
                              window.location.reload();
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                          >
                            {parseErrorMessage(error).actionText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {!loading &&
                  !error &&
                  filteredJobs.map((job) => {
                    const isExpanded = expandedId === job.applicationId;
                    const statusInfo =
                      statusConfig[job.status as keyof typeof statusConfig];

                    return (
                      <div
                        key={job.applicationId}
                        className="glass rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <div className="p-6 flex flex-wrap items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🏢</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {job.company}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {job.position}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Date Applied: {job.appliedDate}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleExpand(job.applicationId)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              View Application
                            </button>
                            <button
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                              onClick={async () => {
                                try {
                                  await candidateAPI.withdrawApplication(
                                    job.applicationId,
                                    user?.userId || "",
                                    token || ""
                                  );
                                  setApplications((prev) =>
                                    prev.filter(
                                      (a) =>
                                        a.applicationId !== job.applicationId
                                    )
                                  );
                                } catch (e: any) {
                                  const errorMessage = parseErrorMessage(e);
                                  alert(errorMessage.message);
                                }
                              }}
                            >
                              Withdraw
                            </button>
                          </div>
                        </div>

                        {/* Expanded View */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-zinc-800">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-4xl">🏢</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                  {job.position}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {job.department}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {job.location}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                                  {job.salaryRange}
                                </p>
                              </div>
                            </div>

                            {/* Application Progress Tracker (blob-based, consistent with homepage) */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center">
                                Application Status
                              </h4>

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
                          </div>
                        )}
                      </div>
                    );
                  })}
                {emptyApplications && !error && !loading && (
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 p-12 text-center">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto text-blue-400 dark:text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                      You haven't applied to any jobs yet. Start exploring
                      opportunities and build your career with us!
                    </p>
                    <button
                      onClick={() => router.push("/candidate/jobs")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Analytics (1/3) */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Analytics
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Jobs Applied
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalApplied}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Applications in Review
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {inReview}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Interviews Scheduled
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {interviewsScheduled}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Accepted
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {accepted}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Rejected
                    </span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {rejected}
                    </span>
                  </div>
                </div>

                {/* Simple Line Chart with range filter */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Applications over time
                    </h3>
                    <select
                      value={rangeMonths}
                      onChange={(e) => setRangeMonths(Number(e.target.value))}
                      className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                    >
                      <option value={1}>Last 1 month</option>
                      <option value={3}>Last 3 months</option>
                      <option value={6}>Last 6 months</option>
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="label"
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="applied"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weekly Stats Summary */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Applied
                    </p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {weeklyApplied}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This week
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Interviews
                    </p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {weeklyInterviews}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This week
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Accepted
                    </p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {weeklyAccepted}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This week
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Rejected
                    </p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300">
                      {weeklyRejected}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This week
                    </p>
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep Going! You're just one application away from your next
                    big step :) !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
