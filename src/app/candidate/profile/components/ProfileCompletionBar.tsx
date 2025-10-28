"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ProfileFormData,
  isBasicInfoComplete,
  isExperienceComplete,
  isSkillsComplete,
  isATSResumeComplete,
} from "@/utils/profileHelpers";

interface ProfileCompletionBarProps {
  currentProgress: number;
  form: ProfileFormData;
}

export default function ProfileCompletionBar({
  currentProgress,
  form,
}: ProfileCompletionBarProps) {
  return (
    <div className="glass rounded-xl shadow-lg p-6 mb-6">
      {/* Percentage Display */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Profile Completion: {currentProgress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${currentProgress}%`,
            boxShadow:
              "0 2px 4px rgba(59, 130, 246, 0.3), 0 0 8px rgba(139, 92, 246, 0.2)",
          }}
        />
      </div>

      {/* Section Indicators with Animated Checkmarks */}
      <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {[
          { label: "Basic Info", check: isBasicInfoComplete(form) },
          { label: "Experience", check: isExperienceComplete(form) },
          { label: "Skills", check: isSkillsComplete(form) },
          { label: "Resume", check: isATSResumeComplete(form) },
        ].map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {item.label}
            <AnimatePresence>
              {item.check && (
                <motion.span
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.3, 1],
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-green-600 dark:text-green-400 font-bold"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        ))}
      </div>
    </div>
  );
}
