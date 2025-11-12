// src/lib/api/services.ts
import { apiRequest } from "./core";
import { apiFetch } from "@/utils/api";
import type { Testimonial, Feature, Benefit } from "@/types";

export interface HomePageData {
  testimonials: Testimonial[];
  features: {
    candidate: Feature[];
    recruiter: Feature[];
  };
  benefits: Benefit[];
}

//
// 🏠 HOME SERVICE – Landing Page APIs
//
export const homeService = {
  async getHomePageData(): Promise<HomePageData> {
    const [testimonials, features, benefits] = await Promise.all([
      this.getTestimonials(),
      this.getFeatures(),
      this.getBenefits(),
    ]);

    return {
      testimonials: testimonials.data,
      features,
      benefits: benefits.data,
    };
  },

  async getTestimonials() {
    return apiRequest<Testimonial[]>("/api/testimonials");
  },

  async getFeatures() {
    const [candidateRes, recruiterRes] = await Promise.all([
      apiRequest<{ features: Feature[] }>("/api/features?type=candidate"),
      apiRequest<{ features: Feature[] }>("/api/features?type=recruiter"),
    ]);

    return {
      candidate: candidateRes.data.features,
      recruiter: recruiterRes.data.features,
    };
  },

  async getBenefits() {
    return apiRequest<Benefit[]>("/api/benefits");
  },
};

//
// 👩‍💼 CANDIDATE APIs
//
export const candidateAPI = {
  getApplications: (userId: string, token?: string) =>
    apiFetch(`/api/applications/v1/candidate/${userId}`, {}, token),

  getProfile: (userId: string, token?: string) =>
    apiFetch(`/api/profile/v1/candidate/${userId}`, {}, token),

  createOrUpdateProfile: (data: any, token?: string) =>
    apiFetch(
      `/api/profile/v1/candidate`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ),

  getGenders: (token?: string) => apiFetch(`/api/master/v1/genders`, {}, token),

  getIndustries: (token?: string) =>
    apiFetch(`/api/master/v1/industries`, {}, token),

  getResumes: async (email: string, token?: string) => {
    return apiFetch(`/api/candidate/v1/resumes/${email}`, {}, token);
  },

  uploadResume: async (
    file: File,
    email: string,
    isDefault: boolean,
    folder?: string,
    token?: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("isDefault", String(isDefault));
    if (folder) formData.append("folder", folder);

    return apiFetch(
      "/api/candidate/v1/upload-resume",
      {
        method: "POST",
        body: formData,
      },
      token
    );
  },

  // Temporary mock for Apply Job API
  applyToJob: async (applicationData: any, token?: string) => {
    console.log("🧩 Mock applyToJob called:", applicationData);
    // Return mock success so your UI works
    return Promise.resolve({
      success: true,
      message: "Mock: Job application submitted successfully",
    });
  },
};

//
// 🧑‍💼 RECRUITER APIs
//
export const recruiterAPI = {
  getJobs: (recruiterId: string, token?: string) =>
    apiFetch(`/api/jobs/v1/recruiter/${recruiterId}`, {}, token),

  createJob: (data: any, token?: string) =>
    apiFetch(
      `/api/jobs/v1/create`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ),
};

//
// 💼 JOBS APIs (shared by candidate & recruiter)
//
export const jobsAPI = {
  // ✅ Candidate Browse Jobs
  getAllJobs: async (page = 0, size = 20, token?: string) => {
    const url = `/api/jobs/v1/all?page=${page}&size=${size}`;
    console.log("🌐 Fetching jobs from:", url);

    try {
      // Try with token first
      const response = await apiFetch(url, {}, token);
      console.log("✅ Jobs fetched:", response);
      return response;
    } catch (err) {
      console.warn("⚠️ apiFetch failed, retrying without token...", err);
      try {
        // Retry without Authorization header
        const fallback = await apiRequest(url);
        console.log("✅ Fallback jobs fetched:", fallback);
        return fallback;
      } catch (error) {
        console.error("❌ Both job fetch attempts failed:", error);
        throw error;
      }
    }
  },

  // ✅ Recruiter Dashboard Jobs
  getRecruiterJobs: async (recruiterId: string, token?: string) => {
    console.log("📡 Fetching recruiter jobs...");
    return apiFetch(`/api/jobs/v1/recruiter/${recruiterId}`, {}, token);
  },
};

//
// 🔐 AUTH APIs
//
export const authAPI = {
  login: (userId: string, password: string) =>
    apiFetch(`/api/auth/v1/login`, {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    }),

  register: (formData: any) =>
    apiFetch(`/api/auth/v1/register`, {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  getUserProfile: (userId: string, token: string) =>
    apiFetch(`/api/users/v1/${userId}`, {}, token),
};
