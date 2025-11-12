import { candidateAPI, authAPI } from "./services";

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

export const profileAPI = {
  // ✅ Save profile to backend (safe)
  async saveProfile(
    profileData: ProfileFormData,
    token: string
  ): Promise<void> {
    // TODO: Backend API - Database not ready yet
    // Temporarily bypassing backend calls - saving to localStorage only
    console.warn(
      "⚠️ Backend database unavailable - profile saved locally only"
    );
    return; // Will use localStorage in page.tsx

    /* TODO: Uncomment when backend database is ready
    try {
      const apiData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dob,
        genderId: this.getGenderId(profileData.gender),
        experienceYears: parseInt(profileData.yearsOfExperience) || 0,
        linkedinUrl: profileData.linkedin,
        githubUsername: profileData.github,
      };

      await candidateAPI.createOrUpdateProfile(apiData, token);
      console.log("✅ Profile saved successfully");
    } catch (error) {
      console.error("❌ Failed to save profile:", error);
      throw error;
    }
    */
  },

  // ✅ Load profile safely
  async loadProfile(
    userId: string,
    token: string
  ): Promise<Partial<ProfileFormData> | null> {
    // TODO: Backend API - Database not ready yet
    // Temporarily bypassing backend calls to use localStorage
    console.warn(
      "⚠️ Backend database unavailable - using mock/localStorage data"
    );
    return null; // Will trigger localStorage fallback in page.tsx

    /* TODO: Uncomment when backend database is ready
    try {
      // --- safeguard: if authAPI or candidateAPI are missing ---
      if (!authAPI?.getUserProfile) {
        console.warn("⚠️ authAPI.getUserProfile not found, using mock data");
        return this.mockProfile();
      }

      const userProfile = await authAPI.getUserProfile(userId, token);
      const candidateProfile =
        (await candidateAPI.getProfile(userId, token)) ||
        (await candidateAPI.createOrUpdateProfile(
          {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            genderId: 1,
            experienceYears: 0,
          },
          token
        ));

      if (!userProfile && !candidateProfile) {
        console.error("❌ No backend data");
        return this.mockProfile();
      }

      const formData: Partial<ProfileFormData> = {
        firstName: candidateProfile.firstName || "",
        lastName: candidateProfile.lastName || "",
        email: userProfile?.email || "",
        phone: userProfile?.phone || "",
        yearsOfExperience: candidateProfile.experienceYears?.toString() || "",
        linkedin: candidateProfile.linkedinUrl || "",
        github: candidateProfile.githubUsername || "",
        dob: candidateProfile.dateOfBirth || "",
        gender: this.getGenderName(candidateProfile.gender) || "",
        education: [],
        certifications: [],
        workExperience: [],
        projects: [],
        researchPapers: [],
        skills: [],
      };

      console.log("✅ Loaded profile successfully");
      return formData;
    } catch (error) {
      console.error("❌ Failed to load profile:", error);
      return this.mockProfile();
    }
    */
  },

  // ✅ fallback mock
  mockProfile(): Partial<ProfileFormData> {
    return {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "1234567890",
      linkedin: "https://linkedin.com/in/janedoe",
      github: "janedoe",
      yearsOfExperience: "2",
      gender: "Female",
      dob: "1998-01-01",
      education: [],
      certifications: [],
      workExperience: [],
      projects: [],
      researchPapers: [],
      skills: ["React", "Node.js"],
    };
  },

  async getGenders(token: string) {
    return candidateAPI.getGenders(token);
  },

  async getIndustries(token: string) {
    return candidateAPI.getIndustries(token);
  },

  getGenderId(genderName: string): number {
    const map: Record<string, number> = {
      Male: 1,
      Female: 2,
      Other: 3,
      "Prefer not to say": 4,
    };
    return map[genderName] || 1;
  },

  getGenderName(genderId: number): string {
    const map: Record<number, string> = {
      1: "Male",
      2: "Female",
      3: "Other",
      4: "Prefer not to say",
    };
    return map[genderId] || "Male";
  },
};
