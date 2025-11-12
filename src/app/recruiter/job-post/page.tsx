"use client";

import RecruiterLayout from "@/components/layout/RecruiterLayout";
import CreateJobWizard from "@/components/recruiter/CreateJobWizard";

export default function JobPostPage() {
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
