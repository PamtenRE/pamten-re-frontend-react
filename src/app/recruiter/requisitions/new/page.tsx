"use client";

import React from "react";
import CreateJobWizard from "@/components/recruiter/CreateJobWizard";
import RecruiterLayout from "@/components/layout/RecruiterLayout";

export default function NewRequisitionPage() {
  return (
    <RecruiterLayout>
      <div
        className="min-h-screen p-8 transition-colors duration-700 
        bg-gradient-to-br from-indigo-50 via-white to-purple-50 
        dark:from-[#0a0118] dark:via-[#12072c] dark:to-[#0a0a23]"
      >
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Create a New Requisition
            </h1>
          </div>
        </div>

        {/* WIZARD CONTAINER */}
        <div
          className="relative p-8 rounded-3xl border
          bg-gradient-to-br from-white/60 via-white/80 to-white/60
          dark:from-[#1e0b43]/40 dark:via-[#2b0f5a]/40 dark:to-[#0a0a2a]/40
          border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          backdrop-blur-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-purple-400/10 animate-[pulse_6s_infinite] rounded-3xl -z-10" />

          <CreateJobWizard />
        </div>
      </div>
    </RecruiterLayout>
  );
}
