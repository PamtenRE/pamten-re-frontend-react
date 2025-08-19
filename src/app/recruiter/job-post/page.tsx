'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/utils/api';

export default function JobPostForm() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    remote: false,
    employmentType: '',
    description: '',
    skills: '',
    experience: 0,
    salaryRange: [60000, 120000],
    deadline: '',
    resumeRequired: true,
    questions: ['', ''],
    maxApplicants: 'Unlimited',
    companyLogo: '',
    companyName: '',
    aboutCompany: '',
    website: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(e.target.value);
    const updated = [...formData.salaryRange];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, salaryRange: updated }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user) throw new Error('Not authenticated');
      // Map frontend fields to backend fields
      const payload = {
        userId: user.userId,
        jobType: formData.employmentType,
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.skills,
        postedBy: user.email,
        billRate: (formData.salaryRange[0] + formData.salaryRange[1]) / 2,
        durationMonths: 6, // You can add a field for this if needed
        city: formData.location,
        state: '', // Add state field if needed
        zipCode: '', // Add zip field if needed
        country: '', // Add country field if needed
        region: '', // Add region field if needed
        streetAddress: '', // Add address field if needed
        industryNames: [formData.department || 'IT Services'],
      };
      await apiFetch('/api/jobs/v1/post', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token || undefined);
      setSuccess('Job posted successfully!');
      setTimeout(() => {
        router.push('/recruiter/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen glass p-8 rounded-xl shadow-xl max-w-5xl mx-auto animate-fadeIn">
        <DashboardNavbar />
      <h1 className="text-3xl font-bold mb-8 text-center">📝 Create New Job Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">📌 Basic Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} className="p-2 rounded bg-white/20 border border-white/30" />
            <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="p-2 rounded bg-white/20 border border-white/30" />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 rounded bg-white/20 border border-white/30" />
            <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="p-2 rounded bg-white/20 border border-white/30">
              <option value="">Select Employment Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="remote" checked={formData.remote} onChange={handleChange} /> Remote/Hybrid
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📋 Job Description & Requirements</h2>
          <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-white/20 border border-white/30"></textarea>
          <input name="skills" placeholder="Required Skills" value={formData.skills} onChange={handleChange} className="w-full mt-4 p-2 rounded bg-white/20 border border-white/30" />
          <label className="block mt-4">Years of Experience: {formData.experience}</label>
          <input type="range" name="experience" min="0" max="10" value={formData.experience} onChange={handleChange} className="w-full" />
          <div className="flex justify-between items-center mt-2">
            <span>$60,000</span>
            <input type="range" min="60000" max="120000" value={formData.salaryRange[0]} onChange={(e) => handleSalaryChange(e, 0)} className="w-full mx-4" />
            <input type="range" min="60000" max="120000" value={formData.salaryRange[1]} onChange={(e) => handleSalaryChange(e, 1)} className="w-full mx-4" />
            <span>$120,000</span>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📑 Application Preferences</h2>
          <input name="deadline" placeholder="Application Deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 rounded bg-white/20 border border-white/30" />
          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="resumeRequired" checked={formData.resumeRequired} onChange={handleChange} /> Resume Upload Required
          </label>
          {formData.questions.map((q, i) => (
            <input
              key={i}
              name={`question-${i}`}
              placeholder={`Custom Question ${i + 1}`}
              value={q}
              onChange={(e) => {
                const questions = [...formData.questions];
                questions[i] = e.target.value;
                setFormData((prev) => ({ ...prev, questions }));
              }}
              className="w-full mt-2 p-2 rounded bg-white/20 border border-white/30"
            />
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🏢 Company Branding</h2>
          <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full p-2 rounded bg-white/20 border border-white/30" />
          <textarea name="aboutCompany" placeholder="About Company" value={formData.aboutCompany} onChange={handleChange} className="w-full mt-2 p-2 rounded bg-white/20 border border-white/30"></textarea>
          <input name="website" placeholder="Company Website URL" value={formData.website} onChange={handleChange} className="w-full mt-2 p-2 rounded bg-white/20 border border-white/30" />
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg bg-white/20 border-white/30 hover:bg-white/30">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {success && <div className="text-green-600 text-center mt-4">{success}</div>}
      </form>
    </div>
  );
}
