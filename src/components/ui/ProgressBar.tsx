"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  showPercentage = true,
  className = "",
}: ProgressBarProps) {
  // Check progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-green-500 rounded-none"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 15px, rgba(0,0,0,0.1) 10px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.3)",
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 drop-shadow">
              {normalizedProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
