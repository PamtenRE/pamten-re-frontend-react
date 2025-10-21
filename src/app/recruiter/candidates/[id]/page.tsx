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
    // ✅ Mock Data
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
      <div className="p-6 text-white min-h-screen space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Applied for:{" "}
              <span className="text-purple-400">{candidate.appliedRole}</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {candidate.location} • Applied on {candidate.appliedOn}
            </p>
          </div>
          <span
            className={`px-3 py-1 mt-3 md:mt-0 rounded-full text-sm font-medium ${
              candidate.status === "In Review"
                ? "bg-yellow-500/20 text-yellow-400"
                : candidate.status === "Interviewed"
                ? "bg-blue-500/20 text-blue-400"
                : candidate.status === "Hired"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {candidate.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <div>
            <p className="text-sm text-gray-400">📧 Email</p>
            <p className="font-medium">{candidate.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">📞 Phone</p>
            <p className="font-medium">{candidate.phone}</p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-3">📄 Resume</h3>
          <a
            href={candidate.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 underline text-sm hover:text-purple-300 transition"
          >
            Download Resume (PDF)
          </a>
        </div>

        {/* Application Timeline */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-3">
            📍 Application Timeline
          </h3>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
            <li>Applied — Oct 6, 2025</li>
            <li>Reviewed — Oct 7, 2025</li>
            <li>Interview Scheduled — Oct 9, 2025</li>
          </ul>
        </div>

        {/* Recruiter Notes */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-3">💬 Recruiter Notes</h3>
          <textarea
            value={candidate.notes}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            rows={4}
            readOnly
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/recruiter/candidates"
            className="text-sm text-purple-400 underline"
          >
            ← Back to Candidates
          </Link>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition">
              Advance Stage
            </button>
            <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">
              Reject
            </button>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
