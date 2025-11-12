"use client";

import React from "react";

export type LocationType =
  | "single"
  | "multiple"
  | "remote"
  | "on_the_road"
  | "";

const OPTIONS: { key: LocationType; label: string; sub: string }[] = [
  {
    key: "single",
    label: "One location",
    sub: "Job is performed at a specific address.",
  },
  {
    key: "multiple",
    label: "Multiple locations",
    sub: "Job may be performed at multiple sites.",
  },
  {
    key: "remote",
    label: "Remote",
    sub: "Job is performed remotely. No on-site work required.",
  },
  {
    key: "on_the_road",
    label: "On the road",
    sub: "Job requires regular travel.",
  },
];

export default function LocationTypeRadios({
  value,
  onChange,
}: {
  value: LocationType;
  onChange: (v: LocationType) => void;
}) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((o) => (
        <label
          key={o.key}
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition
            ${
              value === o.key
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
        >
          <input
            type="radio"
            className="mt-1"
            checked={value === o.key}
            onChange={() => onChange(o.key)}
          />
          <div>
            <div className="font-medium">{o.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {o.sub}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
