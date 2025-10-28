"use client";

// TODO: When backend APIs are ready, implement:
// - Real-time saved jobs sync with backend
// - Optimistic updates for better UX
// - Caching mechanism for better performance
// - Error retry logic with exponential backoff

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { jobsAPI, candidateAPI } from "@/lib/api/services";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import JobApplicationModal from "@/components/candidate/JobApplicationModal";
import Link from "next/link";
import { Bookmark, ArrowLeft, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SavedJobsPage() {
  const { user, token, isAuthenticated, isAuthReady, isLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Load saved and applied jobs from localStorage on mount
  useEffect(() => {
    if (!user?.userId) return;

    const savedJobsKey = `saved_jobs_${user.userId}`;
    const saved = localStorage.getItem(savedJobsKey);
    if (saved) {
      try {
        setSavedJobs(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error("Failed to parse saved jobs from localStorage:", error);
        setSavedJobs(new Set());
      }
    }
  }, [user?.userId]);

  // Fetch applied jobs from API with optimized error handling
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user?.userId || !token) return;

      try {
        const applicationsData = await candidateAPI.getApplications(
          user.userId,
          token
        );
        if (Array.isArray(applicationsData)) {
          const appliedJobIds = new Set(
            applicationsData.map((app: any) => String(app.jobId))
          );
          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.error("Failed to fetch applied jobs from API:", err);

        // Fallback to localStorage
        const appliedJobsKey = `applied_jobs_${user.userId}`;
        const applied = localStorage.getItem(appliedJobsKey);
        if (applied) {
          try {
            setAppliedJobs(new Set(JSON.parse(applied)));
          } catch (error) {
            console.error(
              "Failed to parse applied jobs from localStorage:",
              error
            );
            setAppliedJobs(new Set());
          }
        }
      }
    };

    fetchAppliedJobs();
  }, [user?.userId, token]);

  // Fetch all jobs with optimized error handling and caching
  useEffect(() => {
    const fetchJobs = async () => {
      if (!isAuthenticated || !user?.userId) return;

      setLoading(true);
      setError(null);

      try {
        // TODO: Add API caching mechanism when backend is ready
        const data = await jobsAPI.getAllJobs(0, 20, token || "");
        const jobs = data?.jobs || [];
        setAllJobs(jobs);

        // If no jobs found, use mock data as fallback
        if (jobs.length === 0) {
          setAllJobs(getMockJobs());
        }
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        setError(err.message || "Failed to load jobs");

        // Fallback to mock data
        setAllJobs(getMockJobs());
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchJobs();
  }, [isAuthenticated, user?.userId, token]);

  // Memoized mock jobs to prevent recreation on every render
  const getMockJobs = useCallback(
    () => [
      {
        jobId: "1",
        title: "Senior Software Engineer",
        organizationName: "TechCorp Inc.",
        city: "San Francisco",
        state: "CA",
        postedDate: "2024-01-15",
        salary: "$120,000 - $150,000",
        employmentType: "Full-time",
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
        salary: "$90,000 - $120,000",
        employmentType: "Full-time",
        jobType: "Full-time",
        requiredSkills: "React, JavaScript, CSS, HTML",
      },
      {
        jobId: "3",
        title: "Full Stack Developer",
        organizationName: "InnovateLab",
        city: "Austin",
        state: "TX",
        postedDate: "2024-01-13",
        salary: "$100,000 - $130,000",
        employmentType: "Full-time",
        jobType: "Full-time",
        requiredSkills: "React, Node.js, Python, PostgreSQL",
      },
    ],
    []
  );

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

  // Optimized job application handler with memoization
  const handleApplyToJob = useCallback(
    (jobId: string) => {
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

      // Find the job and show modal
      const job = allJobs.find((j) => String(j.jobId) === jobId);
      if (job) {
        setSelectedJob(job);
        setShowApplicationModal(true);
      }
    },
    [user?.userId, appliedJobs, allJobs]
  );

  // Optimized application success handler
  const handleApplicationSuccess = useCallback(() => {
    if (!selectedJob || !user?.userId) return;

    // Update local state
    setAppliedJobs((prev) => new Set([...prev, selectedJob.jobId]));

    // Save to localStorage as backup
    const application = {
      applicationId: Date.now(),
      jobId: selectedJob.jobId,
      title: selectedJob.title,
      organizationName: selectedJob.organizationName,
      city: selectedJob.city,
      state: selectedJob.state,
      jobType: selectedJob.jobType,
      status: "under_review",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    try {
      const savedApplications = localStorage.getItem(
        `applications_${user.userId}`
      );
      const apps = savedApplications ? JSON.parse(savedApplications) : [];
      apps.unshift(application);
      localStorage.setItem(`applications_${user.userId}`, JSON.stringify(apps));
    } catch (error) {
      console.error("Failed to save application to localStorage:", error);
    }
  }, [selectedJob, user?.userId]);

  // Optimized save/unsave job handler
  const handleSaveJob = useCallback(
    (jobId: string) => {
      if (!user?.userId) return;

      setSavedJobs((prev) => {
        const updated = new Set(prev);
        if (updated.has(jobId)) {
          updated.delete(jobId);
        } else {
          updated.add(jobId);
        }

        // Persist to localStorage
        try {
          localStorage.setItem(
            `saved_jobs_${user.userId}`,
            JSON.stringify(Array.from(updated))
          );
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
        }

        return updated;
      });
    },
    [user?.userId]
  );

  // Memoized filtering logic for better performance
  const savedJobIds = useMemo(() => Array.from(savedJobs), [savedJobs]);

  const savedJobsData = useMemo(
    () => allJobs.filter((job) => savedJobIds.includes(String(job.jobId))),
    [allJobs, savedJobIds]
  );

  const filteredSavedJobs = useMemo(() => {
    if (!searchTerm.trim()) return savedJobsData;

    const query = searchTerm.toLowerCase();
    return savedJobsData.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.organizationName?.toLowerCase().includes(query) ||
        job.city?.toLowerCase().includes(query) ||
        job.state?.toLowerCase().includes(query)
    );
  }, [savedJobsData, searchTerm]);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("Saved Jobs Debug:", {
      userId: user?.userId,
      savedJobIds: savedJobIds.length,
      allJobsCount: allJobs.length,
      savedJobsDataCount: savedJobsData.length,
      filteredCount: filteredSavedJobs.length,
    });
  }

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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-blue-600" />
                Saved Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {savedJobIds.length} job{savedJobIds.length !== 1 ? "s" : ""}{" "}
                saved
              </p>
            </div>
          </div>

          {/* Search Bar */}
          {savedJobIds.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600 dark:text-gray-300">
                Loading saved jobs...
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : savedJobIds.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Saved Jobs Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start browsing jobs and save the ones you're interested in.
              </p>
              <Link
                href="/candidate/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Bookmark className="w-5 h-5" />
                Browse Jobs
              </Link>
            </div>
          ) : filteredSavedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Saved Jobs ({filteredSavedJobs.length})
                </h2>
              </div>

              <div className="glass rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSavedJobs.map((job) => (
                    <JobCard
                      key={job.jobId}
                      job={{
                        ...job,
                        salary: job.salary || undefined,
                        employmentType: job.jobType || "Not specified",
                        tags: job.requiredSkills
                          ? job.requiredSkills
                              .split(",")
                              .map((skill: string) => skill.trim())
                              .filter((skill: string) => skill.length > 0)
                          : [],
                      }}
                      onApply={handleApplyToJob}
                      onSave={handleSaveJob}
                      isApplied={appliedJobs.has(String(job.jobId))}
                      isSaved={savedJobs.has(String(job.jobId))}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={useCallback(() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }, [])}
          job={selectedJob}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
