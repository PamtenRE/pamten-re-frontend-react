"use client";

import React, { useEffect, useState } from "react";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Mock Data
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

  const filteredJobs = jobs
    .filter((job) =>
      selectedFilter === "All" ? true : job.status === selectedFilter
    )
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ✅ Stats
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const closedJobs = jobs.filter((j) => j.status === "Closed").length;

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Listings</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage all your job postings and track applicant activity.
            </p>
          </div>

          <Link
            href="/recruiter/job-post"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 shadow-md transition-all"
          >
            + Create Job
          </Link>
        </div>

        {/* ✅ KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {[
            {
              label: "Active Jobs",
              value: activeJobs,
              border: "from-green-400 via-emerald-300 to-yellow-300",
            },
            {
              label: "Total Applicants",
              value: totalApplicants,
              border: "from-blue-400 via-sky-400 to-cyan-300",
            },
            {
              label: "Closed Jobs",
              value: closedJobs,
              border: "from-gray-400 via-slate-400 to-white/50",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="relative p-[2px] rounded-2xl 
  bg-[linear-gradient(120deg,var(--tw-gradient-stops))] 
  from-emerald-400 via-blue-400 to-purple-400
  animate-[sheenMove_6s_ease-in-out_infinite]
  bg-[length:200%_200%] overflow-hidden
  shadow-[0_0_25px_rgba(0,0,0,0.6)]"
            >
              {/* ✨ Gradient border line */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${card.border}
        opacity-80`}
              ></div>

              {/* 🪟 Inner frosted glass layer */}
              <div
                className="relative rounded-[14px] bg-[#0b0b0b]/70 backdrop-blur-2xl
        flex flex-col items-center justify-center text-center py-10
        border border-white/10 shadow-inner"
              >
                <h4 className="text-sm font-medium text-white/70 tracking-wide mb-1">
                  {card.label}
                </h4>
                <p className="text-5xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
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
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
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
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ================= JOBS TABLE ================= */}
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-left text-gray-300 text-sm bg-white/10">
                <th className="px-6 py-3 font-medium">Job Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Applicants</th>
                <th className="px-6 py-3 font-medium">Job Type</th>
                <th className="px-6 py-3 font-medium">Posted On</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-white/10 transition cursor-pointer"
                  >
                    <td
                      onClick={() =>
                        (window.location.href = `/recruiter/applications/${job.id}`)
                      }
                      className="px-6 py-4 text-white font-semibold hover:text-purple-400 transition"
                    >
                      {job.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : job.status === "Closed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{job.location}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {job.applicants}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{job.jobType}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {job.postedOn}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link
                        href={`/recruiter/applications/${job.id}`}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md text-xs hover:bg-blue-600/30 transition"
                      >
                        View Applicants
                      </Link>
                      <Link
                        href={`/recruiter/job-post/edit/${job.id}`}
                        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-md text-xs hover:bg-purple-600/30 transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No job listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}
