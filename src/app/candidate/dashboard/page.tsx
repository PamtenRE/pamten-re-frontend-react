'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';

export default function CandidateDashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user?.role !== 'candidate') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch('/api/jobs/v1/all', {}, token || undefined);
        setJobs(data.jobs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchJobs();
  }, [token]);

  if (!user || user?.role !== 'candidate') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user.email} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Manage your job applications and profile
          </p>
          {/* Job Listing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading jobs...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-gray-500">No jobs found.</div>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li key={job.jobId} className="glass p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-lg">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.organizationName} &mdash; {job.city}, {job.state}</div>
                      <div className="text-xs text-gray-400">Posted: {job.postedDate}</div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">Apply</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="glass bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                Browse Jobs
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 