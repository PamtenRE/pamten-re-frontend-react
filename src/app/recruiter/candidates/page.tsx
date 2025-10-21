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
      <div className="p-6 space-y-8">
        {/* ================= HEADER ================= */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 flex justify-between items-center shadow-lg animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Candidate Overview
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Insights into your hiring pipeline.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm text-gray-200 rounded-lg transition-all"
          >
            ← Go Back
          </button>
        </div>

        {/* ================= KPI CARDS ================= */}
        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-slow">
          {[
            {
              label: "In Review",
              count: stats["In Review"],
              border: "from-purple-400 via-violet-300 to-fuchsia-400",
              glow: "group-hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]", // Purple
            },
            {
              label: "Interviewed",
              count: stats.Interviewed,
              border: "from-sky-400 via-blue-400 to-indigo-300",
              glow: "group-hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]", // Blue
            },
            {
              label: "Hired",
              count: stats.Hired,
              border: "from-emerald-400 via-green-300 to-teal-300",
              glow: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]", // Green
            },
            {
              label: "Rejected",
              count: stats.Rejected,
              border: "from-rose-400 via-pink-400 to-red-400",
              glow: "group-hover:shadow-[0_0_35px_rgba(244,63,94,0.6)]", // Red
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`relative group p-[2px] rounded-2xl overflow-hidden transition-all duration-500 
      bg-gradient-to-tr ${card.border} bg-[length:200%_200%] animate-[sheenMove_6s_ease-in-out_infinite]`}
            >
              {/* ✨ Outer Glow (persistent + hover brightens) */}
              <div
                className={`absolute inset-0 rounded-2xl ${card.glow} transition-all duration-500`}
              ></div>

              {/* 🪟 Inner Glass Layer (no scale to avoid overlap) */}
              <div
                className="relative z-10 rounded-[14px] bg-[#0b0b0b]/70 backdrop-blur-2xl
          flex flex-col items-center justify-center text-center py-8
          border border-white/10 shadow-inner hover:brightness-110 transition-all duration-300"
              >
                <h4 className="text-sm font-medium text-white/70 tracking-wide mb-1">
                  {card.label}
                </h4>
                <p className="text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
                  {card.count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in-slow">
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
              className="pl-9 pr-3 py-2 w-full rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Status:</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 text-sm hover:bg-white/20 transition"
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
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl shadow-lg animate-fade-in-slow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-left text-gray-300 text-sm bg-white/10">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/10 cursor-pointer transition"
                    onClick={() =>
                      (window.location.href = `/recruiter/candidates/${c.id}`)
                    }
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{c.appliedRole}</td>
                    <td className="px-6 py-4 text-gray-400">{c.email}</td>
                    <td className="px-6 py-4 text-gray-400">{c.appliedOn}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "In Review"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : c.status === "Interviewed"
                            ? "bg-blue-500/20 text-blue-400"
                            : c.status === "Hired"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/recruiter/candidates/${c.id}`}
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
                  <td colSpan={6} className="text-center py-6 text-gray-400">
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
