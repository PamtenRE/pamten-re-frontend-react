import { apiFetch } from "@/utils/api";

// Types based on API documentation
export interface Gender {
  genderId: number;
  genderName: string;
}

export interface Industry {
  industryId: number;
  industryName: string;
  description: string;
}

export interface CandidateProfile {
  candidateId: number;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  experienceYears: number;
  linkedinUrl: string;
  githubUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  resumeId: number;
  fileName: string;
  uploadedAt: string;
  isDefault: boolean;
}

export interface JobApplication {
  applicationId: number;
  jobId: number;
  candidateId: string;
  status: string;
  appliedDate: string;
  notes?: string;
  resumeId?: number;
  coverLetter?: string;
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

// Candidate API Services
export const candidateAPI = {
  // Profile Management
  async createOrUpdateProfile(profileData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    genderId: number;
    experienceYears?: number;
    linkedinUrl?: string;
    githubUsername?: string;
  }, token: string): Promise<CandidateProfile> {
    return apiFetch("/api/candidate/v1/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    }, token);
  },

  // Resume Management
  async uploadResume(
    file: File,
    email: string,
    setAsDefault: boolean = true,
    customName?: string,
    token?: string
  ): Promise<Resume> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("setAsDefault", setAsDefault.toString());
    if (customName) {
      formData.append("customName", customName);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/candidate/resumes/v1/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload resume");
    }

    return response.json();
  },

  async getResumes(email: string, token: string): Promise<Resume[]> {
    return apiFetch(`/api/candidate/resumes/v1/candidate?email=${email}`, {}, token);
  },

  async deleteResume(resumeId: number, email: string, token: string): Promise<void> {
    return apiFetch(`/api/candidate/resumes/v1/${resumeId}?email=${email}`, {
      method: "DELETE",
    }, token);
  },

  async setDefaultResume(resumeId: number, email: string, token: string): Promise<void> {
    return apiFetch(`/api/candidate/resumes/v1/${resumeId}/default?email=${email}`, {
      method: "PUT",
    }, token);
  },

  // Job Applications
  async applyToJob(applicationData: {
    jobId: number;
    candidateId: string;
    notes?: string;
    resumeId?: number;
    coverLetter?: string;
  }, token: string): Promise<JobApplication> {
    return apiFetch("/api/applications/v1/apply", {
      method: "POST",
      body: JSON.stringify(applicationData),
    }, token);
  },

  async getApplications(candidateId: string, token: string): Promise<JobApplication[]> {
    return apiFetch(`/api/applications/v1/candidate/${candidateId}`, {}, token);
  },

  async withdrawApplication(applicationId: number, candidateId: string, token: string): Promise<void> {
    return apiFetch(`/api/applications/v1/${applicationId}?candidateId=${candidateId}`, {
      method: "DELETE",
    }, token);
  },

  // Utility APIs
  async getGenders(token: string): Promise<Gender[]> {
    return apiFetch("/api/test/v1/genders", {}, token);
  },

  async getIndustries(token: string): Promise<Industry[]> {
    return apiFetch("/api/test/v1/industries", {}, token);
  },

  async getRoles(token: string): Promise<{ roleId: number; roleName: string }[]> {
    return apiFetch("/api/test/v1/roles", {}, token);
  },

  async healthCheck(token: string): Promise<string> {
    return apiFetch("/api/test/v1/health", {}, token);
  },
};
