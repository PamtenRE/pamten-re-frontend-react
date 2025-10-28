"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Users, MapPin } from "lucide-react";

interface RequisitionCardProps {
  id: string | number;
  title: string;
  location: string;
  postedDate: string;
  status: "Open" | "Closed" | "In Review" | "draft";
  applicants: number;
}

const statusColors: Record<string, string> = {
  Open: "text-green-600 dark:text-green-400",
  Closed: "text-red-600 dark:text-red-400",
  "In Review": "text-yellow-600 dark:text-yellow-400",
  draft: "text-gray-500 dark:text-gray-400",
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
      className="block group"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 
        bg-white/80 dark:bg-[#0f0a1a]/60 
        border border-white/40 dark:border-white/10 
        backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)]
        transition-all duration-500 ease-out
        group-hover:border-transparent
        group-hover:shadow-[0_0_25px_rgba(147,51,234,0.25)]
        before:absolute before:inset-0 before:rounded-2xl 
        before:bg-gradient-to-r before:from-purple-500/20 before:to-blue-500/20 
        before:opacity-0 before:transition-opacity before:duration-500 
        group-hover:before:opacity-100"
      >
        <div className="relative z-10 flex justify-between items-start mb-3">
          <h3
            className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 
            bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400
            transition-colors"
          >
            {title}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>

        <p className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-3">
          <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
          {location || "—"}
        </p>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays size={13} className="opacity-70" /> {postedDate}
          </div>
          <div className="flex items-center gap-1">
            <Users size={13} className="opacity-70" /> {applicants} applicants
          </div>
        </div>
      </div>
    </Link>
  );
}
