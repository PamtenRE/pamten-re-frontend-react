"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ResumePreview from "@/components/candidate/ResumePreview";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import htmlDocx from "html-docx-js/dist/html-docx";

export default function CandidateProfilePage() {
  const { user, isAuthenticated, isAuthReady, updateProfileProgress, token } =
    useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tier, setTier] = useState<string>("Bronze");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [includePamtenLogo, setIncludePamtenLogo] = useState(false);

  const hasShown100Toast = useRef(false);
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

  // 🧩 AUTH GUARD
  useEffect(() => {
    if (!isAuthReady) return;
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/?login=1");
        return;
      }
      if (user.role?.toLowerCase() !== "candidate") {
        router.push("/");
        return;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [isAuthReady, isAuthenticated, user, router]);

  // 🔁 LOAD PROFILE
  useEffect(() => {
    if (!user || !token) return;
    setIsLoading(true);

    const loadProfile = async () => {
      try {
        const backendData = await profileAPI.loadProfile(user.userId, token);
        if (backendData) {
          setForm((prev) => ({
            ...prev,
            ...backendData,
            email: user.email || backendData.email || "",
          }));
        } else throw new Error("No backend data");
      } catch {
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

  // 💾 Save before unload
  useEffect(() => {
    const saveBeforeUnload = () => saveProfileToLocalStorage(form);
    window.addEventListener("beforeunload", saveBeforeUnload);
    return () => window.removeEventListener("beforeunload", saveBeforeUnload);
  }, [form]);

  // 🧮 Progress + Tier
  const currentProgress = useMemo(() => calculateProfileProgress(form), [form]);
  const currentTier = useMemo(() => {
    if (currentProgress >= 100) return "Diamond";
    if (currentProgress >= 75) return "Platinum";
    if (currentProgress >= 50) return "Gold";
    if (currentProgress >= 25) return "Silver";
    return "Bronze";
  }, [currentProgress]);
  useEffect(() => setTier(currentTier), [currentTier]);

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

  // 📥 SUBMIT
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
      await profileAPI.saveProfile(form, token);
      saveProfileToLocalStorage(form);
      addToast({
        type: "success",
        title: "Profile Submitted Successfully!",
        message: "Your profile has been saved to the server",
      });
      updateProfileProgress(currentProgress);
    } catch {
      saveProfileToLocalStorage(form);
      addToast({
        type: "info",
        title: "Profile Saved Locally",
        message: "Backend unavailable - profile saved locally",
      });
      updateProfileProgress(currentProgress);
    }
  };

  // ✅ Validation + Navigation
  function validateForStep(stepIndex: number): string | null {
    if (
      stepIndex === 0 &&
      (!form.firstName || !form.lastName || !form.email || !form.location)
    )
      return "Please fill First Name, Last Name, Email, and Location.";
    if (stepIndex === 2 && (!form.skills || form.skills.length === 0))
      return "Please add at least one skill.";
    if (stepIndex === 3 && !form.resumeFile)
      return "Please upload your resume.";
    return null;
  }

  const handleNext = () => {
    const msg = validateForStep(activeStep);
    if (msg) {
      setErrorMessage(msg);
      return;
    }
    setErrorMessage("");
    saveProfileToLocalStorage(form);
    setLastSaved(new Date());
    updateProfileProgress(currentProgress);
    localStorage.setItem("userTier", currentTier);

    if (currentProgress >= 100 && !hasShown100Toast.current) {
      hasShown100Toast.current = true;
      addToast({
        type: "success",
        title: "🎉 Profile Complete!",
        message:
          "Congratulations! Your profile is now 100% complete and ready for recruiters to see.",
        duration: 8000,
      });
    }
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  // 🧾 Download Handlers
  const handleDownloadPDF = async () => {
    const preview = document.querySelector("#resume-preview");
    if (!preview) return;

    // Clone the existing preview content (so you don't change what's on screen)
    const cloned = preview.cloneNode(true) as HTMLElement;
    cloned.id = "resume-a4";
    cloned.style.width = "210mm";
    cloned.style.minHeight = "297mm";
    cloned.style.padding = "20mm 18mm";
    cloned.style.backgroundColor = "white";
    cloned.style.fontFamily = "Arial, sans-serif";
    cloned.style.lineHeight = "1.6";
    cloned.style.color = "#111827";
    cloned.style.margin = "0 auto";

    // Temporarily add it to the DOM but hidden
    cloned.style.position = "fixed";
    cloned.style.top = "-9999px";
    document.body.appendChild(cloned);

    // Generate high-res PDF
    const canvas = await html2canvas(cloned, {
      scale: 3,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    pdf.save(`${form.firstName || "Resume"}.pdf`);

    // Clean up
    document.body.removeChild(cloned);
  };

  const handleDownloadDocx = () => {
    const preview = document.querySelector("#resume-preview");
    if (!preview) return;

    const cloned = preview.cloneNode(true) as HTMLElement;
    cloned.style.width = "210mm";
    cloned.style.minHeight = "297mm";
    cloned.style.padding = "20mm 18mm";
    cloned.style.backgroundColor = "white";
    cloned.style.color = "#111827";
    cloned.style.fontFamily = "Arial, sans-serif";

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body>${cloned.outerHTML}</body>
      </html>
    `;

    const converted = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(converted);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.firstName || "Resume"}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🌀 LOADING
  if (!isAuthReady || isLoading)
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

  const tierMessages: Record<string, string> = {
    Bronze: "Every expert started somewhere — let’s build your foundation!",
    Silver: "Nice progress! Keep going — your profile is shaping up!",
    Gold: "You’re shining! Just a few more steps to stand out.",
    Platinum: "Outstanding! You’re nearly at the top!",
    Diamond: "💎 Perfect! Your profile is complete and polished.",
  };

  // ✅ Layout
  return (
    <>
      <CandidateSidebar />
      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-28 md:pl-44 transition-colors duration-300">
        <div className="max-w-7xl mx-auto mt-8 flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDE - FORM */}
          <div className="flex-1">
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

            <ProfileCompletionBar
              currentProgress={currentProgress}
              form={form}
            />
            <StepNavigation
              steps={steps}
              activeStepIndex={activeStep}
              onStepClick={setActiveStep}
              form={form}
            />

            <div className="glass rounded-3xl shadow-lg p-10 mt-6 backdrop-blur-lg bg-white/30 dark:bg-zinc-800/40 border border-white/20 transition-all duration-300">
              {errorMessage && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </div>
              )}
              {/* Step Component */}
              {(() => {
                switch (activeStep) {
                  case 0:
                    return (
                      <BasicInfoStep form={form} updateForm={updateForm} />
                    );
                  case 1:
                    return (
                      <ExperienceStep
                        form={form}
                        updateEducation={(i, f, v) =>
                          updateArray("education", i, f, v)
                        }
                        updateCertification={(i, f, v) =>
                          updateArray("certifications", i, f, v)
                        }
                        updateWorkExperience={(i, f, v) =>
                          updateArray("workExperience", i, f, v)
                        }
                        updateProject={(i, f, v) =>
                          updateArray("projects", i, f, v)
                        }
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
                        deleteCertification={(id) =>
                          deleteItem("certifications", id)
                        }
                        deleteWorkExperience={(id) =>
                          deleteItem("workExperience", id)
                        }
                        deleteProject={(id) => deleteItem("projects", id)}
                        deleteResearchPaper={(id) =>
                          deleteItem("researchPapers", id)
                        }
                      />
                    );
                  case 2:
                    return <SkillsStep form={form} updateForm={updateForm} />;
                  case 3:
                    return (
                      <ATSResumeStep
                        form={form}
                        updateForm={updateForm}
                        onPrefill={async (parsed) => {
                          console.log("🧠 Parsed resume data:", parsed);

                          if (parsed.basic_info) {
                            const info = parsed.basic_info;

                            // ✅ Handle full name flexibly
                            const fullName =
                              info.full_name ||
                              info.name ||
                              info.candidate_name ||
                              `${info.first_name || ""} ${
                                info.last_name || ""
                              }`.trim();

                            if (fullName) {
                              const parts = fullName.trim().split(/\s+/);
                              if (parts.length === 1) {
                                updateForm("firstName", parts[0]);
                                updateForm("lastName", "");
                              } else {
                                const lastName = parts.pop();
                                const firstName = parts.join(" ");
                                updateForm("firstName", firstName);
                                updateForm("lastName", lastName || "");
                              }
                            }

                            // ✅ Fill remaining info safely
                            updateForm("email", info.email || form.email);
                            updateForm(
                              "phone",
                              info.phone || info.contact || form.phone
                            );
                            updateForm(
                              "location",
                              info.location || info.address || form.location
                            );
                            updateForm(
                              "linkedin",
                              info.linkedin ||
                                info.linkedin_url ||
                                info.linkedinProfile ||
                                form.linkedin
                            );
                            updateForm(
                              "summary",
                              info.summary || info.about || form.summary
                            );
                          }

                          // ✅ Education
                          if (
                            parsed.education &&
                            Array.isArray(parsed.education)
                          ) {
                            updateForm(
                              "education",
                              parsed.education.map((e: any) => ({
                                id: crypto.randomUUID(),
                                degree: e.degree || "",
                                field: e.field || e.study_field || "",
                                school: e.school || e.institution || "",
                                year: e.year || "",
                              }))
                            );
                          }

                          // ✅ Work experience
                          if (
                            parsed.work_experience &&
                            Array.isArray(parsed.work_experience)
                          ) {
                            updateForm(
                              "workExperience",
                              parsed.work_experience.map((w: any) => ({
                                id: crypto.randomUUID(),
                                title: w.title || w.job_title || "",
                                company: w.company || "",
                                startDate: w.start_date || "",
                                endDate: w.end_date || "",
                                location: w.location || "",
                                description: w.description || "",
                              }))
                            );
                          }

                          // ✅ Skills
                          if (parsed.skills && Array.isArray(parsed.skills)) {
                            updateForm("skills", parsed.skills);
                          }
                        }}
                      />
                    );

                  case 4:
                    return (
                      <ReviewStep
                        form={form}
                        onEditStep={setActiveStep}
                        onSubmitProfile={handleSubmitProfile}
                      />
                    );
                  default:
                    return null;
                }
              })()}

              {activeStep < steps.length - 1 && (
                <div className="flex justify-end gap-4 mt-10">
                  {activeStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <div className="text-right mt-4 text-sm text-gray-500 dark:text-gray-400">
              {lastSaved
                ? `Last saved ${Math.floor(
                    (new Date().getTime() - lastSaved.getTime()) / 1000
                  )}s ago`
                : "Changes will be saved when you navigate"}
            </div>
          </div>

          {/* RIGHT SIDE — PREVIEW + DOWNLOAD */}
          <div className="w-full lg:w-[40%] sticky top-28 h-[calc(100vh-6rem)] overflow-y-auto hidden lg:flex flex-col">
            <div id="resume-preview" className="flex-1">
              <ResumePreview
                resumeData={{
                  personal: {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    phone: form.phone,
                    location: form.location,
                    linkedin: form.linkedin,
                  },
                  summary: form.summary,
                  experience: form.workExperience,
                  education: form.education,
                  skills: form.skills,
                  certifications: form.certifications,
                  projects: form.projects,
                  researchPapers: form.researchPapers,
                }}
                showPamtenLogo={includePamtenLogo}
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pamtenLogoToggle"
                  checked={includePamtenLogo}
                  onChange={(e) => setIncludePamtenLogo(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <label
                  htmlFor="pamtenLogoToggle"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Add Pamten Logo to Document
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  ⬇️ Download PDF
                </button>
                <button
                  onClick={handleDownloadDocx}
                  className="flex-1 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                >
                  ⬇️ Download DOCX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
