"use client";

import { useState, useEffect } from "react";
import RequisitionCard from "@/components/recruiter/RequisitionCard";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

type RequisitionStatus = "Open" | "In Review" | "Closed" | "draft";

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

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#a855f7"];
const statuses = ["All", "Open", "Closed", "In Review", "draft"];

export default function RequisitionListPage() {
  const [filter, setFilter] = useState("All");
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [requisitions, setRequisitions] = useState<RequisitionCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated && user?.role?.toLowerCase() === "recruiter") return;

    const message = !isAuthenticated
      ? "Please sign in to access recruiter requisitions."
      : "Only recruiter accounts can access this page.";
    setAccessDenied(message);
    const t = setTimeout(() => {
      router.replace(!isAuthenticated ? "/login" : "/");
    }, 1000);
    return () => clearTimeout(t);
  }, [hydrated, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (
        !hydrated ||
        !isAuthenticated ||
        !token ||
        user?.role?.toLowerCase() !== "recruiter"
      )
        return;

      setLoading(true);
      setError(null);

      try {
        const backendData: BackendJob[] = await apiFetch(
          `/api/jobs/v1/employer/${user.userId}`,
          {},
          token
        );

        const backendMapped: RequisitionCardData[] = (backendData || []).map(
          (job) => ({
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
          })
        );

        const localJobs: RequisitionCardData[] = JSON.parse(
          localStorage.getItem("localRequisitions") || "[]"
        ).map((job: any) => ({
          id: job.id,
          title: job.title,
          location: job.location || "—",
          postedDate: job.postedDate || "—",
          status: (job.status as RequisitionStatus) || "draft",
          applicants: 0,
        }));

        const merged = [
          ...backendMapped,
          ...localJobs.filter(
            (lj) =>
              !backendMapped.some(
                (bj) => bj.id === lj.id || bj.title === lj.title
              )
          ),
        ];

        setRequisitions(merged);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to load requisitions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [hydrated, isAuthenticated, token, user]);

  if (!hydrated) return <div className="p-6 text-white">Loading...</div>;

  if (!isAuthenticated || user?.role?.toLowerCase() !== "recruiter") {
    return (
      <div className="p-6 text-gray-400">
        {accessDenied || "Redirecting..."}
      </div>
    );
  }

  const filtered =
    filter === "All"
      ? requisitions
      : requisitions.filter(
          (job) => job.status === (filter as RequisitionStatus)
        );

  const openCount = requisitions.filter((r) => r.status === "Open").length;
  const inReviewCount = requisitions.filter(
    (r) => r.status === "In Review"
  ).length;
  const closedCount = requisitions.filter((r) => r.status === "Closed").length;
  const draftCount = requisitions.filter((r) => r.status === "draft").length;
  const total = requisitions.length;

  const pieData = [
    { name: "Open", value: openCount },
    { name: "In Review", value: inReviewCount },
    { name: "Closed", value: closedCount },
    { name: "Draft", value: draftCount },
  ];

  return (
    <RecruiterLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Requisitions
          </h1>
          <Link
            href="/recruiter/requisitions/new"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all duration-300"
          >
            + New Requisition
          </Link>
        </div>

        {/* Summary Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col md:flex-row justify-between items-center p-8 rounded-2xl border border-white/10 
                     bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-lg"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Total Jobs: <span className="text-purple-400">{total}</span>
            </h2>
            <div className="space-x-6 text-gray-300 text-sm">
              <span>
                Open: <b className="text-green-400">{openCount}</b>
              </span>
              <span>
                In Review: <b className="text-yellow-400">{inReviewCount}</b>
              </span>
              <span>
                Closed: <b className="text-red-400">{closedCount}</b>
              </span>
              <span>
                Draft: <b className="text-purple-400">{draftCount}</b>
              </span>
            </div>
          </div>

          <div className="w-36 h-36 mt-6 md:mt-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={60}
                  paddingAngle={3}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10"></div>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 
              ${
                filter === s
                  ? "bg-white text-black shadow-md"
                  : "bg-white/5 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-gray-400">Loading requisitions...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">No requisitions found.</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <RequisitionCard {...req} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
}
