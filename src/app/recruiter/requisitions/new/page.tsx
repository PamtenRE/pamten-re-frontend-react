// src/app/recruiter/requisitions/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecruiterLayout from '@/components/layout/RecruiterLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/utils/api';

export default function NewRequisitionPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    type: 'Full-time',
    description: '',
    skills: '',
    industry: '',
    billRate: 75.5,
    durationMonths: 6,
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setAccessDenied('Please sign in to create a requisition.');
      router.replace('/login');
      return;
    }
    if (user.role.toLowerCase() !== 'recruiter') {
      setAccessDenied('Only recruiter accounts can access this page.');
      router.replace('/');
      return;
    }
  }, [user, hydrated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'billRate' || name === 'durationMonths' ? Number(value) : value });
  };

  const normalizeJobType = (t: string) => {
    const map: Record<string, string> = {
      'Full-Time': 'Full-time',
      'Full-time': 'Full-time',
      'Part-Time': 'Part-time',
      'Part-time': 'Part-time',
      'Contract': 'Contract',
    };
    return map[t] || 'Full-time';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user || !token) throw new Error('Not authenticated');

      // Map to backend API contract (/api/jobs/v1/post)
      const payload = {
        userId: user.userId,
        jobType: normalizeJobType(formData.type),
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.skills,
        postedBy: user.email,
        billRate: formData.billRate,
        durationMonths: formData.durationMonths,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        region: '',
        streetAddress: '',
        industryNames: [formData.industry || formData.department || 'IT Services'],
      };

      await apiFetch('/api/jobs/v1/post', { method: 'POST', body: JSON.stringify(payload) }, token);
      setSuccess('Requisition created successfully');
      setTimeout(() => router.push('/recruiter/requisitions'), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create requisition');
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return <div className="p-6">Loading...</div>;
  if (!user || user.role.toLowerCase() !== 'recruiter') return <div className="p-6 text-sm text-gray-500">{accessDenied || 'Redirecting...'}</div>;

  return (
    <RecruiterLayout>
    <div className="min-h-screen p-8 bg-gradient-to-b from-black to-neutral-900 text-white">
      <h1 className="text-3xl font-bold mb-6">📝 Create New Requisition</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block mb-1 text-sm font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Employment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Required Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Bill Rate</label>
            <input
              type="number"
              step="0.01"
              name="billRate"
              value={formData.billRate}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Duration (months)</label>
            <input
              type="number"
              name="durationMonths"
              value={formData.durationMonths}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Job Description</label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-black bg-opacity-30 border border-white/10"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Requisition'}
        </button>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
      </form>
    </div>
    </RecruiterLayout>
  );
}
