'use client';

import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '@/contexts/LoginModalContext';
import { motion } from 'framer-motion';
import {
  RocketIcon,
  UsersIcon,
  ShieldIcon,
  ActivitySquareIcon,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  UsersIcon,
  ActivitySquareIcon,
  ShieldIcon,
  RocketIcon,
};

interface Benefit {
  title: string;
  desc: string;
  icon: keyof typeof iconMap;
}

export default function Hero() {
  const { openModal } = useContext(ModalContext);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/benefits')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch benefits');
        return res.json();
      })
      .then((data) => {
        setBenefits(data.benefits || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative z-10 w-full pt-32 pb-20 text-gray-900 dark:text-white">
      <div className="text-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Next Career Starts Here
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-xl mx-auto">
          Connecting top talent with leading companies worldwide. Find your dream job or the perfect candidate today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => openModal()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Find Jobs
          </button>
        </div>
      </div>

      <div className="mt-24 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center text-white py-10">Loading features...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : benefits.length === 0 ? (
          <div className="text-center text-white py-10">No features found.</div>
        ) : (
          benefits.map((item, idx) => {
            const Icon = iconMap[item.icon] || UsersIcon;
            return (
              <motion.div
                key={idx}
                className="bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-zinc-800 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="mx-auto h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.desc}</p>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
