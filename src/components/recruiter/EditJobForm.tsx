"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Globe,
  Building2,
  Languages,
  Upload,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import CategorySelect from "./CategorySelect";
import JobTypeChips from "./JobTypeChips";
import SalaryControls from "./SalaryControls";

// ✅ Use your new shared RichTextEditor (with sticky toolbar + scroll)
import RichTextEditor from "./RichTextEditor";

export type EditJobFormData = {
  title: string;
  company: string;
  country: string;
  language: string;
  category: string;
  location: string;
  locationType: string;
  employmentType: string;
  description: string;
  payType: "range" | "exact";
  salaryMin?: number;
  salaryMax?: number;
  payExact?: number;
  rateUnit: string;
  hideSalary: boolean;
  status: "draft" | "Open" | "In Review" | "Closed";
  attachmentName?: string;
  attachmentFile?: File | null;
};

interface EditJobFormProps {
  existingData: Partial<EditJobFormData>;
  onSubmit: (data: Partial<EditJobFormData>) => Promise<void> | void;
}

export default function EditJobForm({
  existingData,
  onSubmit,
}: EditJobFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EditJobFormData>({
    title: existingData.title || "",
    company: existingData.company || "",
    country: existingData.country || "",
    language: existingData.language || "English",
    category: existingData.category || "",
    location: existingData.location || "",
    locationType: existingData.locationType || "On-site",
    employmentType: existingData.employmentType || "",
    description: existingData.description || "",
    payType: existingData.payType || "range",
    salaryMin: existingData.salaryMin,
    salaryMax: existingData.salaryMax,
    payExact: existingData.payExact,
    rateUnit: existingData.rateUnit || "per year",
    hideSalary: existingData.hideSalary || false,
    status: existingData.status || "draft",
    attachmentName: existingData.attachmentName,
    attachmentFile: existingData.attachmentFile || null,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = <K extends keyof EditJobFormData>(
    key: K,
    value: EditJobFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      router.push("/recruiter/requisitions");
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-6xl mx-auto p-6 text-white"
    >
      {/* 🏷️ Job Basics */}
      <GlassCard>
        <h2 className="text-lg font-semibold mb-4">Job Basics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LabelRow icon={<Globe size={16} />} label="Country *" />
            <select
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a country…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <LabelRow icon={<Languages size={16} />} label="Language" />
            <input
              type="text"
              value={form.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <LabelRow icon={<Building2 size={16} />} label="Company *" />
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <LabelRow label="Job Title *" />
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <LabelRow label="Category *" />
            <CategorySelect
              value={form.category}
              onChange={(v) => handleChange("category", v)}
            />
          </div>

          {/* ✅ Location Type */}
          <div>
            <LabelRow icon={<MapPin size={16} />} label="Location Type *" />
            <select
              value={form.locationType}
              onChange={(e) => handleChange("locationType", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="Multiple Locations">Multiple Locations</option>
              <option value="On the Road">On the Road</option>
            </select>
          </div>

          <div>
            <LabelRow label="Location *" />
            <input
              type="text"
              placeholder="City, State / Region"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <LabelRow label="Employment Type *" />
            <JobTypeChips
              value={form.employmentType}
              onChange={(v) => handleChange("employmentType", v as any)}
            />
          </div>
        </div>
      </GlassCard>

      {/* 📝 Job Description */}
      <GlassCard>
        <h2 className="text-lg font-semibold mb-4">Job Description</h2>
        <RichTextEditor
          value={form.description}
          onChange={(v) => handleChange("description", v)}
        />

        <div className="mt-6">
          <LabelRow
            icon={<Upload size={16} />}
            label="Attach a file (optional)"
          />
          <label className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15 cursor-pointer transition">
            <Upload size={18} className="text-purple-300" />
            <span className="text-sm text-gray-300">
              {form.attachmentName || "Choose a file…"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange("attachmentName", file.name);
                  handleChange("attachmentFile", file);
                }
              }}
            />
          </label>
          {form.attachmentName && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-400" />
              Attached: {form.attachmentName}
            </p>
          )}
        </div>
      </GlassCard>

      {/* 💰 Compensation */}
      <GlassCard>
        <h2 className="text-lg font-semibold mb-4">Compensation</h2>
        <SalaryControls
          payType={form.payType}
          setPayType={(v) => handleChange("payType", v)}
          salaryMin={form.salaryMin}
          setSalaryMin={(v) => handleChange("salaryMin", v)}
          salaryMax={form.salaryMax}
          setSalaryMax={(v) => handleChange("salaryMax", v)}
          payExact={form.payExact}
          setPayExact={(v) => handleChange("payExact", v)}
          rateUnit={form.rateUnit}
          setRateUnit={(v) => handleChange("rateUnit", v)}
          disabled={form.hideSalary}
        />

        <div className="mt-4 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
          <input
            type="checkbox"
            id="hideSalary"
            checked={form.hideSalary}
            onChange={(e) => handleChange("hideSalary", e.target.checked)}
            className="h-4 w-4 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400"
          />
          <label htmlFor="hideSalary" className="text-sm text-gray-300">
            Prefer not to disclose salary
          </label>
        </div>
      </GlassCard>

      {/* 🖱️ Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* -----------------------------
   Supporting Components
----------------------------- */

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "India",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "Singapore",
  "Brazil",
  "South Africa",
];

function LabelRow({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_25px_rgba(124,58,237,0.1)] space-y-4">
      {children}
    </div>
  );
}
