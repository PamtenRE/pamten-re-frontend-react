"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RecruiterLayout from "@/components/layout/RecruiterLayout";

interface Candidate {
  id: string | number;
  name: string;
  appliedRole: string;
  email: string;
  appliedOn: string;
  status: "In Review" | "Interviewed" | "Hired" | "Rejected";
}

const statusFilters = ["All", "In Review", "Interviewed", "Hired", "Rejected"];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const router = useRouter();

  // ✅ Mock Data
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: 101,
        name: "John Doe",
        appliedRole: "Frontend Developer",
        email: "john.doe@example.com",
        appliedOn: "Oct 6, 2025",
        status: "In Review",
      },
      {
        id: 102,
        name: "Jane Smith",
        appliedRole: "UX Designer",
        email: "jane.smith@example.com",
        appliedOn: "Oct 7, 2025",
        status: "Interviewed",
      },
      {
        id: 103,
        name: "Michael Johnson",
        appliedRole: "React Intern",
        email: "michael.j@example.com",
        appliedOn: "Oct 8, 2025",
        status: "Hired",
      },
      {
        id: 104,
        name: "Emily Davis",
        appliedRole: "Backend Engineer",
        email: "emily.d@example.com",
        appliedOn: "Oct 9, 2025",
        status: "Rejected",
      },
    ];
    setCandidates(mockCandidates);
  }, []);

  // ✅ Filtering Logic
  const filteredCandidates = candidates
    .filter((c) =>
      selectedFilter === "All" ? true : c.status === selectedFilter
    )
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ✅ KPI Counts
  const stats = {
    "In Review": candidates.filter((c) => c.status === "In Review").length,
    Interviewed: candidates.filter((c) => c.status === "Interviewed").length,
    Hired: candidates.filter((c) => c.status === "Hired").length,
    Rejected: candidates.filter((c) => c.status === "Rejected").length,
  };

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-8 transition-colors duration-300">
        {/* ================= HEADER ================= */}
        <div
          className="rounded-2xl px-6 py-5 flex justify-between items-center 
          shadow-xl border border-[var(--border-soft)]
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500
          dark:from-[#4c1d95] dark:via-[#6d28d9] dark:to-[#2563eb]
          text-white transition-all duration-500"
        >
          <div>
            <h1 className="text-3xl font-bold">Candidate Overview</h1>
            <p className="text-white/80 text-sm mt-1">
              Insights into your hiring pipeline.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold shadow-md 
              hover:scale-[1.03] hover:shadow-purple-300/40 transition-transform duration-200"
          >
            ← Go Back
          </button>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "In Review",
              count: stats["In Review"],
              darkRim: "from-purple-400 via-violet-300 to-fuchsia-400",
              lightRim: "from-purple-300 via-violet-200 to-fuchsia-200",
            },
            {
              label: "Interviewed",
              count: stats.Interviewed,
              darkRim: "from-sky-400 via-blue-400 to-indigo-300",
              lightRim: "from-sky-300 via-blue-200 to-indigo-200",
            },
            {
              label: "Hired",
              count: stats.Hired,
              darkRim: "from-emerald-400 via-green-300 to-teal-300",
              lightRim: "from-green-300 via-emerald-200 to-teal-100",
            },
            {
              label: "Rejected",
              count: stats.Rejected,
              darkRim: "from-rose-400 via-pink-400 to-red-400",
              lightRim: "from-rose-300 via-pink-200 to-red-100",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="relative p-[2px] rounded-2xl overflow-hidden 
              shadow-[0_5px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_0_25px_rgba(0,0,0,0.6)]
              bg-[linear-gradient(120deg,var(--tw-gradient-stops))]
              animate-[sheenMove_6s_ease-in-out_infinite]
              dark:bg-gradient-to-tr dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-tr dark:${card.darkRim} ${card.lightRim} opacity-90`}
              ></div>
              <div
                className="relative rounded-[14px]
                bg-white/85 dark:bg-[#0b0b0b]/70 
                backdrop-blur-2xl flex flex-col items-center justify-center text-center py-8
                border border-white/20 dark:border-white/10 shadow-inner"
              >
                <h4 className="text-sm font-semibold text-gray-700 dark:text-white/70 tracking-wide mb-1 uppercase">
                  {card.label}
                </h4>
                <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  {card.count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[400px]">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm
              bg-white text-gray-900 placeholder-gray-500
              dark:bg-white/10 dark:text-white dark:placeholder-gray-400
              border border-gray-300 dark:border-gray-700
              focus:ring-2 focus:ring-purple-500 focus:outline-none
              shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 dark:text-gray-400 text-sm">
              Status:
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-white dark:bg-white/10 text-gray-900 dark:text-white 
                border border-gray-300 dark:border-white/20 rounded-lg px-4 py-2 text-sm
                hover:bg-gray-50 dark:hover:bg-white/20 transition"
            >
              {statusFilters.map((status) => (
                <option key={status} value={status} className="text-black">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-gray-700 dark:text-gray-300 text-sm bg-gray-100/80 dark:bg-white/10">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() =>
                      (window.location.href = `/recruiter/candidates/${c.id}`)
                    }
                    className="group cursor-pointer transition-all duration-300 hover:bg-purple-50 dark:hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-[2px] rounded-lg"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {c.appliedRole}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {c.appliedOn}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "In Review"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                            : c.status === "Interviewed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                            : c.status === "Hired"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/recruiter/candidates/${c.id}`}
                        className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No candidates found.
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
