"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jobsAPI, candidateAPI } from "@/lib/api/services";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useToast } from "@/components/ui/Toast";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { user, token, isAuthenticated, isAuthReady, isLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthReady || isLoading) return;

    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/");
        return;
      }
      if (user?.role?.toLowerCase() !== "candidate") {
        router.push("/");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthReady, isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await jobsAPI.getAllJobs(0, 20, token);
        setJobs(data.jobs || []);
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        setError(err.message || "Failed to fetch jobs");

        // Fallback to mock data if API fails
        const mockJobs = [
          {
            jobId: "1",
            title: "Senior Software Engineer",
            organizationName: "TechCorp Inc.",
            city: "San Francisco",
            state: "CA",
            postedDate: "2024-01-15",
            jobType: "Full-time",
            requiredSkills: "React, Node.js, TypeScript, AWS",
          },
          {
            jobId: "2",
            title: "Frontend Developer",
            organizationName: "StartupXYZ",
            city: "New York",
            state: "NY",
            postedDate: "2024-01-14",
            jobType: "Full-time",
            requiredSkills: "React, JavaScript, CSS, HTML",
          },
        ];
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // Fetch applied jobs and saved jobs
  useEffect(() => {
    const fetchUserApplications = async () => {
      if (!user?.userId || !token) return;

      try {
        // Try to fetch from API first
        const applicationsData = await candidateAPI.getApplications(
          user.userId,
          token
        );
        if (applicationsData && Array.isArray(applicationsData)) {
          const appliedJobIds = new Set(
            applicationsData.map((app: any) => String(app.jobId))
          );
          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.error("Failed to fetch user applications from API:", err);

        // Fallback to localStorage
        const savedApplications = localStorage.getItem(
          `applications_${user.userId}`
        );
        if (savedApplications) {
          const apps = JSON.parse(savedApplications);
          const appliedJobIds = new Set<string>(
            apps.map((app: any) => String(app.jobId))
          );
          setAppliedJobs(appliedJobIds);
        }
      }

      // Load saved jobs from localStorage (no API endpoint for this yet)
      const saved = localStorage.getItem(`saved_jobs_${user.userId}`);
      if (saved) {
        setSavedJobs(new Set(JSON.parse(saved)));
      }
    };

    fetchUserApplications();
  }, [user?.userId, token]);

  // Apply to job handler
  const handleApply = async (jobId: string) => {
    if (!user?.userId) {
      addToast({
        type: "warning",
        title: "Login Required",
        message: "Please log in to apply",
      });
      return;
    }

    if (appliedJobs.has(jobId)) {
      addToast({
        type: "info",
        title: "Already Applied",
        message: "You have already applied to this job!",
      });
      return;
    }

    // Update local state
    setAppliedJobs((prev) => new Set([...prev, jobId]));

    // Save to localStorage
    const job = jobs.find((j) => String(j.jobId) === jobId);
    if (job) {
      const application = {
        applicationId: Date.now(),
        jobId: job.jobId,
        title: job.title,
        organizationName: job.organizationName,
        city: job.city,
        state: job.state,
        jobType: job.jobType,
        status: "under_review",
        appliedDate: new Date().toISOString().split("T")[0],
      };

      const savedApplications = localStorage.getItem(
        `applications_${user.userId}`
      );
      const apps = savedApplications ? JSON.parse(savedApplications) : [];
      apps.unshift(application);
      localStorage.setItem(`applications_${user.userId}`, JSON.stringify(apps));
    }
  };

  // Save job handler
  const handleSave = async (jobId: string) => {
    if (!user?.userId) {
      addToast({
        type: "warning",
        title: "Login Required",
        message: "Please log in to save jobs",
      });
      return;
    }

    const newSavedJobs = new Set(savedJobs);

    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      addToast({
        type: "info",
        title: "Job Removed",
        message: "Job removed from saved jobs",
      });
    } else {
      newSavedJobs.add(jobId);
      addToast({
        type: "success",
        title: "Job Saved!",
        message: "✨ Job saved successfully!",
      });
    }

    setSavedJobs(newSavedJobs);
    localStorage.setItem(
      `saved_jobs_${user.userId}`,
      JSON.stringify(Array.from(newSavedJobs))
    );
  };

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

      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-20 md:pl-48 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
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
                      salary: undefined,
                      employmentType: job.jobType || "Not specified",
                      tags: job.requiredSkills
                        ? job.requiredSkills
                            .split(",")
                            .map((skill: string) => skill.trim())
                            .filter((skill: string) => skill.length > 0) // ✅ FIXED: Filter empty tags
                        : [],
                    }}
                    onApply={handleApply}
                    onSave={handleSave}
                    isApplied={appliedJobs.has(String(job.jobId))}
                    isSaved={savedJobs.has(String(job.jobId))}
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
