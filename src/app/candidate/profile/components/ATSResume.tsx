"use client";

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upload Resume
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload your resume to complete your profile.
        </p>
      </div>

      {/* Resume File Upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resume File
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => updateForm("resumeFile", e.target.files?.[0])}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700 transition-colors"
        />

        {/* Success Message - Shows filename when uploaded */}
        {form.resumeFile && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{form.resumeFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
