"use client";

import { useState } from "react";
import { ProfileFormData } from "@/utils/profileHelpers";

interface ATSResumeStepProps {
  form: ProfileFormData;
  updateForm: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
}

export default function ATSResumeStep({
  form,
  updateForm,
}: ATSResumeStepProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateForm("resumeFile", file);
    setStatus("⏳ Uploading and parsing resume...");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/parse-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || "Failed to parse resume");
      }

      const data = await resp.json();
      const parsed = data?.parsedData || data; // ✅ handle both wrapped and raw JSON

      if (!parsed) {
        setStatus("⚠️ Could not extract structured data from resume.");
        return;
      }

      // ✅ PERSONAL INFO FIXED — handle name, fullName, firstName/lastName
      if (parsed.personal || parsed.basic_info || parsed) {
        const p = parsed.personal || parsed.basic_info || parsed;

        let firstName = p.firstName || p.first_name || "";
        let lastName = p.lastName || p.last_name || "";

        // 🔹 If backend gives only "name" or "fullName", split into first/last
        // 🔹 If backend gives only "name" or "fullName", split into first/last
        const full = p.fullName || p.name;
        if (!firstName && !lastName && full) {
          const parts = full.trim().split(/\s+/);
          if (parts.length > 1) {
            lastName = parts.pop() || "";
            firstName = parts.join(" ");
          } else {
            firstName = parts[0] || "";
            lastName = "";
          }
        }

        updateForm("firstName", firstName || form.firstName);
        updateForm("lastName", lastName || form.lastName);
        updateForm("email", p.email || form.email);
        updateForm("phone", p.phone || form.phone);
        updateForm("location", p.location || form.location);
        updateForm("summary", parsed.summary || form.summary);
      }

      // ✅ SKILLS
      if (Array.isArray(parsed.skills)) {
        const skills = parsed.skills
          .map((s: any) => s.skills_list || s)
          .filter(Boolean);
        updateForm("skills", [...new Set([...form.skills, ...skills])]);
      }

      // ✅ EXPERIENCE
      if (Array.isArray(parsed.experience || parsed.work_experience)) {
        const experienceArray = parsed.experience || parsed.work_experience;
        const experience = experienceArray.map((exp: any) => ({
          id: crypto.randomUUID(),
          title: exp.jobTitle || exp.title || "",
          company: exp.company || "",
          startDate: exp.startDate || exp.start_date || "",
          endDate: exp.endDate || exp.end_date || "",
          location: exp.location || "",
          description: exp.description || "",
        }));
        updateForm("workExperience", [...form.workExperience, ...experience]);
      }

      // ✅ EDUCATION
      if (Array.isArray(parsed.education)) {
        const education = parsed.education.map((edu: any) => ({
          id: crypto.randomUUID(),
          degree: edu.degree || "",
          field: edu.field || "",
          school: edu.institution || edu.school || "",
          year: edu.graduationYear || edu.year || "",
        }));
        updateForm("education", [...form.education, ...education]);
      }

      // ✅ OPTIONAL — Auto AI summary fallback
      if (!parsed.summary && (parsed.personal || parsed.basic_info)) {
        try {
          const pitchResp = await fetch(
            `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/generate-elevator-pitch`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resumeData: parsed }),
            }
          );
          const pitchData = await pitchResp.json();
          if (pitchData?.elevatorPitch) {
            updateForm(
              "summary",
              `${form.summary}\n\n${pitchData.elevatorPitch}`
            );
          }
        } catch (err) {
          console.warn("⚠️ Elevator pitch generation failed:", err);
        }
      }

      setStatus("✨ Resume parsed successfully! Fields auto-filled.");
    } catch (err: any) {
      console.error("❌ Resume parsing failed:", err);
      setStatus(
        "❌ Failed to parse resume. Please try again with a clearer file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upload Resume
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload your resume to auto-fill profile details using AI parsing and
          Gemini summary.
        </p>
      </div>

      {/* Upload Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resume File
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700 transition-colors"
        />
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`mt-3 text-sm font-medium ${
            status.startsWith("✨")
              ? "text-green-600 dark:text-green-400"
              : status.startsWith("❌")
              ? "text-red-600 dark:text-red-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {status}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400 text-sm">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
              strokeOpacity="0.25"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M4 12a8 8 0 018-8"
            />
          </svg>
          Parsing your resume with AI...
        </div>
      )}
    </div>
  );
}
