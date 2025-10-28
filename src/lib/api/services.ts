import { apiRequest } from "./core";
import type { Testimonial, Feature, Benefit } from "@/types";

export interface HomePageData {
  testimonials: Testimonial[];
  features: {
    candidate: Feature[];
    recruiter: Feature[];
  };
  benefits: Benefit[];
}

// Re-export all API services
export { authAPI } from "./auth";
export { candidateAPI } from "./candidate";
export { jobsAPI } from "./jobs";
export { profileAPI } from "./profile";

export const homeService = {
  // Get all data needed for homepage
  async getHomePageData(): Promise<HomePageData> {
    const [testimonials, features, benefits] = await Promise.all([
      this.getTestimonials(),
      this.getFeatures(),
      this.getBenefits(),
    ]);

    return {
      testimonials: testimonials.data,
      features, // features is already in the correct format
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
