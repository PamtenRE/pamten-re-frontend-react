"use client";

import React from "react";

interface ResumePreviewProps {
  resumeData: any;
  styleOptions?: {
    fontFamily?: string;
    fontSize?: number;
    accentColor?: string;
  };
  showPamtenLogo?: boolean;
  profilePic?: { preview?: string };
}

export default function ResumePreview({
  resumeData,
  styleOptions = {
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    accentColor: "#2563eb",
  },
  showPamtenLogo = false,
  profilePic = {},
}: ResumePreviewProps) {
  const {
    personal = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    researchPapers = [],
  } = resumeData || {};

  const contactParts: React.ReactNode[] = [];
  if (personal.email) contactParts.push(personal.email);
  if (personal.phone) contactParts.push(personal.phone);
  if (personal.location) contactParts.push(personal.location);
  if (personal.linkedin) {
    const raw = personal.linkedin.trim();
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const label = href.replace(/^https?:\/\//i, "");
    contactParts.push(
      <a
        key="linkedin"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline break-all text-blue-600"
      >
        {label}
      </a>
    );
  }

  const renderHTML = (html?: string) =>
    html ? (
      <div
        className="text-gray-800 text-[12px] prose prose-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : null;

  return (
    <div
      id="resume-preview"
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[600px] overflow-y-auto"
      style={{
        fontFamily: styleOptions.fontFamily,
        fontSize: `${styleOptions.fontSize}pt`,
        lineHeight: 1.6,
      }}
    >
      {/* Pamten Logo */}
      {showPamtenLogo && (
        <div className="mb-4">
          <img src="/pamten_logo.png" alt="Pamten Logo" className="w-28" />
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-300">
        <h2
          className="text-3xl font-bold tracking-wide"
          style={{ color: styleOptions.accentColor }}
        >
          {personal.name || "Your Name"}
        </h2>
        <p className="text-gray-600 mt-1">
          {contactParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && " | "}
              {part}
            </React.Fragment>
          ))}
        </p>
        {profilePic?.preview && (
          <img
            src={profilePic.preview}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mt-3 object-cover border"
          />
        )}
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Summary
          </h3>
          {renderHTML(summary)}
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Experience
          </h3>
          {experience.map((exp: any, i: number) => (
            <div key={i} className="mb-3 text-gray-800">
              <p className="font-semibold text-[13px] leading-tight">
                <b>{exp.title || exp.jobTitle || "Job Title"}</b>
                {exp.company && (
                  <span className="font-semibold text-gray-900">
                    {" "}
                    — {exp.company}
                  </span>
                )}
              </p>
              {(exp.startDate || exp.endDate) && (
                <p className="text-gray-500 text-xs mb-1">
                  {exp.startDate || ""} {exp.endDate && ` - ${exp.endDate}`}
                </p>
              )}
              {renderHTML(exp.description)}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Education
          </h3>
          {education.map((edu: any, i: number) => (
            <div key={i} className="mb-2 text-gray-800">
              <p className="font-semibold text-[13px]">
                <b>{edu.degree}</b>
                {(edu.field || edu.studyField) && (
                  <span> — {edu.field || edu.studyField}</span>
                )}
              </p>
              <p className="text-gray-600 text-xs">
                {edu.school || edu.institution}{" "}
                {(edu.year || edu.graduationYear) &&
                  `| ${edu.year || edu.graduationYear}`}
              </p>
              {edu.gpa && (
                <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
              )}
              {renderHTML(edu.achievements)}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Skills
          </h3>
          {Array.isArray(skills[0]) || typeof skills[0] === "string" ? (
            <p className="text-[12px] text-gray-800">{skills.join(", ")}</p>
          ) : (
            skills.map((s: any, i: number) => (
              <p key={i} className="text-[12px] text-gray-800">
                <b>{s.category || "Technical Skills"}:</b>{" "}
                {Array.isArray(s.skills)
                  ? s.skills.join(", ")
                  : s.skills_list || ""}
              </p>
            ))
          )}
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Projects
          </h3>
          {projects.map((proj: any, i: number) => (
            <div key={i} className="mb-2 text-gray-800">
              <p className="font-semibold text-[13px]">
                <b>{proj.title || proj.name || "Project Title"}</b>{" "}
                {proj.date && (
                  <span className="text-gray-500 text-xs">({proj.date})</span>
                )}
              </p>
              {renderHTML(proj.description)}
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-[12px]"
                >
                  {proj.link}
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Research Papers */}
      {researchPapers?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Research Papers
          </h3>
          {researchPapers.map((paper: any, i: number) => (
            <div key={i} className="mb-2 text-gray-800">
              <p className="font-semibold text-[13px]">
                <b>{paper.title}</b>
                {paper.link && (
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-1"
                  >
                    [View]
                  </a>
                )}
              </p>
              {renderHTML(paper.description)}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="mb-5">
          <h3
            className="font-bold text-lg border-b pb-1 mb-2 uppercase tracking-wide"
            style={{ color: styleOptions.accentColor }}
          >
            Certifications
          </h3>
          {certifications.map((cert: any, i: number) => (
            <div key={i} className="mb-2 text-gray-800">
              <p className="font-semibold text-[13px]">
                <b>{cert.name}</b>
                {cert.issuer && (
                  <span className="text-gray-900"> — {cert.issuer}</span>
                )}
              </p>
              {cert.date && (
                <p className="text-gray-500 text-xs">{cert.date}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
