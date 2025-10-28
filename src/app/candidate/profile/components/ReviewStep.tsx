"use client";

import React from "react";
import { ProfileFormData } from "@/utils/profileHelpers";

interface ReviewStepProps {
  form: ProfileFormData;
  onEditStep: (index: number) => void;
  onSubmitProfile: () => void;
}

export default function ReviewStep({
  form,
  onEditStep,
  onSubmitProfile,
}: ReviewStepProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Review Your Profile
      </h2>

      {/* BASIC INFO */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Basic Information
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(0)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">First Name</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.firstName || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Last Name</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.lastName || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Date of Birth</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.dob || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Gender</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1 capitalize">{form.gender || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Email</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.email || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Phone</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.phone || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Location</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.location || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Years of Experience</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.yearsOfExperience || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{form.github || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">LinkedIn</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1 break-all">{form.linkedin || "—"}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-medium text-gray-900 dark:text-white">Professional Summary</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">
            {form.summary || "—"}
          </p>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.education.length > 0 ? (
          <div className="space-y-3">
            {form.education.map((edu) => (
              <div key={edu.id} className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {edu.school} ({edu.year})
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No education details added.</p>
        )}
      </section>

      {/* CERTIFICATIONS */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Certifications</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.certifications.length > 0 ? (
          <div className="space-y-3">
            {form.certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                {cert.credentialUrl && (
                  
                  <a href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No certifications added.</p>
        )}
      </section>

      {/* WORK EXPERIENCE */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Work Experience</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.workExperience.length > 0 ? (
          <div className="space-y-4">
            {form.workExperience.map((exp) => (
              <div key={exp.id} className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {exp.title} at {exp.company}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {exp.startDate} - {exp.endDate} • {exp.location}
                </p>
                {exp.description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No work experience added.</p>
        )}
      </section>

      {/* PROJECTS */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Projects</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.projects.length > 0 ? (
          <div className="space-y-3">
            {form.projects.map((proj) => (
              <div key={proj.id} className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{proj.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{proj.description}</p>
                {proj.link && (
                  
                   <a href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No projects added.</p>
        )}
      </section>

      {/* RESEARCH PAPERS */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Research Papers</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.researchPapers.length > 0 ? (
          <div className="space-y-3">
            {form.researchPapers.map((paper) => (
              <div key={paper.id} className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{paper.title}</p>
                {paper.link && (
                  
                   <a href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    Read Paper
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No research papers added.</p>
        )}
      </section>

      {/* SKILLS */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills</h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No skills added.</p>
        )}
      </section>

      {/* RESUME */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resume</h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
        {form.resumeFile ? (
          <p className="text-sm text-green-600 dark:text-green-400">
            Uploaded: {form.resumeFile.name}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No resume uploaded.</p>
        )}
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => onEditStep(3)}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmitProfile}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}