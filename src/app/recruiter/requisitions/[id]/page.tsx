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
  Open: "bg-green-600/20 text-green-400 border-green-500/30",
  Closed: "bg-red-600/20 text-red-400 border-red-500/30",
  "In Review": "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  Published: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  draft: "bg-gray-600/20 text-gray-300 border-gray-400/30",
};

export default function RequisitionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, token } = useAuth();
  const [req, setReq] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch job (backend first, then localStorage fallback)
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
        <div className="flex flex-col justify-center items-center h-[70vh] text-gray-400">
          <AlertCircle size={24} className="mb-2 text-red-400" />
          {error || "Requisition not found."}
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <button
            onClick={() => router.push("/recruiter/requisitions")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back to Requisitions
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-1.5 text-sm rounded-lg hover:opacity-90 transition text-white"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {/* Card Layout */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-10 shadow-xl border border-white/10 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
                {req.title}
                {req.source === "local" && (
                  <span className="text-xs italic text-gray-400 font-normal">
                    (Unsynced — saved locally)
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
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
              className={`border px-3 py-1 rounded-full text-xs font-medium capitalize ${
                statusColors[req.status || "Open"]
              }`}
            >
              {req.status || "Open"}
            </div>
          </div>

          {/* Job Description (Now supports Quill formatting) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Job Description
            </h2>
            {req.description ? (
              <div
                className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: req.description }}
              />
            ) : (
              <p className="text-gray-400 italic">No description provided.</p>
            )}
          </section>

          {/* Compensation */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Compensation
            </h2>
            <p className="text-gray-300">
              {req.billRate
                ? `$${req.billRate} per hour`
                : req.payExact
                ? `$${req.payExact} ${req.rateUnit || ""}`
                : "Not specified"}
            </p>
            {req.durationMonths && (
              <p className="text-sm text-gray-400 mt-1">
                Duration: {req.durationMonths} month
                {req.durationMonths > 1 ? "s" : ""}
              </p>
            )}
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10 text-sm text-gray-500">
            Posted on {formatDate(req.postedDate)}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
