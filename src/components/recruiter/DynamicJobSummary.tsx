"use client";

import React from "react";

export type SummaryData = {
  title?: string;
  company?: string;
  location?: string;
  locationType?: string;
  employmentType?: string;
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
  payType?: string;
  payExact?: number;
  rateUnit?: string;
};

export default function DynamicJobSummary({ data }: { data: SummaryData }) {
  const pay =
    data.payType === "exact" && data.payExact
      ? `$${data.payExact.toLocaleString()} ${data.rateUnit}`
      : data.salaryMin != null && data.salaryMax != null
      ? `$${data.salaryMin.toLocaleString()} – $${data.salaryMax.toLocaleString()} ${
          data.rateUnit
        }`
      : "—";

  return (
    <aside className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 p-4 shadow-sm sticky top-4">
      <h3 className="text-lg font-semibold mb-3">About this job</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Title</dt>
          <dd>{data.title || "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Company</dt>
          <dd>{data.company || "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Category</dt>
          <dd>{data.category || "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Employment</dt>
          <dd>{data.employmentType || "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Location</dt>
          <dd>{data.location || "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Compensation</dt>
          <dd>{pay}</dd>
        </div>
      </dl>
    </aside>
  );
}
