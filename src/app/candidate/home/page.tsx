"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import ProfileProgressCard from "@/components/candidate/ProfileProgressCard";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import AppliedJobsSection from "@/components/candidate/AppliedJobsSection";
import Link from "next/link";

export default function CandidateDashboardPage() {
  const {
    user,
    token,
    isAuthenticated,
    isAuthReady,
    isLoading,
    profileProgress,
  } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProgressCard, setShowProgressCard] = useState(true);

  // Load saved and applied jobs from localStorage on mount
  useEffect(() => {
    if (!user?.userId) return;

    const savedJobsKey = `saved_jobs_${user.userId}`;
    const appliedJobsKey = `applied_jobs_${user.userId}`;

    const saved = localStorage.getItem(savedJobsKey);
    const applied = localStorage.getItem(appliedJobsKey);

    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
    if (applied) {
      setAppliedJobs(new Set(JSON.parse(applied)));
    }
  }, [user?.userId]);

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
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch("/api/jobs/v1/all", {}, token || undefined);
        setJobs(data.jobs || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchJobs();
  }, [token]);

  const handleCompleteProfile = () => {
    router.push("/candidate/profile");
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user) return;
    try {
      await apiFetch(
        "/api/applications/v1/apply",
        {
          method: "POST",
          body: JSON.stringify({ jobId, candidateId: user.userId }),
        },
        token || undefined
      );
      // Track applied job in local state and localStorage
      const updatedAppliedJobs = new Set(appliedJobs);
      updatedAppliedJobs.add(jobId);
      setAppliedJobs(updatedAppliedJobs);
      localStorage.setItem(
        `applied_jobs_${user.userId}`,
        JSON.stringify(Array.from(updatedAppliedJobs))
      );
      // Optionally: refresh or show a toast; keeping minimal per request
    } catch (err) {
      // Optionally: handle error/toast
    }
  };

  const handleSaveJob = (jobId: string) => {
    if (!user?.userId) return;

    const updatedSavedJobs = new Set(savedJobs);

    if (updatedSavedJobs.has(jobId)) {
      // Remove from saved
      updatedSavedJobs.delete(jobId);
    } else {
      // Add to saved
      updatedSavedJobs.add(jobId);
    }

    setSavedJobs(updatedSavedJobs);

    // Persist to localStorage
    localStorage.setItem(
      `saved_jobs_${user.userId}`,
      JSON.stringify(Array.from(updatedSavedJobs))
    );
  };

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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back, {user.email.split("@")[0] || "Candidate"} !! 👋
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span>
                {user.location || "Sausalito, California, United States"}
              </span>
              <span className="mx-2">•</span>

              <Link
                href="/candidate/profile"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact Info
              </Link>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Ready To find Your next Opportunity ? You have{" "}
              <span className="font-semibold">5</span> new job matches today
            </p>
          </div>

          {/* Profile Progress Card */}
          {showProgressCard && (
            <ProfileProgressCard
              progress={profileProgress}
              onCompleteClick={handleCompleteProfile}
              onClose={() => setShowProgressCard(false)}
            />
          )}

          {/* Recommended Jobs Section */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recommended For You!
              </h2>
            </div>
            <button
              onClick={() => router.push("/candidate/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View All Jobs
            </button>
          </div>

          {/* Job Listing Section */}
          <div>
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading jobs...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No jobs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.slice(0, 6).map((job) => (
                  <JobCard
                    key={job.jobId}
                    job={{
                      ...job,
                      salary: undefined,
                      employmentType: job.jobType || "Not specified",
                      tags: job.requiredSkills
                        ? job.requiredSkills
                            .split(",")
                            .map((skill: string) => skill.trim())
                        : [],
                    }}
                    onApply={(jobId) => handleApplyToJob(jobId)}
                    onSave={(jobId) => handleSaveJob(jobId)}
                    isSaved={savedJobs.has(job.jobId)}
                    isApplied={appliedJobs.has(job.jobId)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            {/* Applied Jobs Section - Using the new component */}
            <AppliedJobsSection />
          </div>
        </div>
      </div>
    </>
  );
}
