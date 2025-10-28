'use client';

import { ProfileFormData } from '@/utils/profileHelpers';

interface ExperienceStepProps {
  form: ProfileFormData;
  updateEducation: (index: number, field: string, value: string) => void;
  updateCertification: (index: number, field: string, value: any) => void;
  updateWorkExperience: (index: number, field: string, value: string) => void;
  updateProject: (index: number, field: string, value: string) => void;
  updateResearchPaper: (index: number, field: string, value: string) => void;
  addEducation: () => void;
  addCertification: () => void;
  addWorkExperience: () => void;
  addProject: () => void;
  addResearchPaper: () => void;
  deleteEducation: (id: string) => void;
  deleteCertification: (id: string) => void;
  deleteWorkExperience: (id: string) => void;
  deleteProject: (id: string) => void;
  deleteResearchPaper: (id: string) => void;
}

export default function ExperienceStep({
  form,
  updateEducation,
  updateCertification,
  updateWorkExperience,
  updateProject,
  updateResearchPaper,
  addEducation,
  addCertification,
  addWorkExperience,
  addProject,
  addResearchPaper,
  deleteEducation,
  deleteCertification,
  deleteWorkExperience,
  deleteProject,
  deleteResearchPaper,
}: ExperienceStepProps) {
  return (
    <div className="space-y-8">
      {/* Header with Icon */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experience</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your education, work experience, certifications, projects, and research papers.
        </p>
      </div>

      {/* ========================================== */}
      {/* EDUCATION SECTION */}
      {/* ========================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
        
        {/* Map through education array */}
        {form.education.map((edu, index) => (
          <div key={edu.id} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800">
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteEducation(edu.id)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete education entry"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Degree Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>

            {/* Field of Study */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>

            {/* School/University */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">School/University</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={edu.school}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                placeholder="University Name"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={edu.year}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                placeholder="2022"
              />
            </div>
          </div>
        ))}
        
        {/* Add Education Button */}
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Add Education
        </button>
      </div>

      {/* ========================================== */}
      {/* CERTIFICATIONS SECTION */}
      {/* ========================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h3>
        
        {form.certifications.map((cert, index) => (
          <div key={cert.id} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800">
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteCertification(cert.id)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete certification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Certification Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Certification Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            {/* Issuer */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Issuer</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            {/* Credential URL - Full Width */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Credential URL</label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={cert.credentialUrl}
                onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                placeholder="https://credential.example.com"
              />
            </div>

            {/* Certificate Image - Full Width */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Certificate Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateCertification(index, 'image', e.target.files?.[0])}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>
        ))}
        
        {/* Add Certification Button */}
        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Add Certification
        </button>
      </div>

      {/* ========================================== */}
      {/* WORK EXPERIENCE SECTION */}
      {/* ========================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Experience</h3>
        
        {form.workExperience.map((work, index) => (
          <div key={work.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800">
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteWorkExperience(work.id)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete work experience"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Job Title and Company */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={work.title}
                  onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={work.company}
                  onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              {/* Start and End Dates */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={work.startDate}
                  onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={work.endDate}
                  onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={work.location}
                onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                placeholder="City, State"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={work.description}
                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        ))}
        
        {/* Add Work Experience Button */}
        <button
          type="button"
          onClick={addWorkExperience}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Add Work Experience
        </button>
      </div>

      {/* ========================================== */}
      {/* PROJECTS SECTION */}
      {/* ========================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projects</h3>
        
        {form.projects.map((project, index) => (
          <div key={project.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800">
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteProject(project.id)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Project Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                placeholder="My Awesome Project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                placeholder="Brief description"
              />
            </div>

            {/* Project Link */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Link</label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={project.link}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        ))}
        
        {/* Add Project Button */}
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {/* ========================================== */}
      {/* RESEARCH PAPERS SECTION */}
      {/* ========================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Research Papers</h3>
        
        {form.researchPapers.map((paper, index) => (
          <div key={paper.id} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800">
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteResearchPaper(paper.id)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete research paper"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Paper Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Paper Title</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={paper.title}
                onChange={(e) => updateResearchPaper(index, 'title', e.target.value)}
                placeholder="Research Paper Title"
              />
            </div>

            {/* Publication Link */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Publication Link</label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={paper.link}
                onChange={(e) => updateResearchPaper(index, 'link', e.target.value)}
                placeholder="https://example.com/paper"
              />
            </div>
          </div>
        ))}
        
        {/* Add Research Paper Button */}
        <button
          type="button"
          onClick={addResearchPaper}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Add Research Paper
        </button>
      </div>
    </div>
  );
}