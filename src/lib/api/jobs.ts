import { apiFetch } from "@/utils/api";

// Types based on API documentation
export interface JobResponse {
  jobId: number;
  employerNumber: string;
  organizationName: string;
  jobType: string;
  title: string;
  description: string;
  requiredSkills: string;
  postedDate: string;
  postedBy: string;
  billRate: number;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  region?: string;
  streetAddress?: string;
  industryNames: string[];
}

export interface JobListing {
  jobId: number;
  title: string;
  city: string;
  state: string;
  organizationName: string;
  postedDate: string;
  jobType?: string;
  description?: string;
  requiredSkills?: string;
  billRate?: number;
  durationMonths?: number;
  industryNames?: string[];
}

export interface JobListingPageResponse {
  jobs: JobListing[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateJobRequest {
  userId: string;
  jobType: string;
  title: string;
  description: string;
  requiredSkills: string;
  postedBy?: string;
  billRate: number;
  durationMonths: number;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  region?: string;
  streetAddress?: string;
  industryNames?: string[];
}

export interface UpdateJobRequest {
  jobType: string;
  title: string;
  description: string;
  requiredSkills: string;
  billRate: number;
  durationMonths: number;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  region?: string;
  streetAddress?: string;
  industryNames?: string[];
}

// Jobs API Services
export const jobsAPI = {
  // Get all jobs (for candidates)
  async getAllJobs(
    page: number = 0,
    size: number = 20,
    token: string
  ): Promise<JobListingPageResponse> {
    return apiFetch(`/api/jobs/v1/all?page=${page}&size=${size}`, {}, token);
  },

  // Get jobs by employer (for recruiters)
  async getJobsByEmployer(userId: string, token: string): Promise<JobResponse[]> {
    return apiFetch(`/api/jobs/v1/employer/${userId}`, {}, token);
  },

  // Create new job (for recruiters)
  async createJob(jobData: CreateJobRequest, token: string): Promise<JobResponse> {
    return apiFetch("/api/jobs/v1/post", {
      method: "POST",
      body: JSON.stringify(jobData),
    }, token);
  },

  // Update job (for recruiters)
  async updateJob(jobId: number, jobData: UpdateJobRequest, token: string): Promise<JobResponse> {
    return apiFetch(`/api/jobs/v1/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    }, token);
  },

  // Delete job (for recruiters)
  async deleteJob(jobId: number, userId: string, token: string): Promise<void> {
    return apiFetch(`/api/jobs/v1/${jobId}/${userId}`, {
      method: "DELETE",
    }, token);
  },
};
