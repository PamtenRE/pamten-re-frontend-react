'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  emoji: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace this URL with your real API endpoint later
    fetch('/api/featured-jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
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
          Featured Jobs
        </motion.h2>

        {loading ? (
          <div className="text-center text-white py-10">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-white py-10">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-6 shadow-md hover:shadow-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-3 text-white text-xl">
                  <span className="text-2xl">{job.emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-zinc-300">{job.company}</p>
                  </div>
                </div>

                <div className="text-sm text-zinc-300 flex flex-col gap-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </p>
                  <p className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                  </p>
                </div>

                <button className="mt-4 w-full bg-zinc-100/10 hover:bg-zinc-100/20 text-white text-sm py-2 px-4 rounded transition">
                  Apply Now
                </button>
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
            View All Jobs
          </motion.button>
        </div>
      </div>
    </section>
  );
}
