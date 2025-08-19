'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';

export default function RecruiterProfilePage() {
  const { user, token, setUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(true); // Always editing if not completed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  // Backend-required fields
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState(user?.email || '');
  const [organizationName, setOrganizationName] = useState('');
  const [endClient, setEndClient] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [industryName, setIndustryName] = useState('');

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setAccessDenied('Please sign in to complete your recruiter profile.');
      router.replace('/login');
      return;
    }
    if (user.role.toLowerCase() !== 'recruiter') {
      setAccessDenied('Only recruiter accounts can access this page.');
      router.replace('/');
      return;
    }
    if (user.profileCompleted) {
      setIsEditing(false);
    }
  }, [user, router, hydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch(
        '/api/profile/v1/recruiter/complete',
        {
          method: 'POST',
          body: JSON.stringify({
            userId: user?.userId || '',
            hrName,
            hrEmail,
            organizationName,
            endClient,
            vendorName,
            dateOfBirth,
            gender,
            industryName,
          }),
        },
        token || undefined
      );
      setSuccess('Profile completed successfully!');
      if (user) {
        setUser({
          userId: user.userId || '',
          email: user.email || '',
          role: user.role || '',
          profileCompleted: true,
          token: user.token,
        });
      }
      setTimeout(() => {
        router.push('/recruiter/job-post');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return <div className="p-6">Loading...</div>;
  if (!user || user.role.toLowerCase() !== 'recruiter') return <div className="p-6 text-sm text-gray-500">{accessDenied || 'Redirecting...'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Complete Your Recruiter Profile</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">HR Name</label>
              <input type="text" value={hrName} onChange={e => setHrName(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">HR Email</label>
              <input type="email" value={hrEmail} onChange={e => setHrEmail(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Client</label>
              <input type="text" value={endClient} onChange={e => setEndClient(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vendor Name</label>
              <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry Name</label>
              <input type="text" value={industryName} onChange={e => setIndustryName(e.target.value)} required disabled={!isEditing} className="w-full px-3 py-2 border rounded-lg text-black" />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            {isEditing && (
              <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 