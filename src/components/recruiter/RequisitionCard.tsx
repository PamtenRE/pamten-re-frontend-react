// src/components/recruiter/RequisitionCard.tsx
'use client';

import React from 'react';
import { CalendarDays, Users } from 'lucide-react';

interface RequisitionCardProps {
  title: string;
  location: string;
  postedDate: string;
  status: 'Open' | 'Closed' | 'In Review';
  applicants: number;
}

const statusColors: Record<string, string> = {
  Open: 'text-green-400',
  Closed: 'text-red-400',
  'In Review': 'text-yellow-400',
};

export default function RequisitionCard({
  title,
  location,
  postedDate,
  status,
  applicants,
}: RequisitionCardProps) {
  return (
    <div className="glass p-6 rounded-xl transition duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className={`text-xs ${statusColors[status]}`}>{status}</span>
      </div>
      <p className="text-sm text-muted mb-3">📍 {location}</p>
      <div className="flex items-center text-xs text-muted gap-4">
        <div className="flex items-center gap-1">
          <CalendarDays size={14} /> {postedDate}
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} /> {applicants} applicants
        </div>
      </div>
    </div>
  );
}
