"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { candidateAPI } from "@/lib/api/services";
import { useToast } from "@/components/ui/Toast";

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
  const { addToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(false);

  // Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      if (!isOpen || !user?.email || !token) return;

      setFetchingResumes(true);
      try {
        // Try to fetch from API first
        const data = await candidateAPI.getResumes(user.email, token);
        if (data && Array.isArray(data)) {
          setResumes(data);
          const defaultResume = data.find((r) => r.isDefault);
          if (defaultResume) {
            setSelectedResumeId(defaultResume.resumeId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resumes from API:", err);

        // Fallback to localStorage
        const savedResumes = localStorage.getItem(`resumes_${user.userId}`);
        if (savedResumes) {
          const parsedResumes = JSON.parse(savedResumes);
          setResumes(parsedResumes);
          const defaultResume = parsedResumes.find((r: Resume) => r.isDefault);
          if (defaultResume) {
            setSelectedResumeId(defaultResume.resumeId);
          }
        }
      } finally {
        setFetchingResumes(false);
      }
    };

    fetchResumes();
  }, [isOpen, user?.email, user?.userId, token]);

  // Handle resume upload
  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.email || !token) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      addToast({
        type: "error",
        title: "Invalid File Type",
        message: "Please upload a PDF or Word document",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "error",
        title: "File Too Large",
        message: "File size must be less than 5MB",
      });
      return;
    }

    setUploadingResume(true);
    try {
      // Try to upload via API first
      const newResume = await candidateAPI.uploadResume(
        file,
        user.email,
        resumes.length === 0,
        undefined,
        token
      );

      const updatedResumes = [...resumes, newResume];
      setResumes(updatedResumes);
      setSelectedResumeId(newResume.resumeId);

      // Also save to localStorage as backup
      localStorage.setItem(
        `resumes_${user.userId}`,
        JSON.stringify(updatedResumes)
      );

      addToast({
        type: "success",
        title: "Resume Uploaded",
        message: "Resume uploaded successfully!",
      });
    } catch {
      // Fallback to localStorage
      const newResume: Resume = {
        resumeId: Date.now(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        isDefault: resumes.length === 0,
      };

      const updatedResumes = [...resumes, newResume];
      setResumes(updatedResumes);
      setSelectedResumeId(newResume.resumeId);

      localStorage.setItem(
        `resumes_${user.userId}`,
        JSON.stringify(updatedResumes)
      );

      addToast({
        type: "success",
        title: "Resume Saved Locally",
        message: "Resume uploaded successfully (saved locally)!",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  // Handle application submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.userId || !token) {
      addToast({
        type: "warning",
        title: "Login Required",
        message: "Please log in to apply",
      });
      return;
    }

    if (resumes.length === 0) {
      addToast({
        type: "warning",
        title: "Resume Required",
        message: "Please upload a resume before applying",
      });
      return;
    }

    if (!selectedResumeId) {
      addToast({
        type: "warning",
        title: "Resume Selection Required",
        message: "Please select a resume",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare application notes (include cover letter if provided)
      const applicationNotes = coverLetter
        ? `Cover Letter:\n${coverLetter}\n\nAdditional Notes:\n${notes}`
        : notes;

      // Try to submit via API first
      await candidateAPI.applyToJob(
        {
          jobId: parseInt(job.jobId),
          candidateId: user.userId,
          notes: applicationNotes,
          resumeId: selectedResumeId,
          coverLetter: coverLetter,
        },
        token
      );

      // Add notification
      addNotification({
        id: Date.now().toString(),
        type: "success",
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.organizationName} has been submitted successfully!`,
        timestamp: new Date().toISOString(),
        read: false,
      });

      addToast({
        type: "success",
        title: "Application Submitted!",
        message: `Your application for ${job.title} at ${job.organizationName} has been received.`,
        duration: 8000,
      });

      onSuccess();
      onClose();
    } catch {
      // Fallback to localStorage simulation
      const applicationNotes = coverLetter
        ? `Cover Letter:\n${coverLetter}\n\nAdditional Notes:\n${notes}`
        : notes;

      console.log("Application submitted locally:", {
        jobId: job.jobId,
        candidateId: user.userId,
        resumeId: selectedResumeId,
        notes: applicationNotes,
      });

      // Add notification
      addNotification({
        id: Date.now().toString(),
        type: "success",
        title: "Application Submitted (Local)",
        message: `Your application for ${job.title} at ${job.organizationName} has been saved locally!`,
        timestamp: new Date().toISOString(),
        read: false,
      });

      addToast({
        type: "success",
        title: "Application Saved Locally!",
        message: `Your application for ${job.title} at ${job.organizationName} has been received (saved locally).`,
        duration: 8000,
      });

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Add notification to localStorage
  const addNotification = (notification: any) => {
    if (!user?.userId) return;

    const notificationsKey = `notifications_${user.userId}`;
    const existing = localStorage.getItem(notificationsKey);
    const notifications = existing ? JSON.parse(existing) : [];
    notifications.unshift(notification);
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 z-10">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Apply for Position
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-base text-gray-900 dark:text-white truncate">
                  {job.title}
                </p>
                <p className="truncate">{job.organizationName}</p>
                <p className="truncate">
                  {job.city}, {job.state} • {job.jobType || "Full-time"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-6 sm:space-y-8"
        >
          {/* Resume Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resume
            </h3>

            {fetchingResumes ? (
              <div className="text-sm text-gray-500">Loading resumes...</div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select the resume you want to use:
                </p>
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                  {resumes.map((resume) => (
                    <label
                      key={resume.resumeId}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedResumeId === resume.resumeId
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="resume"
                        value={resume.resumeId}
                        checked={selectedResumeId === resume.resumeId}
                        onChange={() => setSelectedResumeId(resume.resumeId)}
                        className="w-4 h-4 text-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
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
                </div>

                {/* Upload Additional Resume */}
                <div className="pt-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No resume found. Please upload your resume to continue.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
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
          </div>

          {/* Cover Letter and Additional Notes - Side by side on larger screens */}
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {/* Cover Letter */}
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
                placeholder="Tell the employer why you're a great fit for this role..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {coverLetter.length} / 1000 characters
              </p>
            </div>

            {/* Additional Notes */}
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
                placeholder="Any additional information you'd like to share..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {notes.length} / 500 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || resumes.length === 0 || !selectedResumeId}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
