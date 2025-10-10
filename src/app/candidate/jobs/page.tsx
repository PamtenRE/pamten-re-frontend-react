"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.organizationName?.toLowerCase().includes(query) ||
        job.city?.toLowerCase().includes(query) ||
        job.state?.toLowerCase().includes(query) ||
        job.requiredSkills?.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Browse All Jobs"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? `${filteredJobs.length} jobs found`
                : `${jobs.length} jobs available`}
            </p>
          </div>

          {/* Jobs Grid */}
          <div className="glass rounded-xl shadow-lg p-8">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading jobs...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? `No jobs found matching "${searchQuery}"`
                  : "No jobs found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
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
          </div>
        </div>
      </div>
    </>
  );
}
