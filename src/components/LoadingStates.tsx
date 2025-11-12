"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <motion.div
        className="w-12 h-12 border-4 border-purple-200 rounded-full"
        style={{ borderTopColor: "rgb(168, 85, 247)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="space-y-4 w-full">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-32">
      <p className="text-red-500 dark:text-red-400">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
