"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import RecruiterLayout from "@/components/layout/RecruiterLayout";

interface Applicant {
  id: string | number;
  name: string;
  email: string;
  appliedOn: string;
  status: "In Review" | "Interviewed" | "Hired" | "Rejected";
}

interface JobDetails {
  title: string;
  location: string;
  jobType: string;
  status: "Active" | "Closed";
  postedOn: string;
}

const statusFilters = ["All", "In Review", "Interviewed", "Hired", "Rejected"];
const sortOptions = ["Newest First", "Oldest First"];

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest First");

  // ✅ Mock Data
  useEffect(() => {
    const mockJob: JobDetails = {
      title: id === "1" ? "Frontend Developer" : "UX Designer",
      location: id === "1" ? "New York, NY" : "Remote",
      jobType: id === "1" ? "Full-Time" : "Contract",
      status: "Active",
      postedOn: "Oct 5, 2025",
    };

    const mockApplicants: Applicant[] = [
      {
        id: 101,
        name: "John Doe",
        email: "john.doe@example.com",
        appliedOn: "Oct 6, 2025",
        status: "In Review",
      },
      {
        id: 102,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        appliedOn: "Oct 7, 2025",
        status: "Interviewed",
      },
      {
        id: 103,
        name: "Michael Johnson",
        email: "michael.j@example.com",
        appliedOn: "Oct 8, 2025",
        status: "Hired",
      },
      {
        id: 104,
        name: "Emily Davis",
        email: "emily.d@example.com",
        appliedOn: "Oct 4, 2025",
        status: "Rejected",
      },
    ];

    setJob(mockJob);
    setApplicants(mockApplicants);
  }, [id]);

  // ✅ Filter + Search + Sort logic
  const filteredApplicants = applicants
    .filter((a) =>
      selectedFilter === "All" ? true : a.status === selectedFilter
    )
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.appliedOn);
      const dateB = new Date(b.appliedOn);
      return sortOrder === "Newest First"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  return (
    <RecruiterLayout>
      <div className="space-y-8">
        {/* Job Header */}
        {job && (
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 glass p-6 rounded-xl shadow-lg">
            <div>
              <h1 className="text-3xl font-bold text-white">{job.title}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {job.location} • {job.jobType} • Posted on {job.postedOn}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === "Active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/recruiter/job-post/edit/${id}`}
                className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-md text-sm hover:bg-purple-600/30 transition"
              >
                ✏️ Edit Job
              </Link>
              <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-md text-sm hover:bg-red-600/30 transition">
                🗑️ Close Job
              </button>
            </div>
          </div>
        )}

        {/* Search + Filter + Sort Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
          {/* Left side: Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-72 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
              {statusFilters.map((status) => (
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

          {/* Right side: Sort dropdown */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 text-sm bg-white/10 border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-gray-900">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-left text-gray-300 text-sm bg-white/10">
                <th className="px-6 py-3 font-medium">Candidate</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-purple-600/10 cursor-pointer transition"
                    onClick={() =>
                      (window.location.href = `/recruiter/candidates/${a.id}`)
                    }
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {a.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{a.email}</td>
                    <td className="px-6 py-4 text-gray-400">{a.appliedOn}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          a.status === "In Review"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : a.status === "Interviewed"
                            ? "bg-blue-500/20 text-blue-400"
                            : a.status === "Hired"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/recruiter/candidates/${a.id}`}
                        className="text-purple-400 text-sm hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No applicants found.
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
