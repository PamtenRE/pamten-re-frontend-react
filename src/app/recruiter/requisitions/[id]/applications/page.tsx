'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import RecruiterLayout from '@/components/layout/RecruiterLayout';

const mockApplications = [
  {
    id: 'app-101',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    status: 'Interview Scheduled',
    date: '2025-07-08',
    avatar: '🧑‍💼',
  },
  {
    id: 'app-102',
    name: 'Anjali Sharma',
    email: 'anjali@example.com',
    status: 'Under Review',
    date: '2025-07-07',
    avatar: '👩‍💼',
  },
  {
    id: 'app-103',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Shortlisted',
    date: '2025-07-06',
    avatar: '👨‍💻',
  },
];

export default function ApplicationsListPage() {
  const { id } = useParams();

  return (
    <RecruiterLayout>
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">
            Applications for Requisition #{id}
          </h1>
          <Link
            href="/recruiter/requisitions"
            className="text-sm text-purple-400 hover:underline"
          >
            ← Back to Requisitions
          </Link>
        </div>

        <div className="space-y-4">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="glass p-5 rounded-lg flex items-center justify-between hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{app.avatar}</span>
                <div>
                  <h2 className="text-lg font-bold">{app.name}</h2>
                  <p className="text-sm text-muted">{app.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">{app.status}</p>
                <p className="text-xs text-muted">Applied on {app.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RecruiterLayout>
  );
}
