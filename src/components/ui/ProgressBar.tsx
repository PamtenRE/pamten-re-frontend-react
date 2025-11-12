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
      <div className="relative w-full h-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl"
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, 
              #3b82f6 0%, 
              #6366f1 25%, 
              #8b5cf6 50%, 
              #a855f7 75%, 
              #c084fc 100%)`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.1),
              0 4px 12px rgba(59, 130, 246, 0.3)
            `,
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {normalizedProgress}%
            </span>
          </div>
        )}
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-pulse" />
      </div>
    </div>
  );
}
