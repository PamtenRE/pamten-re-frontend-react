'use client';

import RecruiterLayout from '@/components/layout/RecruiterLayout';
import { Users, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRecruiter } from '@/hooks/useRecruiter'; // mock for now
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';

export default function RecruiterDashboardPage() {
  const { name } = useRecruiter();
  const { user, token } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  // ✅ Mark hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Redirect after hydration & user load
  useEffect(() => {
    if (!hydrated) return;
    if (user === null) return; // user still loading

    if (!user) {
      setAccessDenied('Please sign in to access recruiter dashboard.');
      router.replace('/login');
    } else if (user.role.toLowerCase() !== 'recruiter') {
      setAccessDenied('Only recruiter accounts can access this page.');
      router.replace('/');
    }
  }, [user, hydrated, router]);

  // ✅ Fetch jobs once user/token ready
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/api/jobs/v1/employer/${user.userId}`, {}, token);
        setJobs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user, token]);

  // ✅ Show loading until user resolved
  if (!hydrated || user === null) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // ✅ Guard: Non-recruiters get message
  if (!user || user.role.toLowerCase() !== 'recruiter') {
    return <div className="p-6 text-sm text-gray-500">{accessDenied || 'Redirecting...'}</div>;
  }

  return (
    <RecruiterLayout>
      <section className="space-y-8 bg-white dark:bg-zinc-900 p-6 rounded-xl min-h-screen transition-colors duration-300">
        {/* Welcome */}
        <div className="glass rounded-2xl p-6 shadow text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold mb-1">Welcome, {name} 💼</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage your hiring pipeline and talent acquisition
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass hover:scale-[1.02] transition-transform duration-300 p-6 rounded-xl text-gray-900 dark:text-white shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Candidates in Pipeline</span>
              <Users size={20} className="text-teal-400" />
            </div>
            <h2 className="text-2xl font-semibold">128</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active this week</p>
          </div>
          <div className="glass hover:scale-[1.02] transition-transform duration-300 p-6 rounded-xl text-gray-900 dark:text-white shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Open Requisitions</span>
              <ClipboardList size={20} className="text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold">12</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
          </div>
        </div>

        {/* Job Management */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Posted Jobs</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading jobs...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-500">No jobs posted yet.</div>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job.jobId}
                  className="glass p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold text-lg">{job.title}</div>
                    <div className="text-sm text-gray-500">
                      {job.organizationName} &mdash; {job.city}, {job.state}
                    </div>
                    <div className="text-xs text-gray-400">Posted: {job.postedDate}</div>
                  </div>
                  <div className="mt-2 md:mt-0 flex gap-2">
                    <Link
                      href={`/recruiter/job-post/${job.jobId}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/recruiter/requisitions"
            className="glass hover:scale-[1.02] transition-transform duration-300 p-6 rounded-xl text-gray-900 dark:text-white hover:ring-2 hover:ring-purple-500 shadow"
          >
            <h3 className="text-xl font-semibold mb-2">📄 Requisitions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">View and manage all job openings</p>
          </Link>
          <Link
            href="/recruiter/candidates"
            className="glass hover:scale-[1.02] transition-transform duration-300 p-6 rounded-xl text-gray-900 dark:text-white hover:ring-2 hover:ring-purple-500 shadow"
          >
            <h3 className="text-xl font-semibold mb-2">🧑‍💼 Candidates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Track applications and candidate profiles</p>
          </Link>
        </div>
      </section>
    </RecruiterLayout>
  );
}
