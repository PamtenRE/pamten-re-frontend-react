// src/components/recruiter/CandidateCard.tsx
'use client';

import Link from 'next/link';

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    role: string;
    status: string;
    location: string;
    experience: string;
  };
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link href={`/recruiter/candidates/${candidate.id}`}>
      <div className="glass p-6 rounded-xl transition duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
        <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
        <p className="text-sm text-muted">{candidate.role}</p>
        <div className="mt-2 text-sm">
          <p><span className="font-medium">Status:</span> {candidate.status}</p>
          <p><span className="font-medium">Location:</span> {candidate.location}</p>
          <p><span className="font-medium">Experience:</span> {candidate.experience}</p>
        </div>
      </div>
    </Link>
  );
}
