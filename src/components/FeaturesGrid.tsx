"use client";

import { motion } from "framer-motion";
import { useTestimonials } from "@/hooks/useQueries";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  emoji: string;
}

export default function FeaturesGrid() {
  const { data, isLoading: loading, error } = useTestimonials();
  const testimonials = data?.testimonials || [];
  const errorMessage =
    error instanceof Error ? error.message : "An error occurred";

  return (
    <section className="py-20 md:py-28 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-white"
        >
          What Our Users Say
        </motion.h2>

        {loading ? (
          <div className="text-center text-white py-10">
            Loading testimonials...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{errorMessage}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-white py-10">
            No testimonials found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="glass p-6 md:p-8 rounded-2xl text-left shadow-md hover:shadow-purple-500/30 transition-all duration-300"
              >
                <p className="italic text-white mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl rounded-full bg-white/20 border border-white/30">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/70">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
