import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import {
  LayoutDashboard,
  UserCheck,
  MessageSquare,
  MessageCircle,
  Eye,
  Settings,
  Bot,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  X
} from "lucide-react";

export default function LawyerSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingCount = 0,
  activeCount = 0,
  lawyerData = {}
}) {
  const { theme, user, logout } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const NAV_ITEMS = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "requests", label: "Incoming Inquiries", icon: MessageSquare, badge: pendingCount },
    { id: "chat", label: "Client Chat", icon: MessageCircle, badge: activeCount },
    { id: "profile", label: "Advocate Profile & BCI", icon: UserCheck },
    { id: "preview", label: "Public Profile Preview", icon: Eye },
    { id: "settings", label: "Chamber & Availability", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 shrink-0 z-50
          flex flex-col justify-between overflow-y-auto
          border-r transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-[#ebf4fa] border-blue-200/90 text-blue-950 shadow-sm"
          }
        `}
      >
        <div>
          {/* Top Logo & Title */}
          <div className="p-5 flex items-center justify-between border-b border-blue-200/80 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="ApnaVakil Logo"
                className="w-9 h-9 rounded-xl object-contain shadow-sm"
              />
              <div>
                <span className="text-base font-black tracking-tight text-blue-950 dark:text-white flex items-center gap-1">
                  <span>Apna</span>
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Vakil
                  </span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block -mt-0.5">
                  Advocate Panel
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Advocate Quick Badge Card */}
          <div className="p-4 mx-3 my-4 rounded-2xl border bg-[#f0f6fc] dark:bg-slate-950/60 border-blue-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={lawyerData.images || "/profile.png"}
                  alt={lawyerData.name || "Advocate"}
                  className="w-11 h-11 rounded-xl object-cover border border-blue-300 dark:border-slate-700"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                  <ShieldCheck size={10} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-blue-950 dark:text-white truncate">
                  {lawyerData.name || user?.name || "Advocate"}
                </h4>
                <p className="text-[10px] text-blue-900/60 dark:text-slate-400 truncate">
                  {lawyerData.barNumber ? `Bar ID: ${lawyerData.barNumber}` : "BCI Verified Member"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                    Free Advocate Workspace
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main App Switcher Card */}
          <div className="px-3 mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white text-left shadow-md shadow-blue-900/20 hover:opacity-95 active:scale-98 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white/20">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-black leading-tight">Main User App</h5>
                  <p className="text-[10px] text-blue-100 font-medium">AI Chat, Drafts & Research</p>
                </div>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 space-y-1.5">
            <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-blue-900/50 dark:text-slate-500">
              Lawyer Workspace
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-blue-800 text-white shadow-md shadow-blue-900/20"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                      : "text-blue-950 hover:bg-[#dcebf6]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-white text-blue-900"
                        : "bg-amber-500 text-slate-950"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Public Advocates Directory */}
            <button
              onClick={() => navigate("/lawyers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isDark
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-blue-950 hover:bg-[#dcebf6]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} />
                <span>Advocates Directory</span>
              </div>
              <span className="text-[10px] text-blue-900/50 dark:text-slate-400 font-semibold">
                View Only
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-blue-200/80 dark:border-slate-800 space-y-2">
          {/* AI Legal Assistant Link */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-100/70 hover:bg-blue-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-750 text-blue-950 dark:text-indigo-300 border border-blue-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Bot size={16} className="text-blue-700 dark:text-indigo-400" />
            <span>AI Legal Assistant (User App)</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
          >
            <LogOut size={15} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
