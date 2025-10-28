"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import JobApplicationModal from "@/components/candidate/JobApplicationModal";
import Link from "next/link";
import { Bookmark, ArrowLeft, Search } from "lucide-react";

export default function SavedJobsPage() {
  const { user, isAuthenticated, isAuthReady, isLoading } = useAuth();
  const router = useRouter();

  const [savedJobsList, setSavedJobsList] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // ✅ Load saved jobs from localStorage
  useEffect(() => {
    if (!user?.userId) return;
    const key = `saved_jobs_${user.userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validJobs = parsed.filter(
          (j: any) => j && j.title && j.organizationName && j.jobId
        );
        setSavedJobsList(validJobs);
      } catch (error) {
        console.error("Failed to parse saved jobs from localStorage:", error);
        setSavedJobsList([]);
      }
    }
  }, [user?.userId]);

  // ✅ Handle save/unsave job
  const handleSaveJob = useCallback(
    (jobId: string) => {
      if (!user?.userId) return;
      const key = `saved_jobs_${user.userId}`;
      let jobs = [...savedJobsList];
      jobs = jobs.filter((j) => String(j.jobId) !== String(jobId));
      localStorage.setItem(key, JSON.stringify(jobs));
      setSavedJobsList(jobs);
    },
    [savedJobsList, user?.userId]
  );

  // ✅ Handle apply (open modal)
  const handleApplyToJob = useCallback(
    (jobId: string) => {
      const job = savedJobsList.find((j) => String(j.jobId) === String(jobId));
      if (job) {
        setSelectedJob(job);
        setShowApplicationModal(true);
      }
    },
    [savedJobsList]
  );

  // ✅ On successful application
  const handleApplicationSuccess = useCallback(() => {
    if (!selectedJob || !user?.userId) return;

    setAppliedJobs((prev) => new Set([...prev, selectedJob.jobId]));

    const key = `applications_${user.userId}`;
    const savedApps = localStorage.getItem(key);
    const apps = savedApps ? JSON.parse(savedApps) : [];
    const newApp = {
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
    localStorage.setItem(key, JSON.stringify([newApp, ...apps]));
  }, [selectedJob, user?.userId]);

  // ✅ Search filter
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return savedJobsList;
    const query = searchTerm.toLowerCase();
    return savedJobsList.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.organizationName?.toLowerCase().includes(query) ||
        job.city?.toLowerCase().includes(query) ||
        job.state?.toLowerCase().includes(query)
    );
  }, [searchTerm, savedJobsList]);

  // ✅ Auth check
  useEffect(() => {
    if (!isAuthReady || isLoading) return;
    if (!isAuthenticated || !user || user.role?.toLowerCase() !== "candidate") {
      router.push("/");
    }
  }, [isAuthReady, isLoading, isAuthenticated, user, router]);

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <>
      <CandidateSidebar />

      {/* ✅ Page Container */}
      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-28 md:pl-44 transition-colors duration-300 relative z-0 overflow-visible">
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
                {savedJobsList.length} job
                {savedJobsList.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>

          {/* Search Bar */}
          {savedJobsList.length > 0 && (
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

          {/* Main Content */}
          {savedJobsList.length === 0 ? (
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
          ) : filteredJobs.length === 0 ? (
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Saved Jobs ({filteredJobs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job, idx) => (
                  <JobCard
                    key={job.jobId ? String(job.jobId) : `job-${idx}`}
                    job={{
                      ...job,
                      employmentType: job.jobType || "Not specified",
                      tags: job.requiredSkills
                        ? job.requiredSkills
                            .split(",")
                            .map((s: string) => s.trim())
                            .filter((s: string) => s.length > 0)
                        : [],
                    }}
                    onApply={handleApplyToJob}
                    onSave={handleSaveJob}
                    isApplied={appliedJobs.has(String(job.jobId))}
                    isSaved
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
