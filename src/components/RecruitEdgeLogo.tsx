import React from 'react';

export default function RecruitEdgeLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18" fill="url(#recruitedge-gradient)" stroke="#7C3AED" strokeWidth="2" />
      <path
        d="M13 25C13 19 27 19 27 25C27 29 13 29 13 25Z"
        fill="#fff"
        opacity="0.9"
      />
      <path
        d="M20 13C22.2091 13 24 14.7909 24 17C24 19.2091 22.2091 21 20 21C17.7909 21 16 19.2091 16 17C16 14.7909 17.7909 13 20 13Z"
        fill="#fff"
        opacity="0.9"
      />
      <defs>
        <linearGradient id="recruitedge-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
} 