/**
 * Profile completion utilities
 * Handles progress calculation and localStorage management
 */

export interface ProfileFormData {
  // Basic Info (15%)
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
  
  // Experience (45%)
  education: Array<{id: string, degree: string, field: string, school: string, year: string}>;
  certifications: Array<{id: string, name: string, issuer: string, credentialUrl: string, image?: File}>;
  workExperience: Array<{id: string, title: string, company: string, startDate: string, endDate: string, location: string, description: string}>;
  projects: Array<{id: string, name: string, description: string, link: string}>;
  researchPapers: Array<{id: string, title: string, link: string}>;
  
  // Skills (60%)
  skills: string[];
}

/**
 * Calculate if Basic Info section is complete
 */
export function isBasicInfoComplete(data: ProfileFormData): boolean {
  return !!(
    data.firstName ||
    data.lastName ||
    data.email ||
    data.dob ||
    data.gender ||
    data.phone ||
    data.location ||
    data.summary
  );
}

/**
 * Calculate if Experience section is complete
 */
export function isExperienceComplete(data: ProfileFormData): boolean {
  return !!(
    data.education.length > 0 ||
    data.workExperience.length > 0 ||
    data.certifications.length > 0 ||
    data.projects.length > 0 ||
    data.researchPapers.length > 0
  );
}

/**
 * Calculate if Skills section is complete
 */
export function isSkillsComplete(data: ProfileFormData): boolean {
  return data.skills.length > 0;
}

/**
 * Calculate if Resume section is complete
 */
export function isATSResumeComplete(data: ProfileFormData): boolean {
  return !!data.resumeFile;
}

/**
 * Calculate overall profile completion percentage
 */
export function calculateProfileProgress(data: ProfileFormData): number {
  let progress = 0;
  
  if (isBasicInfoComplete(data)) progress = 15;
  if (isExperienceComplete(data)) progress = 45;
  if (isSkillsComplete(data)) progress = 60;
  if (isATSResumeComplete(data)) progress = 85;
  
  return progress;
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
    certifications: data.certifications.map(cert => ({
      ...cert,
      image: undefined
    }))
  };
  
  localStorage.setItem('profileFormData', JSON.stringify(dataToSave));
}

/**
 * Load profile data from localStorage
 */
export function loadProfileFromLocalStorage(): ProfileFormData | null {
  const saved = localStorage.getItem('profileFormData');
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

/**
 * Clear profile data from localStorage
 */
export function clearProfileFromLocalStorage(): void {
  localStorage.removeItem('profileFormData');
  localStorage.removeItem('profileProgress');
}