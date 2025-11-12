"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import JobCard from "@/components/candidate/JobCard";
import { jobsAPI, candidateAPI } from "@/lib/api/services";
import { Search } from "lucide-react";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { user, token, isAuthenticated, isAuthReady, isLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    experience: "All",
    sort: "Latest",
  });

  // 🔒 Auth guard
  useEffect(() => {
    if (!isAuthReady || isLoading) return;
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) router.push("/");
      else if (user?.role?.toLowerCase() !== "candidate") router.push("/");
    }, 150);
    return () => clearTimeout(timeout);
  }, [isAuthReady, isLoading, isAuthenticated, user, router]);

  // 🧠 Fetch jobs
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
        setError("Failed to fetch jobs, showing sample data.");

        // fallback mock data
        setJobs([
          {
            jobId: "1",
            title: "Full Stack Engineer",
            organizationName: "TechCorp",
            city: "New York",
            state: "NY",
            jobType: "Full-time",
            requiredSkills: "React, Node.js, TypeScript, AWS",
          },
          {
            jobId: "2",
            title: "Data Analyst",
            organizationName: "Datafy Inc.",
            city: "Austin",
            state: "TX",
            jobType: "Remote",
            requiredSkills: "SQL, PowerBI, Python",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // 🧩 Fetch user data (saved/applied)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userId || !token) return;

      try {
        const applicationsData = await candidateAPI.getApplications(
          user.userId,
          token
        );
        if (Array.isArray(applicationsData)) {
          const appliedIds = new Set(
            applicationsData.map((a: any) => String(a.jobId))
          );
          setAppliedJobs(appliedIds);
        }
      } catch {
        const storedApps = localStorage.getItem(`applications_${user.userId}`);
        if (storedApps) {
          const apps = JSON.parse(storedApps);
          setAppliedJobs(new Set(apps.map((a: any) => String(a.jobId))));
        }
      }

      const storedSaved = localStorage.getItem(`saved_jobs_${user.userId}`);
      if (storedSaved) {
        setSavedJobs(new Set(JSON.parse(storedSaved)));
      }
    };

    fetchUserData();
  }, [user?.userId, token]);

  // 🧭 Apply / Save handlers
  const handleApply = (jobId: string) => {
    if (!user?.userId) return;
    if (appliedJobs.has(jobId)) return;

    setAppliedJobs((prev) => new Set([...prev, jobId]));

    const job = jobs.find((j) => String(j.jobId) === jobId);
    if (job) {
      const newApp = {
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
      const stored = localStorage.getItem(`applications_${user.userId}`);
      const updated = stored ? JSON.parse(stored) : [];
      updated.unshift(newApp);
      localStorage.setItem(
        `applications_${user.userId}`,
        JSON.stringify(updated)
      );
    }
  };

  const handleSave = (jobId: string) => {
    if (!user?.userId) return;
    const newSaved = new Set(savedJobs);
    newSaved.has(jobId) ? newSaved.delete(jobId) : newSaved.add(jobId);
    setSavedJobs(newSaved);
    localStorage.setItem(
      `saved_jobs_${user.userId}`,
      JSON.stringify(Array.from(newSaved))
    );
  };

  // ✅ Fixed Filtering Logic
  const filteredJobs = useMemo(() => {
    let results = [...jobs];

    // 🔍 Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      results = results.filter((j) =>
        [j.title, j.organizationName, j.city, j.state, j.requiredSkills]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    // 🎯 Job Type filter
    if (
      filters.type &&
      filters.type !== "All" &&
      filters.type !== "All Types"
    ) {
      results = results.filter(
        (j) =>
          j.jobType &&
          j.jobType.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    // 📍 Location filter
    if (
      filters.location &&
      filters.location !== "All" &&
      filters.location !== "All Locations"
    ) {
      results = results.filter((j) => {
        const loc = `${j.city || ""}, ${j.state || ""}`.toLowerCase();
        return loc.includes(filters.location.toLowerCase());
      });
    }

    // 💼 Experience filter (optional placeholder)
    if (
      filters.experience &&
      filters.experience !== "All" &&
      filters.experience !== "All Levels"
    ) {
      results = results.filter((j) =>
        j.requiredSkills
          ?.toLowerCase()
          .includes(filters.experience.toLowerCase())
      );
    }

    // 🕓 Sort filter
    if (filters.sort === "Title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sort === "Company") {
      results.sort((a, b) =>
        a.organizationName.localeCompare(b.organizationName)
      );
    } else if (filters.sort === "Latest") {
      results.sort(
        (a, b) =>
          new Date(b.postedDate || "").getTime() -
          new Date(a.postedDate || "").getTime()
      );
    }

    return results;
  }, [jobs, searchTerm, filters]);

  // 🌀 Loading or unauthenticated
  if (!isAuthReady || isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300">
        Loading jobs...
      </div>
    );

  if (!isAuthenticated || !user) return null;

  // 🧱 UI
  return (
    <>
      <CandidateSidebar />
      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-20 md:pl-48 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
              Browse All Jobs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {jobs.length} jobs available
            </p>
          </div>

          {/* 🔍 Compact Filter Bar */}
          <div className="sticky top-20 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 transition-all">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search title, company, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 w-full md:w-auto">
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800/70 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800/70 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option>All Locations</option>
                {Array.from(new Set(jobs.map((j) => `${j.city}, ${j.state}`)))
                  .filter((loc) => loc && loc !== "undefined, undefined")
                  .map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
              </select>

              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: e.target.value })
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800/70 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option>All Levels</option>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800/70 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option>Latest</option>
                <option>Title</option>
                <option>Company</option>
              </select>

              <button
                onClick={() =>
                  setFilters({
                    type: "All",
                    location: "All",
                    experience: "All",
                    sort: "Latest",
                  })
                }
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No jobs found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.jobId}
                  job={{
                    ...job,
                    employmentType: job.jobType || "Not specified",
                    tags: job.requiredSkills
                      ? job.requiredSkills
                          .split(",")
                          .map((s: string) => s.trim())
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
    </>
  );
}
