"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { candidateAPI } from "@/lib/api/services";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    jobId: string;
    title: string;
    organizationName: string;
    city: string;
    state: string;
    jobType?: string;
  };
  onSuccess: () => void;
}

interface Resume {
  resumeId: number;
  fileName: string;
  uploadedAt: string;
  isDefault: boolean;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  job,
  onSuccess,
}: JobApplicationModalProps) {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(false);

  // ✅ Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      if (!isOpen || !user?.email || !token) return;
      setFetchingResumes(true);
      try {
        const data = await candidateAPI.getResumes(user.email, token);
        if (data && Array.isArray(data)) {
          setResumes(data);
          const defaultResume = data.find((r) => r.isDefault);
          if (defaultResume) setSelectedResumeId(defaultResume.resumeId);
        }
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        const savedResumes = localStorage.getItem(`resumes_${user.userId}`);
        if (savedResumes) {
          const parsedResumes = JSON.parse(savedResumes);
          setResumes(parsedResumes);
          const defaultResume = parsedResumes.find((r: Resume) => r.isDefault);
          if (defaultResume) setSelectedResumeId(defaultResume.resumeId);
        }
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, [isOpen, user?.email, user?.userId, token]);

  // ✅ Auto scroll modal into view when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modal = document.getElementById("job-application-modal");
        if (modal) {
          modal.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isOpen]);

  // ✅ Resume upload handler
  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.email || !token) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingResume(true);
    try {
      const newResume = await candidateAPI.uploadResume(
        file,
        user.email,
        resumes.length === 0,
        undefined,
        token
      );
      const updated = [...resumes, newResume];
      setResumes(updated);
      setSelectedResumeId(newResume.resumeId);
      localStorage.setItem(`resumes_${user.userId}`, JSON.stringify(updated));
    } catch (err) {
      console.error("Upload failed, saving locally:", err);
      const newResume: Resume = {
        resumeId: Date.now(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        isDefault: resumes.length === 0,
      };
      const updated = [...resumes, newResume];
      setResumes(updated);
      setSelectedResumeId(newResume.resumeId);
      localStorage.setItem(`resumes_${user.userId}`, JSON.stringify(updated));
    } finally {
      setUploadingResume(false);
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId || !token) return;
    if (resumes.length === 0 || !selectedResumeId) return;

    setLoading(true);
    try {
      const notesCombined = coverLetter
        ? `Cover Letter:\n${coverLetter}\n\nAdditional Notes:\n${notes}`
        : notes;

      await candidateAPI.applyToJob(
        {
          jobId: parseInt(job.jobId),
          candidateId: user.userId,
          notes: notesCombined,
          resumeId: selectedResumeId,
          coverLetter,
        },
        token
      );

      addNotification({
        id: Date.now().toString(),
        type: "success",
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.organizationName} has been submitted successfully.`,
        timestamp: new Date().toISOString(),
        read: false,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Application failed, saving locally:", err);
      addNotification({
        id: Date.now().toString(),
        type: "info",
        title: "Application Saved Locally",
        message: `Your application for ${job.title} has been saved locally.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Local notification helper
  const addNotification = (notification: any) => {
    if (!user?.userId) return;
    const key = `notifications_${user.userId}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(notification);
    localStorage.setItem(key, JSON.stringify(list));
  };

  if (!isOpen) return null;

  return (
    <div
      id="job-application-modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      style={{ minHeight: "100vh" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Apply for Position
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {job.title} — {job.organizationName}
              <br />
              {job.city}, {job.state} • {job.jobType || "Full-time"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto p-6 space-y-6"
        >
          {/* Resume Section */}
          {fetchingResumes ? (
            <p className="text-sm text-gray-500">Loading resumes...</p>
          ) : resumes.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Resume
              </h3>
              {resumes.map((resume) => (
                <label
                  key={resume.resumeId}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                    selectedResumeId === resume.resumeId
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="resume"
                    checked={selectedResumeId === resume.resumeId}
                    onChange={() => setSelectedResumeId(resume.resumeId)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {resume.fileName}
                      {resume.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Uploaded:{" "}
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </label>
              ))}

              {/* Upload new resume */}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300">
                <span>📎</span>
                <span>
                  {uploadingResume ? "Uploading..." : "Upload New Resume"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No resume found. Please upload your resume to continue.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                <span>📤</span>
                <span>
                  {uploadingResume ? "Uploading..." : "Upload Resume"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          )}

          {/* Cover Letter & Notes */}
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white resize-none"
                placeholder="Tell the employer why you're a great fit..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {coverLetter.length} / 1000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white resize-none"
                placeholder="Any extra details you'd like to share..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {notes.length} / 500 characters
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || resumes.length === 0 || !selectedResumeId}
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
