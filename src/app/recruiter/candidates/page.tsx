// src/app/recruiter/candidates/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import RecruiterLayout from '@/components/layout/RecruiterLayout';
import CandidateCard from '@/components/recruiter/CandidateCard';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/utils/api';

interface BackendCandidate {
  candidateId: string;
  fullName: string;
  targetRole?: string;
  status?: string;
  city?: string;
  state?: string;
  yearsExperience?: number;
}

interface UICandidate {
  id: string;
  name: string;
  role: string;
  status: string;
  location: string;
  experience: string;
}

const statusOptions = ['All', 'Shortlisted', 'Interviewed', 'Applied'];
const roleOptions = ['All', 'Frontend Developer', 'Backend Developer'];

export default function CandidateListPage() {
  const { user, token } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [candidates, setCandidates] = useState<UICandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!user || !token) return;
      setLoading(true);
      setError(null);
      try {
        // Proposed backend endpoint; implement to return DB candidates visible to employer
        const data: BackendCandidate[] = await apiFetch(`/api/candidates/v1/by-employer/${user.userId}`, {}, token);
        const mapped: UICandidate[] = (data || []).map((c) => ({
          id: c.candidateId,
          name: c.fullName,
          role: c.targetRole || '—',
          status: c.status || 'Applied',
          location: [c.city, c.state].filter(Boolean).join(', ') || '—',
          experience: c.yearsExperience != null ? `${c.yearsExperience} years` : '—',
        }));
        setCandidates(mapped);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [user, token]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const statusMatch = statusFilter === 'All' || candidate.status === statusFilter;
      const roleMatch = roleFilter === 'All' || candidate.role === roleFilter;
      return statusMatch && roleMatch;
    });
  }, [candidates, statusFilter, roleFilter]);

  return (
    <RecruiterLayout>
      <div className="flex flex-col gap-6">
        <div className="glass p-4 rounded-xl flex flex-wrap gap-4 items-center">
          <label className="text-sm text-gray-900 dark:text-white">
            Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ml-2 p-2 rounded bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-900 dark:text-white">
            Role:
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="ml-2 p-2 rounded bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading candidates...</div>
        ) : error ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="glass rounded-xl p-4 hover:scale-[1.02] transition-all duration-300">
                <CandidateCard candidate={candidate} />
              </div>
            ))}
            {filteredCandidates.length === 0 && <div className="text-sm text-gray-400">No candidates.</div>}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
}
