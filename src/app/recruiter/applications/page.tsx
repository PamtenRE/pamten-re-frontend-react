"use client";

import React, { useEffect, useState } from "react";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/utils/api";
import Link from "next/link";

interface Job {
  id: string | number;
  title: string;
  status: "Active" | "Closed" | "Draft";
  location: string;
  applicants: number;
  jobType: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  postedOn: string;
}

const filters = ["All", "Active", "Closed", "Draft"];

export default function ApplicationsPage() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Load mock jobs immediately
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: 1,
        title: "Frontend Developer",
        status: "Active",
        location: "New York, NY",
        applicants: 14,
        jobType: "Full-Time",
        postedOn: "Oct 5, 2025",
      },
      {
        id: 2,
        title: "UX Designer",
        status: "Active",
        location: "Remote",
        applicants: 9,
        jobType: "Contract",
        postedOn: "Oct 2, 2025",
      },
      {
        id: 3,
        title: "React Intern",
        status: "Closed",
        location: "Jersey City, NJ",
        applicants: 22,
        jobType: "Internship",
        postedOn: "Sep 28, 2025",
      },
      {
        id: 4,
        title: "Backend Engineer",
        status: "Active",
        location: "Austin, TX",
        applicants: 7,
        jobType: "Full-Time",
        postedOn: "Sep 25, 2025",
      },
      {
        id: 5,
        title: "Data Analyst",
        status: "Draft",
        location: "Chicago, IL",
        applicants: 0,
        jobType: "Part-Time",
        postedOn: "Sep 20, 2025",
      },
    ];
    setJobs(mockJobs);
  }, []);

  // 2️⃣ Fetch backend data (replaces mock only if successful)
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        // Backend endpoint from API docs
        const data = await apiFetch(
          `/api/jobs/v1/employer/${user.userId}`,
          {},
          token
        );

        if (Array.isArray(data) && data.length > 0) {
          const mappedJobs: Job[] = data.map((j: any) => ({
            id: j.jobId,
            title: j.title,
            status: j.isActive ? "Active" : "Closed",
            location: `${j.city}, ${j.state}`,
            applicants: 0, // You can update this if backend sends applicant count
            jobType: j.jobType || "Full-Time",
            postedOn: j.postedDate,
          }));
          setJobs(mappedJobs);
        } else {
          console.warn("⚠️ No jobs found in backend. Using mock data.");
        }
      } catch (error) {
        console.error("❌ Backend fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, token]);

  // 3️⃣ Filter and search
  const filteredJobs = jobs
    .filter((job) =>
      selectedFilter === "All" ? true : job.status === selectedFilter
    )
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const closedJobs = jobs.filter((j) => j.status === "Closed").length;

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-10 transition-colors duration-300">
        {/* ================= HEADER / BANNER ================= */}
        <div
          className="rounded-2xl px-6 py-5 flex justify-between items-center 
          shadow-xl border border-[var(--border-soft)]
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500
          dark:from-[#4c1d95] dark:via-[#6d28d9] dark:to-[#2563eb]
          text-white transition-all duration-500"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Job Listings</h1>
            <p className="text-white/80 text-sm mt-1">
              Manage all your job postings and track applicant activity.
            </p>
          </div>

          <Link
            href="/recruiter/job-post"
            className="relative z-10 px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold shadow-md 
              hover:scale-[1.03] hover:shadow-purple-300/40 transition-transform duration-200"
          >
            + Create Job
          </Link>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {[
            {
              label: "Active Jobs",
              value: activeJobs,
              darkRim: "from-green-400 via-emerald-300 to-yellow-300",
              lightRim: "from-green-200 via-lime-200 to-yellow-100",
            },
            {
              label: "Total Applicants",
              value: totalApplicants,
              darkRim: "from-blue-400 via-sky-400 to-cyan-300",
              lightRim: "from-blue-200 via-sky-200 to-cyan-100",
            },
            {
              label: "Closed Jobs",
              value: closedJobs,
              darkRim: "from-gray-400 via-slate-400 to-white/50",
              lightRim: "from-gray-200 via-slate-100 to-white",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="relative p-[2px] rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.6)]
                bg-[linear-gradient(120deg,var(--tw-gradient-stops))]
                dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400
                from-gray-200 via-gray-100 to-white
                bg-[length:200%_200%] animate-[sheenMove_6s_ease-in-out_infinite]"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-tr dark:${card.darkRim} ${card.lightRim} opacity-80`}
              ></div>
              <div
                className="relative rounded-[14px] 
                bg-white/90 dark:bg-[#0b0b0b]/70 
                backdrop-blur-2xl flex flex-col items-center justify-center 
                text-center py-10 border border-white/10 dark:border-white/10 shadow-inner"
              >
                <h4 className="text-sm font-medium text-gray-700 dark:text-white/70 tracking-wide mb-1">
                  {card.label}
                </h4>
                <p className="text-5xl font-bold text-gray-900 dark:text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= SEARCH + FILTERS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-[400px]">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search job title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm 
              bg-white/90 dark:bg-white/10 
              text-gray-900 dark:text-white placeholder-gray-400 
              border border-gray-200 dark:border-gray-700 
              focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedFilter === status
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-white/20"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ================= JOBS TABLE ================= */}
        <div className="overflow-x-auto bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              Loading jobs...
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-300 text-sm bg-gray-100/80 dark:bg-white/10">
                  <th className="px-6 py-3 font-medium">Job Title</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Applicants</th>
                  <th className="px-6 py-3 font-medium">Job Type</th>
                  <th className="px-6 py-3 font-medium">Posted On</th>
                  <th className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group cursor-pointer transition-all duration-300 hover:bg-purple-50 dark:hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-[2px] rounded-lg"
                      onClick={() =>
                        (window.location.href = `/recruiter/applications/${job.id}`)
                      }
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                        {job.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : job.status === "Closed"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {job.applicants}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {job.jobType}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                        {job.postedOn}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <Link
                          href={`/recruiter/applications/${job.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 rounded-md text-xs hover:bg-blue-200 dark:hover:bg-blue-600/30 transition"
                        >
                          View Applicants
                        </Link>
                        <Link
                          href={`/recruiter/job-post/edit/${job.id}`}
                          className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400 rounded-md text-xs hover:bg-purple-200 dark:hover:bg-purple-600/30 transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No job listings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}
