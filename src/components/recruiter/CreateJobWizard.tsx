"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DynamicJobSummary, { SummaryData } from "./DynamicJobSummary";
import JobTypeChips from "./JobTypeChips";
import LocationTypeRadios, { LocationType } from "./LocationTypeRadios";
import SalaryControls from "./SalaryControls";
import PreviewModal from "./PreviewModal";
import CategorySelect from "./CategorySelect";

import {
  Languages,
  Globe,
  Building2,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
// 🪶 Rich Text Editor (stable)
import RichTextEditor from "./RichTextEditor";

import "quill/dist/quill.snow.css";

export function DynamicReactQuill({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // ✅ Memoized toolbar config (prevents re-render)
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
      clipboard: { matchVisual: false },
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
    ],
    []
  );

  return (
    <div className="relative">
      <RichTextEditor
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-64 text-black bg-white rounded-lg"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          border-radius: 8px 8px 0 0;
        }
        .ql-container.ql-snow {
          border: none;
          border-radius: 0 0 8px 8px;
          font-size: 15px;
          line-height: 1.6;
        }
        .ql-editor {
          min-height: 200px;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}

export type JobFormData = {
  title: string;
  company: string;
  country: string;
  language: string;
  location: string;
  locationType: LocationType;
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Temporary"
    | "Internship"
    | "";
  category: string;
  description: string;
  responsibilities: string;
  skills: string[];
  attachmentName?: string;
  attachmentFile?: File | null;
  payType: "range" | "exact";
  salaryMin?: number;
  salaryMax?: number;
  payExact?: number;
  rateUnit: "per year" | "per hour" | "per day" | "per month";
  hideSalary?: boolean;
  deadline?: string;
  status: "draft" | "published" | "Open";
};

interface CreateJobWizardProps {
  mode?: "create" | "edit";
  existingData?: Partial<JobFormData>;
  onSubmit?: (data: Partial<JobFormData>) => Promise<void> | void;
}

const defaultData: JobFormData = {
  title: "",
  company: "",
  country: "",
  language: "English",
  location: "",
  locationType: "",
  employmentType: "",
  category: "",
  description: "",
  responsibilities: "",
  skills: [],
  attachmentName: undefined,
  attachmentFile: null,
  payType: "range",
  salaryMin: undefined,
  salaryMax: undefined,
  payExact: undefined,
  rateUnit: "per year",
  hideSalary: false,
  deadline: "",
  status: "draft",
};

const steps = ["Job Basics", "Description", "Compensation", "Preview"] as const;
type ErrorMap = Record<string, string | undefined>;

export default function CreateJobWizard({
  mode = "create",
  existingData,
  onSubmit,
}: CreateJobWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<JobFormData>(
    existingData ? { ...defaultData, ...existingData } : { ...defaultData }
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});

  // ✅ Prefill data when editing
  useEffect(() => {
    if (existingData) setData((prev) => ({ ...prev, ...existingData }));
  }, [existingData]);

  // Refs for scroll to error
  const refs = {
    country: useRef<HTMLDivElement>(null),
    language: useRef<HTMLDivElement>(null),
    company: useRef<HTMLDivElement>(null),
    title: useRef<HTMLDivElement>(null),
    category: useRef<HTMLDivElement>(null),
    locationType: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    employmentType: useRef<HTMLDivElement>(null),
    description: useRef<HTMLDivElement>(null),
    pay: useRef<HTMLDivElement>(null),
  };

  const canNext = useMemo(() => {
    const stepErrors = validateForStep(step, data);
    return Object.keys(stepErrors).length === 0;
  }, [step, data]);

  function update<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
    setData((d) => ({ ...d, [key]: value }));
  }

  function handleNext() {
    const stepErrors = validateForStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const firstKey = Object.keys(stepErrors)[0];
      refs[firstKey as keyof typeof refs]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setErrors({});
    setStep(step + 1);
  }

  // ✅ Handle submit (both create & edit)
  async function handleSubmit(status: JobFormData["status"]) {
    const allErrors = {
      ...validateForStep(0, data),
      ...validateForStep(1, data),
      ...validateForStep(2, data),
    };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstKey = Object.keys(allErrors)[0];
      setStep(stepIndexForField(firstKey));
      setTimeout(() => {
        refs[firstKey]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const { attachmentFile, ...json } = data;
      const payload = { ...json, status };

      if (mode === "edit" && onSubmit) {
        await onSubmit(payload);
        return;
      }

      // ✅ Default local storage create
      const newJob = {
        id: Date.now(),
        title: data.title,
        company: data.company,
        category: data.category,
        employmentType: data.employmentType,
        locationType: data.locationType,
        location: data.locationType === "remote" ? "Remote" : data.location,
        description: data.description,
        payExact: data.payExact,
        rateUnit: data.rateUnit,
        status,
        postedDate: new Date().toISOString(),
      };

      const saved = JSON.parse(
        localStorage.getItem("localRequisitions") || "[]"
      );
      localStorage.setItem(
        "localRequisitions",
        JSON.stringify([...saved, newJob])
      );

      router.push("/recruiter/requisitions");
    } catch (e: any) {
      setError(e?.message || "Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ Summary data
  const summary: SummaryData = {
    title: data.title,
    company: data.company,
    category: data.category,
    employmentType: data.employmentType,
    locationType: data.locationType,
    location: data.locationType === "remote" ? "Remote" : data.location,
    salaryMin: data.hideSalary ? undefined : data.salaryMin,
    salaryMax: data.hideSalary ? undefined : data.salaryMax,
    payType: data.hideSalary ? undefined : data.payType,
    payExact: data.hideSalary ? undefined : data.payExact,
    rateUnit: data.hideSalary ? undefined : data.rateUnit,
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-700/40 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {mode === "edit" ? "Edit Job" : steps[step]}
          </h2>
          <span className="text-sm text-gray-400">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        {/* STEP 0 */}
        {step === 0 && (
          <section className="space-y-6">
            <GlassCard ref={refs.country}>
              <LabelRow icon={<Globe size={16} />} label="Country *" />
              <select
                className={inputCls(!!errors.country)}
                value={data.country}
                onChange={(e) => update("country", e.target.value)}
              >
                <option value="">Select a country…</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900">
                    {c}
                  </option>
                ))}
              </select>
              <FieldError message={errors.country} />
            </GlassCard>

            <GlassCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={refs.language}>
                  <LabelRow icon={<Languages size={16} />} label="Language" />
                  <FormInput
                    invalid={!!errors.language}
                    value={data.language}
                    onChange={(e) => update("language", e.target.value)}
                  />
                  <FieldError message={errors.language} />
                </div>

                <div ref={refs.company}>
                  <LabelRow
                    icon={<Building2 size={16} />}
                    label="Company name *"
                  />
                  <FormInput
                    invalid={!!errors.company}
                    value={data.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Your Company"
                  />
                  <FieldError message={errors.company} />
                </div>
              </div>
            </GlassCard>

            <GlassCard ref={refs.title}>
              <LabelRow label="Job title *" />
              <FormInput
                invalid={!!errors.title}
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex. Frontend Developer"
              />
              <FieldError message={errors.title} />
            </GlassCard>

            <GlassCard ref={refs.category}>
              <LabelRow label="Category *" />
              <CategorySelect
                value={data.category}
                onChange={(v) => update("category", v)}
              />
              <FieldError message={errors.category} />
            </GlassCard>

            <GlassCard ref={refs.locationType}>
              <LabelRow label="Job Location *" />
              <LocationTypeRadios
                value={data.locationType}
                onChange={(v) => update("locationType", v)}
              />
              <FieldError message={errors.locationType} />
              {data.locationType !== "remote" && (
                <div className="mt-4" ref={refs.location}>
                  <FormInput
                    invalid={!!errors.location}
                    value={data.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="City, State / Region"
                  />
                  <FieldError message={errors.location} />
                </div>
              )}
            </GlassCard>

            <GlassCard ref={refs.employmentType}>
              <LabelRow label="Employment Type *" />
              <JobTypeChips
                value={data.employmentType}
                onChange={(v) => update("employmentType", v as any)}
              />
              <FieldError message={errors.employmentType} />
            </GlassCard>
          </section>
        )}
        {/* STEP 1 */}
        {step === 1 && (
          <section className="space-y-6">
            <GlassCard ref={refs.description}>
              <LabelRow label="Job description *" />

              {/* ✅ Rich Text Editor */}
              <div className="bg-white rounded-lg overflow-hidden text-black">
                <RichTextEditor
                  value={data.description}
                  onChange={(v) => update("description", v)}
                />
              </div>

              <FieldError message={errors.description} />
            </GlassCard>

            <GlassCard>
              <LabelRow
                icon={<Upload size={16} />}
                label="Upload a file (optional)"
              />
              <label className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15 cursor-pointer transition">
                <Upload size={18} className="text-purple-300" />
                <span className="text-sm text-gray-300">
                  {data.attachmentName || "Choose a file…"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      update("attachmentName", file.name);
                      update("attachmentFile", file);
                    }
                  }}
                />
              </label>
              {data.attachmentName && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-400" />
                  Attached: {data.attachmentName}
                </p>
              )}
            </GlassCard>
          </section>
        )}
        {/* STEP 2 */}
        {step === 2 && (
          <section className="space-y-6">
            <GlassCard ref={refs.pay}>
              <SalaryControls
                payType={data.payType}
                setPayType={(v) => update("payType", v)}
                salaryMin={data.salaryMin}
                setSalaryMin={(v) => update("salaryMin", v)}
                salaryMax={data.salaryMax}
                setSalaryMax={(v) => update("salaryMax", v)}
                payExact={data.payExact}
                setPayExact={(v) => update("payExact", v)}
                rateUnit={data.rateUnit}
                setRateUnit={(v) => update("rateUnit", v)}
                disabled={data.hideSalary}
              />
              <FieldError message={errors.pay} />
            </GlassCard>

            <GlassCard>
              <div className="mt-5 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition">
                <input
                  type="checkbox"
                  id="hideSalary"
                  checked={!!data.hideSalary}
                  onChange={(e) => update("hideSalary", e.target.checked)}
                  className="h-4 w-4 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400 cursor-pointer"
                />
                <label
                  htmlFor="hideSalary"
                  className="text-sm text-gray-300 cursor-pointer select-none"
                >
                  Prefer not to disclose salary
                </label>
              </div>
            </GlassCard>
          </section>
        )}
        {/* STEP 3 */}
        {step === 3 && (
          <section className="space-y-6">
            <GlassCard>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Final Review
                  </h3>
                  <p className="text-sm text-gray-400">
                    Preview how candidates will see your listing.
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:opacity-90 transition"
                  onClick={() => setPreviewOpen(true)}
                >
                  Open Preview
                </button>
              </div>
            </GlassCard>
          </section>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition"
            onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
          >
            Back
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition"
            onClick={() =>
              step < steps.length - 1 ? handleNext() : handleSubmit(data.status)
            }
          >
            {step < steps.length - 1
              ? "Next"
              : submitting
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Post Job"}
          </button>
        </div>
      </div>

      {/* Summary & Preview */}
      <DynamicJobSummary data={summary} />
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={summary}
      />
    </div>
  );
}

/* ===========================
   Validation & Utilities
=========================== */
function validateForStep(step: number, d: JobFormData): ErrorMap {
  const errs: ErrorMap = {};
  if (step === 0) {
    if (!d.country.trim()) errs.country = "This field is required.";
    if (!d.company.trim()) errs.company = "This field is required.";
    if (!d.title.trim()) errs.title = "This field is required.";
    if (!d.category.trim()) errs.category = "This field is required.";
    if (!d.locationType) errs.locationType = "Please select a location type.";
    if (d.locationType !== "remote" && !d.location.trim())
      errs.location = "Please provide a city/region.";
    if (!d.employmentType)
      errs.employmentType = "Please select an employment type.";
  }
  if (step === 1) {
    if (!d.description.trim()) errs.description = "This field is required.";
  }
  if (step === 2 && !d.hideSalary) {
    if (d.payType === "exact") {
      if (!d.payExact) errs.pay = "Please enter an exact amount.";
    } else {
      if (d.salaryMin == null || d.salaryMax == null)
        errs.pay = "Please enter a salary range.";
      else if ((d.salaryMin as number) > (d.salaryMax as number))
        errs.pay = "Max must be greater than or equal to min.";
    }
  }
  return errs;
}

function stepIndexForField(field: string): number {
  const step0 = [
    "country",
    "company",
    "title",
    "category",
    "locationType",
    "location",
    "employmentType",
  ];
  const step1 = ["description"];
  const step2 = ["pay"];
  if (step0.includes(field)) return 0;
  if (step1.includes(field)) return 1;
  return 2;
}

/* ===========================
   UI helpers
=========================== */
const inputBase =
  "w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500";
const inputError = "border-red-400 focus:ring-red-500";
function inputCls(invalid?: boolean) {
  return invalid ? `${inputBase} ${inputError}` : inputBase;
}

const GlassCard = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(function GlassCardBase({ children }, ref) {
  return (
    <div
      ref={ref}
      className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_25px_rgba(124,58,237,0.1)]"
    >
      {children}
    </div>
  );
});

function LabelRow({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <div className="text-sm font-medium text-gray-200">{label}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

function FormInput({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={inputCls(invalid)}
      placeholder={placeholder}
    />
  );
}

function FormArea({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={`${inputCls(invalid)} h-36`}
      placeholder={placeholder}
    />
  );
}

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
