"use client";

import {
  isBasicInfoComplete,
  isExperienceComplete,
  isSkillsComplete,
  isATSResumeComplete,
} from "@/utils/profileHelpers";
import { ProfileFormData } from "@/utils/profileHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

interface StepNavigationProps {
  steps: string[];
  activeStepIndex: number;
  onStepClick: (index: number) => void;
  form: ProfileFormData;
}

export default function StepNavigation({
  steps,
  activeStepIndex,
  onStepClick,
  form,
}: StepNavigationProps) {
  const completion = [
    isBasicInfoComplete(form),
    isExperienceComplete(form),
    isSkillsComplete(form),
    isATSResumeComplete(form),
  ];

  //Typed ref array for tab positions
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeTab = tabRefs.current[activeStepIndex];
    if (activeTab) {
      const rect = activeTab.getBoundingClientRect();
      const parentRect = activeTab.parentElement?.getBoundingClientRect() || {
        left: 0,
      };
      setIndicatorProps({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [activeStepIndex, steps]);

  return (
    <div className="relative flex justify-between items-end w-full mb-8 border-b border-white/30 dark:border-zinc-700">
      {/* Sliding blue underline indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStepIndex}
          className="absolute bottom-0 h-[3px] bg-blue-600 rounded-full"
          initial={{ x: indicatorProps.left, width: indicatorProps.width }}
          animate={{ x: indicatorProps.left, width: indicatorProps.width }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </AnimatePresence>

      {steps.map((label, index) => {
        const isActive = index === activeStepIndex;
        const isCompleted = completion[index];

        const baseClasses =
          "flex-1 text-center mx-2 px-6 py-3 rounded-t-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap relative z-10";

        const colorClasses = isActive
          ? "text-blue-700 dark:text-blue-400 font-semibold"
          : isCompleted
          ? "text-blue-500 dark:text-blue-300"
          : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400";

        return (
          <button
            key={label}
            ref={(el: HTMLButtonElement | null) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => onStepClick(index)}
            className={`${baseClasses} ${colorClasses}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
