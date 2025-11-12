"use client";

import { ProfileFormData } from "@/utils/profileHelpers";
import AIEnhanceButton from "@/components/candidate/AIEnhanceButton";
import RichTextEditor from "@/components/candidate/RichTextEditor";

interface BasicInfoStepProps {
  form: ProfileFormData;
  updateForm: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
}

export default function BasicInfoStep({
  form,
  updateForm,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        This information helps us create your professional profile and match you
        with relevant opportunities.
      </p>

      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.firstName}
            onChange={(e) => updateForm("firstName", e.target.value)}
            placeholder="John"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.lastName}
            onChange={(e) => updateForm("lastName", e.target.value)}
            placeholder="Doe"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.dob}
            onChange={(e) => updateForm("dob", e.target.value)}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.gender}
            onChange={(e) => updateForm("gender", e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
            placeholder="john.doe@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.location}
            onChange={(e) => updateForm("location", e.target.value)}
            placeholder="City, State"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.yearsOfExperience}
            onChange={(e) => updateForm("yearsOfExperience", e.target.value)}
            placeholder="5"
            min="0"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub Username
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.github}
            onChange={(e) => updateForm("github", e.target.value)}
            placeholder="johndoe"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            LinkedIn URL
          </label>
          <input
            type="url"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.linkedin}
            onChange={(e) => updateForm("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Professional Summary
        </label>

        <RichTextEditor
          value={form.summary || ""}
          onChange={(value) => updateForm("summary", value || "")}
          rows={5}
          placeholder="Write a brief summary about your professional experience, skills, and goals..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          minHeight="200px"
        />

        {/* ✨ AI Enhance Button */}
        <div className="mt-2">
          <AIEnhanceButton
            sectionName="Professional Summary"
            text={form.summary}
            onEnhance={(enhancedText) => updateForm("summary", enhancedText)}
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Pitch Video */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            2 min Pitch Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => updateForm("pitchVideoFile", e.target.files?.[0])}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
