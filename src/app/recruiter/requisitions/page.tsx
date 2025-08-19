// src/app/recruiter/requisitions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import RequisitionCard from '@/components/recruiter/RequisitionCard';
import RecruiterLayout from '@/components/layout/RecruiterLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/utils/api';

type RequisitionStatus = 'Open' | 'In Review' | 'Closed';

interface BackendJob {
  jobId: string | number;
  title: string;
  city?: string;
  state?: string;
  postedDate?: string;
  isActive?: boolean;
  status?: string;
  applicants?: number;
}

interface RequisitionCardData {
  id: string | number;
  title: string;
  location: string;
  postedDate: string;
  status: RequisitionStatus;
  applicants: number;
}

const statuses = ['All', 'Open', 'Closed', 'In Review'];

export default function RequisitionListPage() {
  const [filter, setFilter] = useState('All');
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [requisitions, setRequisitions] = useState<RequisitionCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated && user?.role?.toLowerCase() === 'recruiter') return;

    // show message, then redirect politely
    const message = !isAuthenticated
      ? 'Please sign in to access recruiter requisitions.'
      : 'Only recruiter accounts can access this page.';
    setAccessDenied(message);
    const t = setTimeout(() => {
      router.replace(!isAuthenticated ? '/login' : '/');
    }, 1000);
    return () => clearTimeout(t);
  }, [hydrated, isAuthenticated, user, router]);

  // Load recruiter jobs from backend (must be declared before any early return)
  useEffect(() => {
    const fetchJobs = async () => {
      if (!hydrated) return;
      if (!user || !token) return;
      if (user.role?.toLowerCase() !== 'recruiter') return;
      setLoading(true);
      setError(null);
      try {
        const data: BackendJob[] = await apiFetch(`/api/jobs/v1/employer/${user.userId}`, {}, token);
        const mapped: RequisitionCardData[] = (data || []).map((job) => ({
          id: job.jobId,
          title: job.title,
          location: [job.city, job.state].filter(Boolean).join(', ') || '—',
          postedDate: job.postedDate || '—',
          status: job.status === 'Closed' ? 'Closed' : (job.isActive === false ? 'Closed' : 'Open'),
          applicants: typeof job.applicants === 'number' ? job.applicants : 0,
        }));
        setRequisitions(mapped);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load requisitions');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [hydrated, user, token]);

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== 'recruiter') {
    return <div className="p-6 text-sm text-gray-500">{accessDenied || 'Redirecting...'}</div>;
  }


  const filtered = filter === 'All' ? requisitions : requisitions.filter((job) => job.status === (filter as RequisitionStatus));

  return (
    <RecruiterLayout>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Requisitions</h1>
        <Link href="/recruiter/requisitions/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          + New Requisition
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1 rounded-full text-sm border hover:bg-white hover:text-black transition ${
              filter === s ? 'bg-white text-black' : 'bg-transparent text-white border-white/40'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading requisitions...</div>
      ) : error ? (
        <div className="text-sm text-red-400">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400">No requisitions found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <RequisitionCard key={req.id} {...req} />
          ))}
        </div>
      )}
    </div>
    </RecruiterLayout>
  );
}
