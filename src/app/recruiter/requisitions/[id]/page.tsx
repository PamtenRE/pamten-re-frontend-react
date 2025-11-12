"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/utils/api";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  Pencil,
  AlertCircle,
} from "lucide-react";

type Requisition = {
  jobId: number | string;
  title: string;
  organizationName?: string;
  jobType?: string;
  city?: string;
  state?: string;
  description?: string;
  billRate?: number;
  durationMonths?: number;
  postedDate?: string;
  status?: "Open" | "Closed" | "In Review" | "Published" | "draft";
  company?: string;
  category?: string;
  location?: string;
  locationType?: string;
  employmentType?: string;
  payExact?: number;
  rateUnit?: string;
  source?: "backend" | "local";
};

const statusColors: Record<string, string> = {
  Open: "bg-green-100 text-green-700 border-green-200 dark:bg-green-600/20 dark:text-green-400 dark:border-green-500/30",
  Closed:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-600/20 dark:text-red-400 dark:border-red-500/30",
  "In Review":
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-400/30",
  Published:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30",
  draft:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-600/20 dark:text-gray-300 dark:border-gray-400/30",
};

export default function RequisitionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, token } = useAuth();
  const [req, setReq] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        let found: Requisition | undefined;

        if (user && token) {
          try {
            const data: Requisition[] = await apiFetch(
              `/api/jobs/v1/employer/${user.userId}`,
              {},
              token
            );
            found = data.find((j) => String(j.jobId) === String(id));
            if (found) {
              setReq({ ...found, source: "backend" });
              setLoading(false);
              return;
            }
          } catch {
            console.warn("Backend fetch failed, trying local...");
          }
        }

        const localJobs: Requisition[] = JSON.parse(
          localStorage.getItem("localRequisitions") || "[]"
        );
        const foundLocal = localJobs.find(
          (job) => String(job.id) === String(id)
        );

        if (foundLocal) {
          setReq({ ...foundLocal, source: "local" });
        } else {
          setError("Requisition not found.");
        }
      } catch {
        setError("Failed to load requisition details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user, token]);

  const handleEdit = () => {
    router.push(`/recruiter/requisitions/${id}/edit`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex justify-center items-center h-[70vh] text-gray-400">
          Loading requisition...
        </div>
      </RecruiterLayout>
    );
  }

  if (error || !req) {
    return (
      <RecruiterLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] text-gray-500 dark:text-gray-400">
          <AlertCircle size={24} className="mb-2 text-red-400" />
          {error || "Requisition not found."}
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div
        className="min-h-screen px-6 md:px-10 py-8 transition-colors duration-700
          bg-gradient-to-br from-indigo-50 via-white to-purple-50 
          dark:from-[#0a0118] dark:via-[#12072c] dark:to-[#0a0a23]"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <button
            onClick={() => router.push("/recruiter/requisitions")}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            <ArrowLeft size={16} /> Back to Requisitions
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm rounded-lg hover:opacity-90 transition text-white shadow-md"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {/* Card */}
        <div
          className="relative p-10 rounded-3xl border border-white/40 dark:border-white/10 
          bg-gradient-to-br from-white via-white to-gray-50
          dark:from-[#0f0f1a]/60 dark:via-[#101020]/60 dark:to-[#0a0a18]/60
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]
          backdrop-blur-2xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 animate-[pulse_6s_infinite] -z-10" />

          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                {req.title}
                {req.source === "local" && (
                  <span className="text-xs italic text-gray-500 font-normal">
                    (Unsynced — saved locally)
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Building2 size={14} />{" "}
                  {req.organizationName || req.company || "—"}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />{" "}
                  {req.jobType || req.employmentType || "—"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />{" "}
                  {req.location ||
                    [req.city, req.state].filter(Boolean).join(", ") ||
                    "Remote"}
                </span>
              </div>
            </div>

            <div
              className={`border px-3 py-1 rounded-full text-xs font-medium capitalize self-start ${
                statusColors[req.status || "Open"]
              }`}
            >
              {req.status || "Open"}
            </div>
          </div>

          {/* Job Description */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Job Description
            </h2>
            {req.description ? (
              <div
                className="prose max-w-none text-gray-700 dark:prose-invert dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: req.description }}
              />
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </section>

          {/* Compensation */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Compensation
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {req.billRate
                ? `$${req.billRate} per hour`
                : req.payExact
                ? `$${req.payExact} ${req.rateUnit || ""}`
                : "Not specified"}
            </p>
            {req.durationMonths && (
              <p className="text-sm text-gray-500 mt-1">
                Duration: {req.durationMonths} month
                {req.durationMonths > 1 ? "s" : ""}
              </p>
            )}
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 mt-8">
            Posted on {formatDate(req.postedDate)}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
