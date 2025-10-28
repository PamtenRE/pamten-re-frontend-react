"use client";

import React from "react";
import { SummaryData } from "./DynamicJobSummary";

export default function PreviewModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: SummaryData;
}) {
  if (!open) return null;
  const pay =
    data.payType === "exact" && data.payExact
      ? `$${data.payExact.toLocaleString()} ${data.rateUnit}`
      : data.salaryMin != null && data.salaryMax != null
      ? `$${data.salaryMin.toLocaleString()} – $${data.salaryMax.toLocaleString()} ${
          data.rateUnit
        }`
      : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="font-semibold">Job Preview</div>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div className="text-2xl font-bold">{data.title || "Job Title"}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {data.company || "Company"} — {data.location || "Location"} •{" "}
            {data.employmentType || "Type"}
          </div>
          <div className="mt-4 text-sm">
            <div className="font-semibold">Compensation</div>
            <div>{pay}</div>
          </div>
          <button className="btn-primary mt-4">Apply Now</button>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
