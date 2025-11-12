"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import RecruiterLayout from "@/components/layout/RecruiterLayout";

interface CandidateDetails {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  appliedRole: string;
  location: string;
  appliedOn: string;
  resumeLink: string;
  status: "In Review" | "Interviewed" | "Hired" | "Rejected";
  notes: string;
}

export default function CandidateDetailPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);

  useEffect(() => {
    const mockCandidate: CandidateDetails = {
      id: id as string,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555)123-1234",
      appliedRole: "Frontend Developer",
      location: "New York, NY (Remote)",
      appliedOn: "Oct 6, 2025",
      resumeLink: "#",
      status: "Interviewed",
      notes: "Strong React experience. Good communication skills.",
    };
    setCandidate(mockCandidate);
  }, [id]);

  if (!candidate)
    return (
      <RecruiterLayout>
        <div className="text-center text-gray-400 mt-10">
          Loading candidate...
        </div>
      </RecruiterLayout>
    );

  return (
    <RecruiterLayout>
      <div className="p-6 md:p-10 min-h-screen space-y-8 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between md:items-center 
                     rounded-xl border shadow-md p-6 
                     bg-white/80 dark:bg-white/5 
                     border-gray-200 dark:border-white/10 
                     backdrop-blur-xl"
        >
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Applied for:{" "}
              <span className="text-purple-600 dark:text-purple-400">
                {candidate.appliedRole}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {candidate.location} • Applied on {candidate.appliedOn}
            </p>
          </div>

          <span
            className={`px-3 py-1 mt-3 md:mt-0 rounded-full text-sm font-medium ${
              candidate.status === "In Review"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                : candidate.status === "Interviewed"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
                : candidate.status === "Hired"
                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            {candidate.status}
          </span>
        </div>

        {/* Contact Info */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-xl border shadow-sm p-6 
                     bg-white/80 dark:bg-white/5 
                     border-gray-200 dark:border-white/10 
                     backdrop-blur-lg"
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              📧 Email
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {candidate.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              📞 Phone
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {candidate.phone}
            </p>
          </div>
        </div>

        {/* Resume Section */}
        <div
          className="rounded-xl border shadow-sm p-6 
                     bg-white/80 dark:bg-white/5 
                     border-gray-200 dark:border-white/10 
                     backdrop-blur-lg"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            📄 Resume
          </h3>
          <a
            href={candidate.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 underline text-sm hover:text-purple-700 dark:hover:text-purple-300 transition"
          >
            Download Resume (PDF)
          </a>
        </div>

        {/* Timeline */}
        <div
          className="rounded-xl border shadow-sm p-6 
                     bg-white/80 dark:bg-white/5 
                     border-gray-200 dark:border-white/10 
                     backdrop-blur-lg"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            📍 Application Timeline
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
            <li>Applied — Oct 6, 2025</li>
            <li>Reviewed — Oct 7, 2025</li>
            <li>Interview Scheduled — Oct 9, 2025</li>
          </ul>
        </div>

        {/* Notes */}
        <div
          className="rounded-xl border shadow-sm p-6 
                     bg-white/80 dark:bg-white/5 
                     border-gray-200 dark:border-white/10 
                     backdrop-blur-lg"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            💬 Recruiter Notes
          </h3>
          <textarea
            value={candidate.notes}
            readOnly
            rows={4}
            className="w-full p-3 rounded-lg border text-sm resize-none
                       bg-gray-50 text-gray-800 border-gray-300 
                       dark:bg-white/10 dark:text-white dark:border-white/10
                       focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/recruiter/candidates"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 transition"
          >
            ← Back to Candidates
          </Link>
          <div className="space-x-2">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium 
                         bg-green-100 text-green-700 
                         dark:bg-green-600/20 dark:text-green-400 
                         hover:bg-green-200 dark:hover:bg-green-600/30 transition"
            >
              Advance Stage
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium 
                         bg-red-100 text-red-700 
                         dark:bg-red-600/20 dark:text-red-400 
                         hover:bg-red-200 dark:hover:bg-red-600/30 transition"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
