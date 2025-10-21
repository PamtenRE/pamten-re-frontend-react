"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, ClipboardList, CalendarCheck } from "lucide-react";
import Link from "next/link";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRecruiter } from "@/hooks/useRecruiter";
import { apiFetch } from "@/utils/api";

const USE_BACKEND = false; // ✅ Toggle this later
// Small helper for animated numbers
function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = setInterval(() => {
      if (start < end) {
        start++;
        setCount(start);
      } else clearInterval(step);
    }, 20);
    return () => clearInterval(step);
  }, [end]);
  return <span>{count}</span>;
}

export default function RecruiterDashboardPage() {
  const { name } = useRecruiter();
  const { user, token } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  // ✅ Ensure hydration before rendering
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Redirect unauthorized users
  useEffect(() => {
    if (!hydrated) return;
    if (user === null) return; // user still loading

    if (!user) {
      setAccessDenied("Please sign in to access recruiter dashboard.");
      router.replace("/login");
    } else if (user.role.toLowerCase() !== "recruiter") {
      setAccessDenied("Only recruiter accounts can access this page.");
      router.replace("/");
    }
  }, [user, hydrated, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!hydrated) return;
      setLoading(true);
      setError(null);

      try {
        if (USE_BACKEND && user && token) {
          // ✅ Fetch from backend later
          const data = await apiFetch(
            `/api/jobs/v1/employer/${user.userId}`,
            {},
            token
          );

          const mapped = (data || []).map((job: any) => ({
            id: job.jobId,
            title: job.title,
            location: [job.city, job.state].filter(Boolean).join(", ") || "—",
            postedDate: job.postedDate || "—",
            status:
              job.status === "Closed"
                ? "Closed"
                : job.isActive === false
                ? "Closed"
                : "Open",
            applicants: typeof job.applicants === "number" ? job.applicants : 0,
          }));

          setJobs(mapped);
        } else {
          // ✅ Fallback: read from localStorage
          const localJobs = JSON.parse(
            localStorage.getItem("localRequisitions") || "[]"
          );

          const mapped = (localJobs || []).map((job: any) => ({
            id: job.id || job.jobId || crypto.randomUUID(),
            title: job.title || "Untitled",
            location:
              job.location ||
              [job.city, job.state].filter(Boolean).join(", ") ||
              "—",
            postedDate: job.postedDate || "—",
            status: job.status || "draft",
            applicants: job.applicants || 0,
          }));

          setJobs(mapped.slice(0, 3)); // limit to 3
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [hydrated, user, token]);

  // ✅ Loading state
  if (!hydrated || user === null) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // ✅ Guard for non-recruiters
  if (!user || user.role.toLowerCase() !== "recruiter") {
    return (
      <div className="p-6 text-sm text-gray-500">
        {accessDenied || "Redirecting..."}
      </div>
    );
  }

  return (
    <RecruiterLayout>
      <div className="relative min-h-screen">
        {/* Background glow */}
        <div className="absolute -z-10 top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <section className="space-y-10 p-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass p-6 rounded-2xl relative overflow-hidden border border-white/10 shadow-lg"
          >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Welcome,{" "}
              {user?.firstName
                ? user.firstName
                : user?.email
                ? user.email.split("@")[0]
                : "Recruiter"}
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Manage your hiring pipeline, review candidates, and track your
              recruitment activity efficiently.
            </p>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-400 to-teal-400 animate-pulse"></div>
          </motion.div>

          {/* “Create Job” Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 
             p-6 md:p-8 text-white flex flex-col md:flex-row items-center 
             justify-between shadow-xl hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] 
             transition-all"
          >
            {/* Left content */}
            <div className="flex-1 space-y-4 text-center md:text-left flex flex-col justify-center pl-6 md:pl-8">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Have a new job posting?
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-md mx-auto md:mx-0">
                Post your new job and reach qualified candidates instantly.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center md:justify-start origin-left"
              >
                <Link
                  href="/recruiter/job-post"
                  className="bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-lg 
                   shadow-lg hover:shadow-purple-400/30 hover:bg-purple-100 
                   transition-transform duration-300 ease-out"
                >
                  + Create Job
                </Link>
              </motion.div>
            </div>

            {/* Right image */}
            <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-8 flex justify-center">
              <img
                src="/recruiter-banner.svg"
                alt="Hiring Illustration"
                className="w-44 md:w-56 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              />
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Candidates in Pipeline",
                value: 55,
                icon: <Users size={22} className="text-teal-400" />,
              },
              {
                title: "Open Requisitions",
                value: jobs.length,
                icon: <ClipboardList size={22} className="text-orange-400" />,
              },
              {
                title: "Interviews Scheduled",
                value: 9,
                icon: <CalendarCheck size={22} className="text-blue-400" />,
              },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className="glass p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{kpi.title}</span>
                  {kpi.icon}
                </div>
                <h2 className="text-3xl font-semibold text-white">
                  <CountUp end={kpi.value} />
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {i === 0
                    ? "Active this week"
                    : i === 1
                    ? "This month"
                    : "Upcoming interviews"}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Job Management */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Your Posted Jobs
              </h2>
              <Link
                href="/recruiter/requisitions"
                className="text-sm text-purple-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="text-center text-gray-500">Loading jobs...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-gray-500">
                No jobs posted yet.
              </div>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job: any, index: number) => (
                  <motion.li
                    key={job.jobId || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-between flex-wrap items-center">
                      <div>
                        <div className="font-semibold text-lg text-white">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          {job.organizationName} — {job.city}, {job.state}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Posted: {job.postedDate || "—"}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/recruiter/applications/${job.jobId}`}
                          className="px-3 py-1.5 text-xs bg-purple-600/20 text-purple-300 rounded-md hover:bg-purple-600/30 transition"
                        >
                          View Applicants
                        </Link>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Navigation Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          >
            <Link
              href="/recruiter/applications"
              className="glass hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                📄 Applications
              </h3>
              <p className="text-sm text-gray-400">
                Review applicants and manage job openings.
              </p>
            </Link>
            <Link
              href="/recruiter/candidates"
              className="glass hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                🧑‍💼 Candidates
              </h3>
              <p className="text-sm text-gray-400">
                Explore and track candidate progress.
              </p>
            </Link>
          </motion.div>
        </section>
      </div>
    </RecruiterLayout>
  );
}
