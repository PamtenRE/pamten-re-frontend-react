// src/app/recruiter/candidates/[id]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock candidate data
const mockCandidate = {
  id: "1",
  name: "Jane Doe",
  role: "Frontend Developer",
  status: "In Review",
  email: "jane.doe@example.com",
  phone: "+1 234 567 890",
  location: "San Francisco, CA",
  experience: "4 years",
  resumeLink: "#",
  notes:
    "Strong React knowledge. Good communication skills. Needs deeper backend exposure.",
};

export default function CandidateDetailPage() {
  const { id } = useParams();

  return (
    <RecruiterLayout>
      <div className="flex flex-col md:flex-row gap-6 text-white">
        {/* Left Section */}
        <div className="glass p-6 rounded-xl w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-2">{mockCandidate.name}</h2>
          <p className="text-muted text-sm mb-1">{mockCandidate.role}</p>
          <p className="text-sm">📍 {mockCandidate.location}</p>
          <p className="text-sm">📞 {mockCandidate.phone}</p>
          <p className="text-sm">✉️ {mockCandidate.email}</p>
          <p className="text-sm">🧠 Experience: {mockCandidate.experience}</p>
          <p className="text-sm">📄 Status: {mockCandidate.status}</p>

          <Link
            href={mockCandidate.resumeLink}
            className="mt-4 inline-block text-purple-400 hover:underline text-sm"
          >
            View Resume
          </Link>
        </div>

        {/* Right Section */}
        <div className="glass p-6 rounded-xl flex-1">
          <h3 className="text-xl font-semibold mb-4">Recruiter Notes 📝</h3>
          <p className="text-sm text-muted whitespace-pre-wrap">
            {mockCandidate.notes}
          </p>
        </div>
      </div>
    </RecruiterLayout>
  );
}
