'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Employer {
  id: number;
  name: string;
  emoji: string;
}

export default function FeaturedEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/featured-employers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch employers');
        return res.json();
      })
      .then((data) => {
        setEmployers(data.employers || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 text-white"
        >
          Featured Employers
        </motion.h2>

        {loading ? (
          <div className="text-center text-white py-10">Loading employers...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : employers.length === 0 ? (
          <div className="text-center text-white py-10">No employers found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
            {employers.map((employer, i) => (
              <motion.div
                key={employer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="glass flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-purple-500/30 transition-all duration-300 text-center"
              >
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl mb-3"
                >
                  {employer.emoji}
                </motion.div>
                <p className="text-white text-sm font-medium">{employer.name}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="px-6 py-2 border border-white/20 rounded-lg text-sm text-white hover:bg-white/10 backdrop-blur"
          >
            View All Employers
          </motion.button>
        </div>
      </div>
    </section>
  );
}
