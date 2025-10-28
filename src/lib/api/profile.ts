import { candidateAPI, authAPI } from "./services";

// Profile form data interface
export interface ProfileFormData {
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
  education: Education[];
  certifications: Certification[];
  workExperience: WorkExperience[];
  projects: Project[];
  researchPapers: ResearchPaper[];
  skills: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  school: string;
  year: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credentialUrl: string;
  image?: File;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  link: string;
}

// Profile API Services
export const profileAPI = {
  // Save profile to backend
  async saveProfile(profileData: ProfileFormData, token: string): Promise<void> {
    try {
      // Convert form data to API format
      const apiData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dob,
        genderId: this.getGenderId(profileData.gender),
        experienceYears: parseInt(profileData.yearsOfExperience) || 0,
        linkedinUrl: profileData.linkedin,
        githubUsername: profileData.github,
      };

      // Save basic profile info
      await candidateAPI.createOrUpdateProfile(apiData, token);

      // TODO: Save additional profile data when backend supports it
      // - Education
      // - Certifications
      // - Work Experience
      // - Projects
      // - Research Papers
      // - Skills

      console.log("Profile saved successfully to backend");
    } catch (error) {
      console.error("Failed to save profile to backend:", error);
      throw error;
    }
  },

  // Load profile from backend
  async loadProfile(userId: string, token: string): Promise<Partial<ProfileFormData> | null> {
    try {
      // Get user profile from auth API
      const userProfile = await authAPI.getUserProfile(userId, token);
      
      // Get candidate profile
      const candidateProfile = await candidateAPI.createOrUpdateProfile({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        genderId: 1,
        experienceYears: 0,
      }, token);

      // Convert API data to form format
      const formData: Partial<ProfileFormData> = {
        firstName: candidateProfile.firstName || "",
        lastName: candidateProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        yearsOfExperience: candidateProfile.experienceYears?.toString() || "",
        linkedin: candidateProfile.linkedinUrl || "",
        github: candidateProfile.githubUsername || "",
        dob: candidateProfile.dateOfBirth || "",
        gender: this.getGenderName(candidateProfile.gender) || "",
        // TODO: Load additional data when backend supports it
        education: [],
        certifications: [],
        workExperience: [],
        projects: [],
        researchPapers: [],
        skills: [],
      };

      return formData;
    } catch (error) {
      console.error("Failed to load profile from backend:", error);
      return null;
    }
  },

  // Get available genders
  async getGenders(token: string) {
    return candidateAPI.getGenders(token);
  },

  // Get available industries
  async getIndustries(token: string) {
    return candidateAPI.getIndustries(token);
  },

  // Helper functions
  getGenderId(genderName: string): number {
    const genderMap: Record<string, number> = {
      "Male": 1,
      "Female": 2,
      "Other": 3,
      "Prefer not to say": 4,
    };
    return genderMap[genderName] || 1;
  },

  getGenderName(genderId: number): string {
    const genderMap: Record<number, string> = {
      1: "Male",
      2: "Female",
      3: "Other",
      4: "Prefer not to say",
    };
    return genderMap[genderId] || "Male";
  },
};
