"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";

interface RequisitionCardProps {
  id: string | number;
  title: string;
  location: string;
  postedDate: string;
  status: "Open" | "Closed" | "In Review" | "draft";
  applicants: number;
}

const statusColors: Record<string, string> = {
  Open: "text-green-400",
  Closed: "text-red-400",
  "In Review": "text-yellow-400",
  draft: "text-gray-400",
};

export default function RequisitionCard({
  id,
  title,
  location,
  postedDate,
  status,
  applicants,
}: RequisitionCardProps) {
  return (
    <Link
      href={`/recruiter/requisitions/${encodeURIComponent(id)}`}
      className="block"
    >
      <div className="glass p-6 rounded-xl transition duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border border-transparent hover:border-purple-500">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span
            className={`text-xs ${statusColors[status] || "text-gray-400"}`}
          >
            {status}
          </span>
        </div>

        <p className="text-sm text-muted mb-3 flex items-center gap-1">
          📍 {location || "—"}
        </p>

        <div className="flex items-center text-xs text-muted gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays size={14} /> {postedDate}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} /> {applicants} applicants
          </div>
        </div>
      </div>
    </Link>
  );
}
