"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import RecruiterLayout from "@/components/layout/RecruiterLayout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  User,
  Mail,
  Briefcase,
  Phone,
  Linkedin,
  Building2,
  Globe,
  Users,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";

export default function RecruiterProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    hrEmail: "",
    role: "",
    phone: "",
    linkedIn: "",
    companyName: "",
    website: "",
    industryName: "",
    companySize: "",
    headquarters: "",
    yearsInBusiness: "",
    companyDescription: "",
    hiringDomains: "",
    hiringVolume: "",
    clientType: "",
    profileImage: "",
    bannerImage: "",
  });

  // ✅ Hydration guard
  useEffect(() => setHydrated(true), []);

  // ✅ Redirect non-recruiters
  useEffect(() => {
    if (!hydrated || user === undefined || user === null) return;
    if (!user) {
      setAccessDenied("Please sign in to access recruiter profile.");
      router.push("/login");
    } else if (user.role?.toLowerCase() !== "recruiter") {
      setAccessDenied("Only recruiter accounts can access this page.");
      router.push("/");
    }
  }, [user, hydrated, router]);

  // ✅ Prefill user info
  useEffect(() => {
    if (user && hydrated) {
      setFormData((prev) => ({
        ...prev,
        hrEmail: user.email || "",
        firstName: user.email?.split("@")[0] || "",
      }));
    }
  }, [user, hydrated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({
        ...prev,
        bannerImage: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setIsEditing(false);
      setUser({ ...user!, profileCompleted: true });
    }, 1000);
  };

  if (!hydrated || user === undefined || user === null) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading profile…
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "recruiter") {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        {accessDenied || "Redirecting..."}
      </div>
    );
  }

  return (
    <RecruiterLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-b from-[#f9f9ff] via-[#f5f7ff] to-[#eef2ff] dark:from-[#0f0f10] dark:via-[#111114] dark:to-[#0b0b0c] text-gray-900 dark:text-white p-8 transition-colors duration-500"
      >
        {/* Header Section */}
        <div className="relative w-full max-w-6xl mx-auto mb-24">
          {/* Banner */}
          <div className="relative h-52 md:h-56 rounded-2xl overflow-hidden shadow-md group">
            {formData.bannerImage ? (
              <img
                src={formData.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-400 dark:from-purple-600 dark:via-blue-600 dark:to-cyan-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent rounded-2xl dark:from-black/50" />

            {/* Upload overlay */}
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="absolute inset-0 bg-black/30 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              <Camera size={24} />
              <span className="text-xs mt-1">Change Banner</span>
            </div>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 md:left-16 md:translate-x-0 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group w-36 h-36 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-5xl font-bold uppercase bg-gradient-to-tr from-purple-500 to-blue-500 text-white">
                  {formData.firstName ? formData.firstName.charAt(0) : "R"}
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
              >
                <Camera size={22} />
                <span className="text-xs mt-1">Change Photo</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            <div className="text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-3xl font-bold capitalize">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {formData.role || "HR Recruiter"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formData.companyName || "Company Name"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-1">Recruiter Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Update your professional and company details.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={status === "saving"}
                  className={`px-6 py-2 rounded-lg shadow-md ${
                    status === "saving"
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                  }`}
                >
                  {status === "saving"
                    ? "Saving..."
                    : status === "saved"
                    ? "Saved ✅"
                    : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 shadow-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#1b1824] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg p-10 space-y-10 transition-colors duration-500">
          <SectionTitle title="Personal Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              icon={<User size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              icon={<User size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Official Email"
              name="hrEmail"
              value={formData.hrEmail}
              onChange={handleChange}
              icon={<Mail size={18} />}
              disabled
            />
            <ProfileField
              label="Role / Designation"
              name="role"
              value={formData.role}
              onChange={handleChange}
              icon={<Briefcase size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={<Phone size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="LinkedIn Profile"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              icon={<Linkedin size={18} />}
              disabled={!isEditing}
            />
          </div>

          <SectionTitle title="Company Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              icon={<Building2 size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              icon={<Globe size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Industry"
              name="industryName"
              value={formData.industryName}
              onChange={handleChange}
              icon={<Briefcase size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Company Size"
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              icon={<Users size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              icon={<MapPin size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Years in Business"
              name="yearsInBusiness"
              value={formData.yearsInBusiness}
              onChange={handleChange}
              icon={<Calendar size={18} />}
              disabled={!isEditing}
            />
          </div>

          <TextAreaField
            label="Company Overview"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            icon={<FileText size={18} />}
            disabled={!isEditing}
            placeholder="Describe your company, mission, and recruitment approach..."
          />

          <SectionTitle title="Recruitment Focus" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Primary Hiring Domains"
              name="hiringDomains"
              value={formData.hiringDomains}
              onChange={handleChange}
              icon={<Users size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Hiring Volume"
              name="hiringVolume"
              value={formData.hiringVolume}
              onChange={handleChange}
              icon={<Briefcase size={18} />}
              disabled={!isEditing}
            />
            <ProfileField
              label="Client Type"
              name="clientType"
              value={formData.clientType}
              onChange={handleChange}
              icon={<Briefcase size={18} />}
              disabled={!isEditing}
            />
          </div>
        </div>
      </motion.div>
    </RecruiterLayout>
  );
}

/* ---------------------- Subcomponents ---------------------- */
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-white/10 pb-2 transition-colors duration-300">
      {title}
    </h2>
  );
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled,
  icon,
  type = "text",
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
        <div className="text-purple-500">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  disabled,
  icon,
  placeholder,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-start gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
        <div className="text-purple-500 mt-1">{icon}</div>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none disabled:opacity-60"
        />
      </div>
    </div>
  );
}
