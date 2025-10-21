"use client";

import React from "react";

const TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
] as const;

export default function JobTypeChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(active ? "" : t)}
            className={`px-3 py-1 rounded-full border text-sm transition
              ${
                active
                  ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
