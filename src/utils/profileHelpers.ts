/**
 * Profile completion utilities
 * Handles progress calculation and localStorage management
 */

export interface ProfileFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience: string;
  github: string;
  linkedin: string;
  summary: string;
  resumeFile?: File;
  pitchVideoFile?: File;

  // Experience
  education: Array<{
    id: string;
    degree: string;
    field: string;
    school: string;
    year: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    credentialUrl: string;
    image?: File;
  }>;
  workExperience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link: string;
  }>;
  researchPapers: Array<{ id: string; title: string; link: string }>;

  // Skills
  skills: string[];
}

/**
 * Calculate if Basic Info section is complete
 */
export function isBasicInfoComplete(data: ProfileFormData): boolean {
  // Stricter basic info: require essential fields
  const hasName = !!(data.firstName && data.lastName);
  const hasContact = !!(data.email && data.location);
  return hasName && hasContact;
}

/**
 * Calculate if Experience section is complete
 */
export function hasEducation(data: ProfileFormData): boolean {
  return data.education.length > 0;
}

export function hasWorkExperience(data: ProfileFormData): boolean {
  return data.workExperience.length > 0;
}

export function hasCertifications(data: ProfileFormData): boolean {
  return data.certifications.length > 0;
}

export function hasProjects(data: ProfileFormData): boolean {
  return data.projects.length > 0;
}

export function hasResearchPapers(data: ProfileFormData): boolean {
  return data.researchPapers.length > 0;
}

export function isExperienceComplete(data: ProfileFormData): boolean {
  return hasEducation(data) && hasWorkExperience(data);
}

/**
 * Calculate if Skills section is complete
 */
export function isSkillsComplete(data: ProfileFormData): boolean {
  return data.skills.length > 0;
}

/**
 * Calculate if ATS Resume section is complete
 */
export function isATSResumeComplete(data: ProfileFormData): boolean {
  return !!data.resumeFile;
}

/**
 * Calculate overall profile completion percentage
 */
export function calculateProfileProgress(data: ProfileFormData): number {
  // Additive model to reach 100%
  // Weights: Basic 25, Experience 35 (7 each across 5 subsections), Skills 20, Resume 20
  let progress = 0;

  // Basic (25)
  if (isBasicInfoComplete(data)) progress += 25;

  // Experience (up to 35)
  const experienceBuckets = [
    hasEducation(data),
    hasWorkExperience(data),
    hasCertifications(data),
    hasProjects(data),
    hasResearchPapers(data),
  ];
  const perBucket = 35 / experienceBuckets.length; // 7 each
  experienceBuckets.forEach((b) => {
    if (b) progress += perBucket;
  });

  // Skills (20)
  if (isSkillsComplete(data)) progress += 20;

  // Resume (20)
  if (isATSResumeComplete(data)) progress += 20;

  // Clamp to 100
  return Math.min(100, Math.round(progress));
}

/**
 * Save profile data to localStorage
 */
export function saveProfileToLocalStorage(data: ProfileFormData): void {
  // Don't save File objects to localStorage (they can't be stringified)
  const dataToSave = {
    ...data,
    resumeFile: undefined,
    pitchVideoFile: undefined,
    certifications: data.certifications.map((cert) => ({
      ...cert,
      image: undefined,
    })),
  };

  localStorage.setItem("profileFormData", JSON.stringify(dataToSave));
}

/**
 * Load profile data from localStorage
 */
export function loadProfileFromLocalStorage(): ProfileFormData | null {
  const saved = localStorage.getItem("profileFormData");
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Error loading profile from localStorage:", error);
    return null;
  }
}

/**
 * Clear profile data from localStorage
 */
export function clearProfileFromLocalStorage(): void {
  localStorage.removeItem("profileFormData");
  localStorage.removeItem("profileProgress");
}
