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

const USE_BACKEND = false;

// ✅ Animated Counter
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

  // Hydration
  useEffect(() => setHydrated(true), []);

  // Redirect unauthorized users
  useEffect(() => {
    if (!hydrated) return;
    if (user === undefined) return;
    if (!user) {
      setAccessDenied("Please sign in to access recruiter dashboard.");
      router.push("/login");
    } else if (user.role?.toLowerCase() !== "recruiter") {
      setAccessDenied("Only recruiter accounts can access this page.");
      router.push("/");
    }
  }, [user, hydrated, router]);

  // Fetch jobs (local or backend)
  useEffect(() => {
    const fetchJobs = async () => {
      if (!hydrated) return;
      setLoading(true);
      setError(null);

      try {
        if (USE_BACKEND && user && token) {
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

          setJobs(mapped.slice(0, 3));
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [hydrated, user, token]);

  if (!hydrated || user === undefined)
    return (
      <div className="p-6 text-[var(--text-secondary)]">Loading dashboard…</div>
    );

  if (!user || user.role?.toLowerCase() !== "recruiter")
    return (
      <div className="p-6 text-sm text-[var(--text-secondary)]">
        {accessDenied || "Redirecting..."}
      </div>
    );

  return (
    <RecruiterLayout>
      <div className="relative min-h-screen">
        {/* Backgrounds */}
        <div className="absolute -z-10 inset-0 bg-[var(--bg-primary)] transition-colors duration-500"></div>
        <div className="absolute -z-10 top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 dark:opacity-20 dark:blur-3xl"></div>

        <section className="space-y-10 p-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass p-6 rounded-2xl relative overflow-hidden border border-[var(--border-soft)] shadow-[var(--shadow-soft)]"
          >
            <h1
              className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 
                          text-transparent bg-clip-text tracking-tight leading-tight"
            >
              Welcome,{" "}
              {user?.firstName
                ? user.firstName
                : user?.email
                ? user.email.split("@")[0]
                : "Recruiter"}
            </h1>

            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Manage your hiring pipeline, review candidates, and track your
              recruitment activity efficiently.
            </p>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[var(--accent-from)] via-[var(--accent-to)] to-teal-400 animate-pulse"></div>
          </motion.div>

          {/* Create Job Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] 
             p-6 md:p-8 text-white flex flex-col md:flex-row items-center 
             justify-between shadow-[var(--shadow-soft)] transition-all"
          >
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

            <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-8 flex justify-center">
              <motion.img
                src="/recruiter-banner.svg"
                alt="Hiring Illustration"
                className="w-44 md:w-56 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                animate={{
                  y: [0, -8, 0], // gentle float up/down
                  filter: [
                    "drop-shadow(0 0 10px rgba(147,51,234,0.3))",
                    "drop-shadow(0 0 25px rgba(147,51,234,0.5))",
                    "drop-shadow(0 0 10px rgba(147,51,234,0.3))",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: [0, 2, -2, 0],
                  transition: { duration: 0.6 },
                }}
              />
            </div>
          </motion.div>

          {/* KPI Cards – Enhanced Light + Dark Mode Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Candidates in Pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl 
    bg-gradient-to-br from-[#f9f5ff] via-[#f3ebff] to-white dark:from-[#1a1625] dark:to-[#221b33]
    border border-[#e4d9ff]/70 dark:border-zinc-800
    shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(159,110,255,0.15)]
    hover:shadow-[0_8px_30px_rgba(159,110,255,0.15)]
    transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Candidates in Pipeline
                </span>
                <Users size={22} className="text-[#9f6eff]" />
              </div>
              <h2 className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#9f6eff] to-[#6e49ff] bg-clip-text text-transparent">
                <CountUp end={55} />
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Active this week
              </p>
            </motion.div>

            {/* Open Requisitions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl 
    bg-gradient-to-br from-[#fff7eb] via-[#fff1df] to-white dark:from-[#1f1a14] dark:to-[#2b2319]
    border border-[#ffe1b3]/60 dark:border-zinc-800
    shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,145,77,0.15)]
    hover:shadow-[0_8px_30px_rgba(255,145,77,0.15)]
    transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Open Requisitions
                </span>
                <ClipboardList size={22} className="text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                <CountUp end={jobs.length} />
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                This month
              </p>
            </motion.div>

            {/* Interviews Scheduled */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl 
    bg-gradient-to-br from-[#eef7ff] via-[#e3f2ff] to-white dark:from-[#141a22] dark:to-[#1c2430]
    border border-[#cce5ff]/60 dark:border-zinc-800
    shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(110,169,255,0.15)]
    hover:shadow-[0_8px_30px_rgba(110,169,255,0.15)]
    transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Interviews Scheduled
                </span>
                <CalendarCheck size={22} className="text-sky-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                <CountUp end={9} />
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Upcoming interviews
              </p>
            </motion.div>
          </div>

          {/* Your Posted Jobs */}
          {/* Job Management – Premium Gradient Version */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-2xl 
  border border-[var(--border-soft)]
  bg-gradient-to-br from-[#f8f5ff] via-[#f4ecff] to-white 
  dark:from-[#151320] dark:via-[#1b1625] dark:to-[#171422]
  shadow-[0_6px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_0_25px_rgba(159,110,255,0.15)]
  backdrop-blur-xl transition-all duration-500"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Your Posted Jobs
              </h2>
              <Link
                href="/recruiter/requisitions"
                className="text-sm font-medium text-[#9f6eff] hover:text-[#7b4fff] transition-all"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="text-center text-[var(--text-secondary)]">
                Loading jobs...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-[var(--text-secondary)]">
                No jobs posted yet.
              </div>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job: any, index: number) => (
                  <motion.li
                    key={job.jobId || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-xl 
          border border-[var(--border-soft)]
          bg-gradient-to-br from-white to-[#faf6ff] 
          dark:from-[#1b1824] dark:to-[#201a2b]
          shadow-[0_3px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(159,110,255,0.1)]
          hover:shadow-[0_8px_25px_rgba(159,110,255,0.15)]
          hover:scale-[1.01] transition-all duration-300"
                  >
                    <div className="flex justify-between flex-wrap items-center">
                      <div>
                        <div className="font-semibold text-lg text-[var(--text-primary)]">
                          {job.title}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {[
                            job.organizationName || job.company,
                            job.city && job.state
                              ? `${job.city}, ${job.state}`
                              : job.location,
                            job.employmentType &&
                              job.employmentType.charAt(0).toUpperCase() +
                                job.employmentType.slice(1),
                          ]
                            .filter(Boolean)
                            .join(" • ") || "Details unavailable"}
                        </div>

                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Posted:{" "}
                          {job.postedDate ? job.postedDate.split("T")[0] : "—"}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/recruiter/applications/${job.jobId}`}
                          className="px-3 py-1.5 text-xs 
                bg-[#9f6eff]/10 text-[#9f6eff]
                rounded-md hover:bg-[#9f6eff]/20 
                font-medium transition-all"
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

          {/* Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          >
            <Link
              href="/recruiter/applications"
              className="glass hover:scale-[1.02] hover:shadow-[var(--shadow-soft)] transition-all duration-300 p-6 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)]"
            >
              <h3 className="text-xl font-semibold mb-2">📄 Applications</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Review applicants and manage job openings.
              </p>
            </Link>
            <Link
              href="/recruiter/candidates"
              className="glass hover:scale-[1.02] hover:shadow-[var(--shadow-soft)] transition-all duration-300 p-6 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)]"
            >
              <h3 className="text-xl font-semibold mb-2">🧑‍💼 Candidates</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Explore and track candidate progress.
              </p>
            </Link>
          </motion.div>
        </section>
      </div>
    </RecruiterLayout>
  );
}
