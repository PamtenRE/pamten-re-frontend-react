"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import JobCard from "./JobCard";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";

interface SavedJobsSectionProps {
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  appliedJobs?: Set<string>;
}

export default function SavedJobsSection({
  onApply,
  onSave,
  appliedJobs = new Set(),
}: SavedJobsSectionProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load saved jobs from localStorage
  useEffect(() => {
    if (!user?.userId) return;

    const savedJobsKey = `saved_jobs_${user.userId}`;
    const saved = localStorage.getItem(savedJobsKey);

    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  }, [user?.userId]);

  // Fetch all jobs to get full job details for saved jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!isAuthenticated || !user?.userId) return;

      setLoading(true);

      try {
        // TODO: Uncomment when backend CORS is fixed
        // const data = await apiFetch("/api/jobs/v1/list", {}, token);
        // if (data && Array.isArray(data)) {
        //   setAllJobs(data);
        // }

        // TEMPORARY: Use mock data
        const mockJobs = [
          {
            jobId: "1",
            title: "Senior Software Engineer",
            organizationName: "TechCorp Inc.",
            city: "San Francisco",
            state: "CA",
            postedDate: "2024-01-15",
            salary: "$120,000 - $150,000",
            employmentType: "Full-time",
            jobType: "Full-time",
            requiredSkills: "React, Node.js, TypeScript, AWS",
          },
          {
            jobId: "2",
            title: "Frontend Developer",
            organizationName: "StartupXYZ",
            city: "New York",
            state: "NY",
            postedDate: "2024-01-14",
            salary: "$90,000 - $120,000",
            employmentType: "Full-time",
            jobType: "Full-time",
            requiredSkills: "React, JavaScript, CSS, HTML",
          },
          {
            jobId: "3",
            title: "Full Stack Developer",
            organizationName: "InnovateLab",
            city: "Austin",
            state: "TX",
            postedDate: "2024-01-13",
            salary: "$100,000 - $130,000",
            employmentType: "Full-time",
            jobType: "Full-time",
            requiredSkills: "React, Node.js, Python, PostgreSQL",
          },
          {
            jobId: "4",
            title: "DevOps Engineer",
            organizationName: "CloudTech",
            city: "Seattle",
            state: "WA",
            postedDate: "2024-01-12",
            salary: "$110,000 - $140,000",
            employmentType: "Full-time",
            jobType: "Full-time",
            requiredSkills: "AWS, Docker, Kubernetes, Terraform",
          },
          {
            jobId: "5",
            title: "Product Manager",
            organizationName: "GrowthCo",
            city: "Los Angeles",
            state: "CA",
            postedDate: "2024-01-11",
            salary: "$130,000 - $160,000",
            employmentType: "Full-time",
            jobType: "Full-time",
            requiredSkills: "Product Management, Analytics, Agile, SQL",
          },
        ];

        setAllJobs(mockJobs);
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated, user?.userId]);

  // Get saved jobs data
  const savedJobIds = Array.from(savedJobs);
  const savedJobsData = allJobs.filter((job) =>
    savedJobIds.includes(String(job.jobId))
  );

  // Show only first 3 saved jobs on dashboard
  const recentSavedJobs = savedJobsData.slice(0, 3);

  if (savedJobIds.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            Saved Jobs
          </h2>
        </div>

        <div className="text-center py-8">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Saved Jobs Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start browsing jobs and save the ones you're interested in.
          </p>
          <Link
            href="/candidate/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-600" />
          Saved Jobs
        </h2>
        <Link
          href="/candidate/saved-jobs"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-300">
            Loading saved jobs...
          </div>
        </div>
      ) : recentSavedJobs.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-300">
            No saved jobs found
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recentSavedJobs.map((job) => (
            <JobCard
              key={job.jobId}
              job={{
                jobId: job.jobId,
                title: job.title,
                organizationName: job.organizationName,
                city: job.city,
                state: job.state,
                postedDate: job.postedDate,
                salary: job.salary,
                employmentType: job.employmentType,
                tags: job.requiredSkills
                  ? job.requiredSkills
                      .split(",")
                      .map((skill: string) => skill.trim())
                  : [],
              }}
              onApply={onApply}
              onSave={onSave}
              isSaved={savedJobs.has(job.jobId)}
              isApplied={appliedJobs.has(job.jobId)}
            />
          ))}

          {savedJobIds.length > 3 && (
            <div className="text-center pt-4">
              <Link
                href="/candidate/saved-jobs"
                className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View {savedJobIds.length - 3} more saved jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
