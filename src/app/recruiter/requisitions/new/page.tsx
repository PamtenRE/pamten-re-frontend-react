"use client";

import React from "react";
import CreateJobWizard from "@/components/recruiter/CreateJobWizard";
import RecruiterLayout from "@/components/layout/RecruiterLayout";

export default function NewRequisitionPage() {
  return (
    <RecruiterLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Create a New Requisition
        </h1>
        <CreateJobWizard />
      </div>
    </RecruiterLayout>
  );
}
