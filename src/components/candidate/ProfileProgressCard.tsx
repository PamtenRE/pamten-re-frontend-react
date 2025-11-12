"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";

interface ProfileProgressCardProps {
  progress: number; // 0-100
  onCompleteClick?: () => void;
  onClose?: () => void;
}

export default function ProfileProgressCard({
  progress,
  onCompleteClick,
  onClose,
}: ProfileProgressCardProps) {
  // Don't render if progress is 100%
  if (progress >= 100) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto mb-8"
      >
        <div className="relative glass rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl">
          {/* Close button (optional) */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}

          {/* Heading */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Your Profile to get better job Matches !!
          </h3>

          {/* Progress Bar */}
          <ProgressBar
            progress={progress}
            showPercentage={true}
            className="mb-6"
          />

          {/* Complete Profile Button */}
          <button
            onClick={onCompleteClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Complete Profile
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
