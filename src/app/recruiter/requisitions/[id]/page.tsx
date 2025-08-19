'use client';
import React from 'react';
import RecruiterLayout from '@/components/layout/RecruiterLayout';

export default function RequisitionDetailPage() {
  return (
    <RecruiterLayout>
      <div className="max-w-4xl mx-auto glass p-6 rounded-xl text-white space-y-6">
        <div>
          <h1 className="text-3xl font-bold">✨ Senior Backend Engineer</h1>
          <p className="text-muted text-sm">Location: New York • Department: Engineering</p>
          <p className="text-xs text-purple-400 mt-2">Status: Open</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">📝 Job Description</h2>
          <p className="text-sm text-muted">
            We&#39;re looking for a seasoned backend engineer to build scalable APIs and services.
            The ideal candidate has 5+ years of experience with Node.js and AWS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-md">
            <p className="text-muted text-sm">Applicants</p>
            <p className="text-2xl font-bold">23</p>
          </div>
          <div className="glass p-4 rounded-md">
            <p className="text-muted text-sm">Interviews</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="glass p-4 rounded-md">
            <p className="text-muted text-sm">Offers Made</p>
            <p className="text-2xl font-bold">2</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
            ✏️ Edit
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
            🗑️ Archive
          </button>
        </div>
      </div>
    </RecruiterLayout>
  );
}
