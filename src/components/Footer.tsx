'use client';

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
} from 'lucide-react';
import RecruitEdgeLogo from './RecruitEdgeLogo';

export default function Footer() {
  return (
    <footer className="w-full px-4 py-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-300 border-t border-gray-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <h2 className="flex items-center justify-center gap-2 text-gray-900 dark:text-white text-lg font-semibold"><RecruitEdgeLogo className="w-6 h-6" />RecruitEdge</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with RecruitEdge</p>

        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none border border-gray-300 dark:border-zinc-700"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Subscribe
          </button>
        </form>

        <div className="flex justify-center gap-6 text-xl pt-4">
          {/* Website */}
          <a
            href="#"
            className="group relative text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition transform duration-300 active:scale-90"
            aria-label="Website"
          >
            <Globe size={20} />
            <span className="tooltip">Website</span>
          </a>

          {/* Facebook */}
          <a
            href="#"
            className="group relative text-gray-900 dark:text-white hover:text-[#1877F2] transition transform duration-300 hover:scale-125 active:scale-90"
            aria-label="Facebook"
          >
            <Facebook size={20} />
            <span className="tooltip">Facebook</span>
          </a>

          {/* Twitter */}
          <a
            href="#"
            className="group relative text-gray-900 dark:text-white hover:text-[#1DA1F2] transition transform duration-300 hover:rotate-6 hover:scale-110 active:scale-90"
            aria-label="Twitter"
          >
            <Twitter size={20} />
            <span className="tooltip">Twitter</span>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="group relative text-gray-900 dark:text-white hover:text-[#E4405F] transition transform duration-300 hover:scale-125 hover:rotate-3 active:scale-90"
            aria-label="Instagram"
          >
            <Instagram size={20} />
            <span className="tooltip">Instagram</span>
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            className="group relative text-gray-900 dark:text-white hover:text-[#0077B5] transition transform duration-300 hover:-translate-y-1 hover:scale-115 active:scale-90"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
            <span className="tooltip">LinkedIn</span>
          </a>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} RecruitEdge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
