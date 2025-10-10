"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import ProfileProgressCard from "@/components/candidate/ProfileProgressCard";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import AppliedJobItem from "@/components/candidate/AppliedJobItem";
import Link from "next/link";

export default function CandidateDashboardPage() {
  const { user, token, isAuthenticated, profileProgress } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [showProgressCard, setShowProgressCard] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user?.role?.toLowerCase() !== "candidate") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user || user?.role?.toLowerCase() !== "candidate") {
    return null;
  }

  return (
    <>
      <CandidateSidebar />

      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-20 md:pl-48 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="pt-4 mt-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back, {user.email.split("@")[0] || "Candidate"} !! 👋
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span>
                {/*  */}
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

          {/* Section Header */}
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
                      salary: undefined, // Keep empty for now
                      employmentType: job.jobType || "Not specified",
                      tags: job.requiredSkills
                        ? job.requiredSkills
                            .split(",")
                            .map((skill: string) => skill.trim())
                        : [],
                    }}
                    onApply={(jobId) => console.log("Apply to job:", jobId)}
                    onSave={(jobId) => console.log("Save job:", jobId)}
                  />
                ))}
              </div>
            )}
            {/* Applied Jobs Section */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                  Applied Jobs
                </h2>
              </div>
              <button
                onClick={() => router.push("/candidate/applications")}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-4 mt-6">
              {appliedJobs.slice(0, 3).map((job) => (
                <AppliedJobItem
                  key={job.id}
                  appliedJob={job}
                  onClick={(id) => console.log("View applied job:", id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
