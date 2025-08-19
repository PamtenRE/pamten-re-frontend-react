// src/app/recruiter/applications/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import RecruiterLayout from '@/components/layout/RecruiterLayout';

export default function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <RecruiterLayout>
    <div className="p-6 text-white min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-5xl mx-auto glass rounded-xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">👤 John Doe</h1>
            <p className="text-muted">Applied for: Frontend Developer</p>
          </div>
          <div className="text-sm text-muted">Application ID: {id}</div>
        </div>

        {/* Contact & Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Phone:</strong> +1 555-1234</p>
          <p><strong>Applied on:</strong> 2025-07-01</p>
          <p><strong>Location:</strong> Remote</p>
        </div>

        {/* Resume & Cover Letter */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">📄 Resume</h3>
          <a href="#" className="text-purple-400 underline">Download Resume (PDF)</a>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">📝 Cover Letter</h3>
          <p className="text-muted">I&#39;m excited to join your company and bring my passion for UI design...</p>
        </div>

        {/* Timeline (Placeholder) */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">📍 Application Timeline</h3>
          <ul className="text-sm text-muted list-disc list-inside">
            <li>Applied - 2025-07-01</li>
            <li>Reviewed - 2025-07-03</li>
            <li>Interview Scheduled - 2025-07-06</li>
          </ul>
        </div>

        {/* Recruiter Notes */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">💬 Recruiter Notes</h3>
          <textarea
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white"
            rows={4}
            placeholder="Write notes here..."
          ></textarea>
        </div>

        <div className="flex justify-between items-center">
          <Link href="/recruiter/applications" className="text-sm text-purple-400 underline">
            ← Back to Applications
          </Link>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              Advance
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
    </RecruiterLayout>
  );
}
