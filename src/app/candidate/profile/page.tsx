"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BasicInfoStep from "./components/BasicInfo";
import ExperienceStep from "./components/ExperienceStep";
import SkillsStep from "./components/SkillsStep";
import ATSResumeStep from "./components/ATSResume";
import ReviewStep from "./components/ReviewStep";
import StepNavigation from "./components/StepNavigation";
import ProfileCompletionBar from "./components/ProfileCompletionBar";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import { ProfileFormData } from "@/utils/profileHelpers";
import {
  saveProfileToLocalStorage,
  loadProfileFromLocalStorage,
  calculateProfileProgress,
} from "@/utils/profileHelpers";
import { profileAPI } from "@/lib/api/profile";
import { useToast } from "@/components/ui/Toast";

export default function CandidateProfilePage() {
  const { user, isAuthenticated, isAuthReady, updateProfileProgress, token } =
    useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tier, setTier] = useState<string>("Bronze");

  const steps = ["Basic Info", "Experience", "Skills", "ATS Resume", "Review"];

  const [form, setForm] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    location: "",
    yearsOfExperience: "",
    github: "",
    linkedin: "",
    summary: "",
    resumeFile: undefined,
    pitchVideoFile: undefined,
    education: [],
    certifications: [],
    workExperience: [],
    projects: [],
    researchPapers: [],
    skills: [],
  });

  // 🚧 AUTH GUARD — only after isAuthReady is true
  useEffect(() => {
    if (!isAuthReady) return;

    // Add a small delay to ensure localStorage is fully processed
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/");
        return;
      }
      if (user.role?.toLowerCase() !== "candidate") {
        router.push("/");
        return;
      }
    }, 100); // Small delay to prevent race condition

    return () => clearTimeout(timeout);
  }, [isAuthReady, isAuthenticated, user, router]);

  // 🔁 LOAD SAVED PROFILE DATA
  useEffect(() => {
    if (!user || !token) return;
    setIsLoading(true);

    const loadProfile = async () => {
      try {
        // Try to load from backend first
        const backendData = await profileAPI.loadProfile(user.userId, token);
        if (backendData) {
          setForm((prev) => ({
            ...prev,
            ...backendData,
            email: user.email || backendData.email || "",
          }));
        } else {
          throw new Error("No backend data");
        }
      } catch {
        // Fallback to localStorage
        const saved = loadProfileFromLocalStorage();
        if (saved) {
          setForm((prev) => ({
            ...prev,
            ...saved,
            email: user.email || saved.email,
          }));
        } else {
          const nameParts = user.fullName?.split(" ") || [];
          setForm((prev) => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" "),
            email: user.email || "",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  // 💾 AUTO-SAVE (debounced)
  useEffect(() => {
    if (!user || isLoading) return;
    const timeout = setTimeout(() => {
      setIsSaving(true);
      saveProfileToLocalStorage(form);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [form, user, isLoading]);

  // 💾 SAVE ON UNLOAD
  useEffect(() => {
    const saveBeforeUnload = () => saveProfileToLocalStorage(form);
    window.addEventListener("beforeunload", saveBeforeUnload);
    return () => window.removeEventListener("beforeunload", saveBeforeUnload);
  }, [form]);

  // 🧮 PROGRESS & TIER + SYNC TO CONTEXT
  const currentProgress = calculateProfileProgress(form);
  useEffect(() => {
    let newTier = "Bronze";
    if (currentProgress >= 25 && currentProgress < 50) newTier = "Silver";
    else if (currentProgress >= 50 && currentProgress < 75) newTier = "Gold";
    else if (currentProgress >= 75 && currentProgress < 100)
      newTier = "Platinum";
    else if (currentProgress >= 100) newTier = "Diamond";

    setTier(newTier);
    localStorage.setItem("userTier", newTier);
    updateProfileProgress(currentProgress); // ✅ sync with AuthContext

    // Show special toast when profile reaches 100%
    if (currentProgress >= 100) {
      addToast({
        type: "success",
        title: "🎉 Profile Complete!",
        message:
          "Congratulations! Your profile is now 100% complete and ready for recruiters to see.",
        duration: 8000,
      });
    }
  }, [currentProgress, updateProfileProgress, addToast]);

  // 🧱 FORM UPDATERS
  const updateForm = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateArray = (
    key: keyof ProfileFormData,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...(form[key] as any[])];
    updated[index] = { ...updated[index], [field]: value };
    updateForm(key, updated as any);
  };

  const addItem = (key: keyof ProfileFormData, newItem: any) =>
    updateForm(key, [...(form[key] as any[]), newItem]);

  const deleteItem = (key: keyof ProfileFormData, id: string) =>
    updateForm(
      key,
      (form[key] as any[]).filter((item: any) => item.id !== id)
    );

  // 🎯 FINAL SUBMIT
  const handleSubmitProfile = async () => {
    if (!token) {
      addToast({
        type: "warning",
        title: "Login Required",
        message: "Please log in to save your profile",
      });
      return;
    }

    try {
      // Save to backend
      await profileAPI.saveProfile(form, token);

      // Also save to localStorage as backup
      saveProfileToLocalStorage(form);

      addToast({
        type: "success",
        title: "Profile Submitted Successfully!",
        message: "Your profile has been saved to the server",
      });
      updateProfileProgress(currentProgress); // ✅ sync final progress
    } catch {
      // Fallback to localStorage only
      saveProfileToLocalStorage(form);
      addToast({
        type: "info",
        title: "Profile Saved Locally",
        message: "Backend unavailable - profile saved locally",
      });
      updateProfileProgress(currentProgress);
    }
  };

  const handleNext = () =>
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));
  const handleEditStep = (index: number) => setActiveStep(index);

  // 🌀 LOADING STATE
  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // 🧠 STEP RENDER
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <BasicInfoStep form={form} updateForm={updateForm} />;
      case 1:
        return (
          <ExperienceStep
            form={form}
            updateEducation={(i, f, v) => updateArray("education", i, f, v)}
            updateCertification={(i, f, v) =>
              updateArray("certifications", i, f, v)
            }
            updateWorkExperience={(i, f, v) =>
              updateArray("workExperience", i, f, v)
            }
            updateProject={(i, f, v) => updateArray("projects", i, f, v)}
            updateResearchPaper={(i, f, v) =>
              updateArray("researchPapers", i, f, v)
            }
            addEducation={() =>
              addItem("education", {
                id: crypto.randomUUID(),
                degree: "",
                field: "",
                school: "",
                year: "",
              })
            }
            addCertification={() =>
              addItem("certifications", {
                id: crypto.randomUUID(),
                name: "",
                issuer: "",
                credentialUrl: "",
                image: undefined,
              })
            }
            addWorkExperience={() =>
              addItem("workExperience", {
                id: crypto.randomUUID(),
                title: "",
                company: "",
                startDate: "",
                endDate: "",
                location: "",
                description: "",
              })
            }
            addProject={() =>
              addItem("projects", {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                link: "",
              })
            }
            addResearchPaper={() =>
              addItem("researchPapers", {
                id: crypto.randomUUID(),
                title: "",
                link: "",
              })
            }
            deleteEducation={(id) => deleteItem("education", id)}
            deleteCertification={(id) => deleteItem("certifications", id)}
            deleteWorkExperience={(id) => deleteItem("workExperience", id)}
            deleteProject={(id) => deleteItem("projects", id)}
            deleteResearchPaper={(id) => deleteItem("researchPapers", id)}
          />
        );
      case 2:
        return <SkillsStep form={form} updateForm={updateForm} />;
      case 3:
        return <ATSResumeStep form={form} updateForm={updateForm} />;
      case 4:
        return (
          <ReviewStep
            form={form}
            onEditStep={handleEditStep}
            onSubmitProfile={handleSubmitProfile}
          />
        );
      default:
        return null;
    }
  };

  // 💬 TIER MESSAGES
  const tierMessages: Record<string, string> = {
    Bronze: "Every expert started somewhere — let’s build your foundation!",
    Silver: "Nice progress! Keep going — your profile is shaping up!",
    Gold: "You’re shining! Just a few more steps to stand out.",
    Platinum: "Outstanding! You’re nearly at the top!",
    Diamond: "💎 Perfect! Your profile is complete and polished.",
  };

  return (
    <>
      <CandidateSidebar />
      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-28 md:pl-44 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header with Tier Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Candidate Profile
            </h1>
            <div className="text-right mt-3 sm:mt-0">
              <p
                className={`text-lg font-semibold ${
                  tier === "Diamond"
                    ? "text-blue-500"
                    : tier === "Platinum"
                    ? "text-purple-500"
                    : tier === "Gold"
                    ? "text-yellow-500"
                    : tier === "Silver"
                    ? "text-gray-400"
                    : "text-amber-700"
                }`}
              >
                🏅 {tier} Tier
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {tierMessages[tier]}
              </p>
            </div>
          </div>

          {/* Progress */}
          <ProfileCompletionBar currentProgress={currentProgress} form={form} />

          {/* Navigation */}
          <StepNavigation
            steps={steps}
            activeStepIndex={activeStep}
            onStepClick={setActiveStep}
            form={form}
          />

          {/* Step Container */}
          <div className="glass rounded-3xl shadow-lg p-10 mt-6 backdrop-blur-lg bg-white/30 dark:bg-zinc-800/40 border border-white/20 transition-all duration-300">
            {renderStep()}

            {activeStep < steps.length - 1 && (
              <div className="flex justify-end gap-4 mt-10">
                {activeStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Auto-save indicator */}
          <div className="text-right mt-4 text-sm text-gray-500 dark:text-gray-400">
            {isSaving
              ? "Saving..."
              : lastSaved
              ? `Last saved ${Math.floor(
                  (new Date().getTime() - lastSaved.getTime()) / 1000
                )}s ago`
              : "No changes yet"}
          </div>
        </div>
      </div>
    </>
  );
}
