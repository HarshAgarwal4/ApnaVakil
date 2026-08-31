import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import { Menu, ExternalLink, Bot, ShieldCheck, User } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LawyerHeader({
  setSidebarOpen,
  lawyerData = {},
  activeTabTitle = "Dashboard"
}) {
  const { theme, user } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <header className={`px-4 sm:px-8 py-3.5 border-b backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors ${
      isDark
        ? "bg-slate-900/90 border-slate-800"
        : "bg-[#f0f6fc]/90 border-blue-200/90 shadow-sm"
    }`}>
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl border border-blue-200 dark:border-slate-700 text-blue-950 dark:text-slate-200 hover:bg-[#dcebf6] dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-black text-blue-950 dark:text-white flex items-center gap-2">
            <span>{activeTabTitle}</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={11} />
              <span>Advocate Verified</span>
            </span>
          </h2>
          <p className="text-[11px] font-semibold text-blue-900/60 dark:text-slate-400 hidden sm:block">
            ApnaVakil Advocate Management & Practice Portal
          </p>
        </div>
      </div>

      {/* Right: Actions, Directory Link & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <Link
          to="/lawyers"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750"
              : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
          }`}
        >
          <ExternalLink size={13} />
          <span className="hidden md:inline">Public Directory</span>
        </Link>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <Bot size={14} />
          <span className="hidden sm:inline">AI Legal Assistant</span>
        </button>
      </div>
    </header>
  );
}
