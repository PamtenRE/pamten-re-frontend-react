'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalContext } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';
import SocialLoginButtons from './SocialLoginButtons';
import RecruitEdgeLogo from './RecruitEdgeLogo';

export default function LoginModal() {
  const { isOpen, closeModal } = useContext(ModalContext);
  const { login, register } = useAuth();
  const router = useRouter();

  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Remove OTP steps for now

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userId: '', // Added for login form
  });

  // Helper to get roleName for backend
  const getRoleName = () => (isRecruiter ? 'Recruiter' : 'Candidate');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(formData.userId, formData.password);
        closeModal();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          roleName: getRoleName(),
        });
        closeModal();
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleEmailOtpVerify = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Verifying Email OTP:', formData.emailOtp);
  //   setStep('phoneInput');
  // };

  // const handlePhoneSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Sending OTP to phone:', formData.phone);
  //   setStep('phoneOtp');
  // };

  // const handlePhoneOtpVerify = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Phone OTP verified:', formData.phoneOtp);
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="glass text-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? 'Log In' : 'Sign Up'} {isRecruiter && '(Recruiter)'}
        </h2>

        <div className="flex justify-center mb-4 gap-4">
          <button
            onClick={() => setIsRecruiter(false)}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              !isRecruiter
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-purple-600'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setIsRecruiter(true)}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              isRecruiter
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-purple-600'
            }`}
          >
            Recruiter
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Login fields: User ID and Password */}
            {isLogin ? (
              <>
                <input
                  type="text"
                  name="userId"
                  placeholder="User ID"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.userId || ''}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <>
                {/* Always show fullName for sign up */}
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-md bg-black/30 text-white"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg transition ${
                isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isLoading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

        <div className="text-center text-sm text-gray-300 mt-4">
          {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

        <SocialLoginButtons />

        <button
          onClick={closeModal}
          className="mt-6 w-full text-sm text-purple-400 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
