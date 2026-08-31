import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../zustand/store';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
        isDark
          ? "bg-slate-800/80 border-slate-700/80 text-amber-300 hover:bg-slate-700 hover:text-amber-200 shadow-md shadow-black/30"
          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 shadow-sm shadow-slate-200"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <Moon className="w-4 h-4" />
            <span className="text-xs font-semibold hidden md:inline">Dark</span>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold hidden md:inline">Light</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
