"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RequisitionCard from "@/components/recruiter/RequisitionCard";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  const [requisitions, setRequisitions] = useState<RequisitionCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!hydrated || !isAuthenticated || !token) return;
      setLoading(true);
      setError(null);

      try {
        if (!user || !token) return;
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

  if (!hydrated) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <RecruiterLayout>
      <div
        className="p-8 space-y-10 min-h-screen transition-colors duration-700 
        bg-gradient-to-br from-indigo-50 via-white to-purple-50 
        dark:from-[#0a0118] dark:via-[#12072c] dark:to-[#0a0a23]"
      >
        {/* ========= HEADER ========= */}
        <div className="flex justify-between items-center relative">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 
            text-transparent bg-clip-text tracking-tight leading-tight"
          >
            Requisitions
          </motion.h1>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/recruiter/requisitions/new"
              className="relative px-6 py-2.5 rounded-xl font-semibold text-white 
                bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 
                shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] 
                transition-all duration-300 overflow-hidden"
            >
              + New Requisition
            </Link>
          </motion.div>
        </div>

        {/* ========= ANALYTICS SECTION ========= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col md:flex-row justify-between items-start p-10 rounded-3xl border
            bg-gradient-to-br from-[#1e0b43] via-[#2b0f5a] to-[#0a0a2a]
            border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl
            text-white space-y-10 md:space-y-0 md:space-x-10 overflow-hidden"
        >
          {/* Soft animated shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-500/10 to-purple-400/10 animate-[pulse_6s_infinite]" />
          {/* LEFT SIDE – INSIGHTS */}
          <div className="w-full md:w-2/3 space-y-6 relative z-10">
            <h2 className="text-lg font-medium text-gray-300">
              Total Requisitions
              <span className="ml-2 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                {total}
              </span>
            </h2>

            {/* Summary Cards – 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              {[
                {
                  label: "Active Jobs",
                  value: openCount,
                  color: "text-green-400",
                  bg: "from-green-500/20 to-green-500/10",
                },
                {
                  label: "In Review",
                  value: inReviewCount,
                  color: "text-yellow-400",
                  bg: "from-yellow-500/20 to-yellow-500/10",
                },
                {
                  label: "Closed",
                  value: closedCount,
                  color: "text-red-400",
                  bg: "from-red-500/20 to-red-500/10",
                },
                {
                  label: "Draft",
                  value: draftCount,
                  color: "text-purple-400",
                  bg: "from-purple-500/20 to-purple-500/10",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl 
                    bg-gradient-to-br ${item.bg} border border-white/10 
                    hover:bg-white/15 transition-all duration-300 
                    shadow-inner hover:shadow-[0_0_25px_rgba(147,51,234,0.25)]`}
                >
                  <p className="text-gray-300 mb-1 font-medium">{item.label}</p>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`text-3xl font-semibold ${item.color}`}
                  >
                    {item.value}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>{" "}
          {/* ✅ closing LEFT section div */}
          {/* RIGHT SIDE – CHART */}
          <div className="w-full md:w-1/3 flex flex-col items-center mt-4 md:mt-0 relative z-10">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">
              Job Status Overview
            </h3>

            {/* Donut Chart */}
            <div className="relative w-48 h-48 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={70}
                    strokeWidth={3}
                    paddingAngle={2}
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(255,255,255,0.15)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30,30,50,0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {total}
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="w-full mt-6 space-y-3 px-3">
              {[
                { label: "Open", color: "bg-green-500", count: openCount },
                {
                  label: "In Review",
                  color: "bg-yellow-400",
                  count: inReviewCount,
                },
                { label: "Closed", color: "bg-red-500", count: closedCount },
                { label: "Draft", color: "bg-purple-500", count: draftCount },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                      />
                      {item.label}
                    </span>
                    <span>
                      {total ? ((item.count / total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{
                        width: `${total ? (item.count / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ========= FILTER BUTTONS & JOB CARDS ========= */}
        <div className="flex gap-3 flex-wrap pt-2 pb-4">
          {statuses.map((s) => (
            <motion.button
              key={s}
              onClick={() => setFilter(s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-1.5 rounded-full text-sm font-medium border transition-all duration-500
              ${
                filter === s
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]"
                  : "bg-white/80 text-gray-700 border-gray-200 hover:bg-white/90 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-gray-400">Loading requisitions...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">No requisitions found.</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          >
            {filtered.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 0 30px rgba(147,51,234,0.15), 0 4px 12px rgba(0,0,0,0.05)",
                }}
                className="rounded-2xl overflow-hidden border bg-white/80 backdrop-blur-xl hover:border-purple-400/50 
                shadow-sm hover:shadow-xl transition-all duration-500
                dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1e0b43] dark:via-[#2b0f5a] dark:to-[#0a0a2a]"
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
