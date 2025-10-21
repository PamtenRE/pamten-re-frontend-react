"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import EditJobForm from "@/components/recruiter/EditJobForm";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";

type Requisition = {
  jobId?: number | string;
  id?: number | string;
  title: string;
  organizationName?: string;
  company?: string;
  jobType?: string;
  employmentType?: string;
  category?: string;
  city?: string;
  state?: string;
  location?: string;
  description?: string;
  billRate?: number;
  payExact?: number;
  rateUnit?: string;
  durationMonths?: number;
  status?: "Open" | "Closed" | "In Review" | "Published" | "draft";
  postedDate?: string;
  source?: "backend" | "local";
};

export default function EditRequisitionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [req, setReq] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Requisition["status"]>("draft");

  // ✅ Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        let found: Requisition | undefined;

        // Try backend first
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
              setStatus(found.status || "draft");
              setLoading(false);
              return;
            }
          } catch {
            console.warn("Backend fetch failed — checking local storage...");
          }
        }

        // Fallback to local storage
        const localJobs: Requisition[] = JSON.parse(
          localStorage.getItem("localRequisitions") || "[]"
        );
        const foundLocal = localJobs.find(
          (job) => String(job.id) === String(id)
        );

        if (foundLocal) {
          setReq({ ...foundLocal, source: "local" });
          setStatus(foundLocal.status || "draft");
        } else {
          setError("Requisition not found.");
        }
      } catch {
        setError("Failed to load requisition for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user, token]);

  // ✅ Handle updates
  const handleUpdate = async (updatedData: Partial<Requisition>) => {
    if (!req) return;
    try {
      if (req.source === "backend") {
        await apiFetch(
          `/api/jobs/v1/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({ ...updatedData, status }),
          },
          token
        );
        alert("✅ Job updated successfully!");
      } else {
        const saved = JSON.parse(
          localStorage.getItem("localRequisitions") || "[]"
        );
        const updated = saved.map((job: any) =>
          String(job.id) === String(id)
            ? { ...job, ...updatedData, status }
            : job
        );
        localStorage.setItem("localRequisitions", JSON.stringify(updated));
        alert("✅ Local draft updated!");
      }
      router.push("/recruiter/requisitions");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update job. Please try again.");
    }
  };

  // 🗑️ Handle Delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this requisition?")) return;
    try {
      if (req?.source === "backend" && token) {
        await apiFetch(`/api/jobs/v1/${id}`, { method: "DELETE" }, token);
      } else {
        const saved = JSON.parse(
          localStorage.getItem("localRequisitions") || "[]"
        );
        const updated = saved.filter(
          (job: any) => String(job.id) !== String(id)
        );
        localStorage.setItem("localRequisitions", JSON.stringify(updated));
      }
      alert("🗑️ Requisition deleted successfully.");
      router.push("/recruiter/requisitions");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete requisition.");
    }
  };

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex justify-center items-center h-[70vh] text-gray-400">
          Loading requisition for editing...
        </div>
      </RecruiterLayout>
    );
  }

  if (error || !req) {
    return (
      <RecruiterLayout>
        <div className="flex justify-center items-center h-[70vh] text-gray-400">
          {error || "Requisition not found."}
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto text-white">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Edit Requisition — {req.title}
              {req.source === "local" && (
                <span className="ml-2 text-xs text-gray-400 italic">
                  (Local Draft)
                </span>
              )}
            </h1>
          </div>

          {/* Status + Delete */}
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Requisition["status"])
              }
              className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* === EDIT FORM === */}
        <EditJobForm existingData={req} onSubmit={handleUpdate} />
      </div>
    </RecruiterLayout>
  );
}
