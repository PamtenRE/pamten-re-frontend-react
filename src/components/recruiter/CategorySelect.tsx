"use client";

import React from "react";

const CATEGORIES = [
  "Software & Web Development",
  "Data & Analytics",
  "Design & UX",
  "Marketing & Sales",
  "Finance",
  "HR & Recruiting",
  "Operations",
  "Healthcare",
  "Education",
  "Customer Support",
];

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 
    focus:ring-2 focus:ring-purple-500 dark:bg-[#1b1033]/70 dark:text-gray-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select a category…</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
      <option value="__custom">Other — add custom category</option>
    </select>
  );
}
