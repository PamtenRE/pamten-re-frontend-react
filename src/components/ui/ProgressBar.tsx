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
      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            boxShadow:
              "0 2px 4px rgba(59, 130, 246, 0.3), 0 0 8px rgba(139, 92, 246, 0.2)",
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 drop-shadow">
              {normalizedProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
