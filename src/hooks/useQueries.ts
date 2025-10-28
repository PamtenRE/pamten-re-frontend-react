import { useQuery } from "@tanstack/react-query";

// Fetch testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => fetch("/api/testimonials").then((res) => res.json()),
  });
}

// Fetch features
export function useFeatures(type: "candidate" | "recruiter") {
  return useQuery({
    queryKey: ["features", type],
    queryFn: () =>
      fetch(`/api/features?type=${type}`).then((res) => res.json()),
  });
}

// Fetch benefits
export function useBenefits() {
  return useQuery({
    queryKey: ["benefits"],
    queryFn: () => fetch("/api/benefits").then((res) => res.json()),
  });
}

// Combined initial data hook
export function useInitialData() {
  return useQuery({
    queryKey: ["initial-data"],
    queryFn: async () => {
      const [
        benefitsRes,
        testimonialRes,
        candidateFeaturesRes,
        recruiterFeaturesRes,
      ] = await Promise.all([
        fetch("/api/benefits"),
        fetch("/api/testimonials"),
        fetch("/api/features?type=candidate"),
        fetch("/api/features?type=recruiter"),
      ]);

      const [benefits, testimonials, candidateFeatures, recruiterFeatures] =
        await Promise.all([
          benefitsRes.json(),
          testimonialRes.json(),
          candidateFeaturesRes.json(),
          recruiterFeaturesRes.json(),
        ]);

      return {
        benefits,
        testimonials,
        features: {
          candidate: candidateFeatures,
          recruiter: recruiterFeatures,
        },
      };
    },
  });
}
