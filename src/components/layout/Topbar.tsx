'use client';

export default function Topbar() {
  return (
    <div className="w-full px-6 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white text-sm flex justify-between items-center transition-colors duration-300">
      <div className="font-semibold">Recruiter Dashboard</div>
      <div className="text-muted">Welcome back 👋</div>
    </div>
  );
}
