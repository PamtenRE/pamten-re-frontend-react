'use client';
import { useState, useEffect, useRef, useContext } from 'react';
import {
  CheckCircle, Sparkles, Clock, BarChart, Globe,
  Users, Settings, ActivitySquare, Shield, Briefcase, ArrowRight
} from 'lucide-react';
import { ModalContext } from '@/contexts/LoginModalContext';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  CheckCircle,
  Clock,
  BarChart,
  Globe,
  Users,
  Settings,
  ActivitySquare,
  Shield,
  Briefcase,
  ArrowRight,
};

interface Feature {
  icon: keyof typeof iconMap;
  text: string;
}

function AnimatedStat({ value, suffix, duration = 1200 }: { value: number, suffix?: string, duration?: number }) {
  const [display, setDisplay] = useState(0);
  const start = useRef<number>(0);

  useEffect(() => {
    let raf: number;
    const step = (timestamp: number) => {
      if (!start.current) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className="text-3xl font-bold mb-2">{display}{suffix}</span>;
}

export default function BuiltForEveryone() {
  const [tab, setTab] = useState<'candidate' | 'recruiter'>('candidate');
  const { openModal } = useContext(ModalContext);
  const [candidateFeatures, setCandidateFeatures] = useState<Feature[]>([]);
  const [recruiterFeatures, setRecruiterFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/features?type=candidate').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch candidate features')),
      fetch('/api/features?type=recruiter').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch recruiter features')),
    ])
      .then(([candidateData, recruiterData]) => {
        setCandidateFeatures(candidateData.features || []);
        setRecruiterFeatures(recruiterData.features || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(typeof err === 'string' ? err : err.message);
        setLoading(false);
      });
  }, []);

  // Accessibility: keyboard navigation for tabs
  const tabRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % 2 : (idx + 1) % 2;
      tabRefs[nextIdx].current?.focus();
      setTab(nextIdx === 0 ? 'candidate' : 'recruiter');
    }
  };

  return (
    <section className="relative w-full py-20">
      {/* Blurred background blob */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center pointer-events-none">
        <div className="w-3/4 h-96 bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="glass rounded-2xl shadow-2xl p-8 md:p-16 w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Built for Everyone
          </h2>
          <div className="flex justify-center mb-8 relative" role="tablist" aria-label="User type tabs">
            <button
              ref={tabRefs[0]}
              className={`px-6 py-2 font-medium transition focus:outline-none ${
                tab === 'candidate'
                  ? 'text-blue-600'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              aria-selected={tab === 'candidate'}
              aria-controls="candidate-panel"
              tabIndex={tab === 'candidate' ? 0 : -1}
              onClick={() => setTab('candidate')}
              onKeyDown={e => handleKeyDown(e, 0)}
              id="candidate-tab"
              type="button"
            >
              For Candidates
              {tab === 'candidate' && (
                <span className="block h-1 bg-blue-600 rounded-full mt-1 transition-all duration-300"></span>
              )}
            </button>
            <button
              ref={tabRefs[1]}
              className={`px-6 py-2 font-medium transition focus:outline-none ${
                tab === 'recruiter'
                  ? 'text-blue-600'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              aria-selected={tab === 'recruiter'}
              aria-controls="recruiter-panel"
              tabIndex={tab === 'recruiter' ? 0 : -1}
              onClick={() => setTab('recruiter')}
              onKeyDown={e => handleKeyDown(e, 1)}
              id="recruiter-tab"
              type="button"
            >
              For Recruiters
              {tab === 'recruiter' && (
                <span className="block h-1 bg-blue-600 rounded-full mt-1 transition-all duration-300"></span>
              )}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              id={tab === 'candidate' ? 'candidate-panel' : 'recruiter-panel'}
              role="tabpanel"
              aria-labelledby={tab === 'candidate' ? 'candidate-tab' : 'recruiter-tab'}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {tab === 'candidate' ? 'Your Career, Supercharged' : 'Recruitment, Reimagined'}
              </h3>
              {loading ? (
                <div className="text-center text-white py-10">Loading features...</div>
              ) : error ? (
                <div className="text-center text-red-400 py-10">{error}</div>
              ) : (
                <ul className="space-y-3 mb-6">
                  {(tab === 'candidate' ? candidateFeatures : recruiterFeatures).map((feature, idx) => {
                    const Icon = iconMap[feature.icon] || Sparkles;
                    return (
                      <li key={idx} className="flex items-start gap-2 text-gray-800 dark:text-gray-200">
                        <Icon className="mt-1 text-blue-500 w-5 h-5 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <button
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition flex items-center gap-2"
                onClick={() => openModal('signup')}
              >
                {tab === 'candidate' ? (
                  <>
                    Start Your Journey <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" /> Transform Your Agency
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <div className="glass bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl p-8 shadow-xl flex flex-col items-center w-full max-w-xs animate-fadeIn border border-white/20">
                {tab === 'candidate' ? (
                  <>
                    <AnimatedStat value={85} suffix="%" />
                    <span className="text-lg text-center">
                      of candidates find their dream job within 30 days
                    </span>
                  </>
                ) : (
                  <>
                    <AnimatedStat value={3} suffix="x" />
                    <span className="text-lg text-center">
                      faster time-to-hire with automated workflows
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}