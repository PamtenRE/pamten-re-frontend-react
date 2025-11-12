import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/lib/api/services";

export const queryKeys = {
  home: ["home"],
  testimonials: ["testimonials"],
  features: ["features"],
  benefits: ["benefits"],
} as const;

export function useHomePageData() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: () => homeService.getHomePageData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => homeService.getTestimonials(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFeatures() {
  return useQuery({
    queryKey: queryKeys.features,
    queryFn: () => homeService.getFeatures(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBenefits() {
  return useQuery({
    queryKey: queryKeys.benefits,
    queryFn: () => homeService.getBenefits(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
