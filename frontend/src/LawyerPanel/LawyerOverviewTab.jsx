import React from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Sparkles,
  MapPin,
  Eye
} from "lucide-react";
import { useStore } from "../zustand/store";

export default function LawyerOverviewTab({
  lawyerData = {},
  requests = [],
  setActiveTab
}) {
  const { theme, user } = useStore();
  const isDark = theme === "dark";

  const totalInquiries = requests.length;
  const pendingInquiries = requests.filter((r) => r.status === "pending").length;
  const acceptedInquiries = requests.filter((r) => r.status === "accepted").length;
  const completedInquiries = requests.filter((r) => r.status === "completed").length;

  // Calculate profile completeness score
  let score = 30; // base score
  if (lawyerData.name) score += 10;
  if (lawyerData.barNumber) score += 20;
  if (lawyerData.phone) score += 10;
  if (lawyerData.desc && lawyerData.desc.length > 30) score += 10;
  if (lawyerData.categories && lawyerData.categories.length > 0) score += 10;
  if (lawyerData.images && lawyerData.images !== "/profile.png") score += 10;
  score = Math.min(score, 100);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all shadow-md ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-gradient-to-r from-[#dcebf6] via-[#e2edf7] to-[#eaf2f8] border-blue-200/90 text-blue-950"
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={lawyerData.images || "/profile.png"}
                alt={lawyerData.name || "Advocate"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-300 dark:border-slate-700 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-blue-950 dark:text-white">
                  Welcome, {lawyerData.name || user?.name || "Advocate"}! ⚖️
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-900/70 dark:text-slate-300 mt-0.5">
                {lawyerData.speciality || "Legal Advocate"} • {lawyerData.barNumber ? `Bar ID: ${lawyerData.barNumber}` : "Bar Council Enrollment Verification Active"}
              </p>
              <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin size={13} />
                <span>{lawyerData.city || "New Delhi"} Jurisdiction</span>
                <span>•</span>
                <span>{lawyerData.experience || "5+ Years"} Court Practice</span>
              </p>
            </div>
          </div>

          {/* Profile Completeness Gauge */}
          <div className={`p-4 rounded-2xl border min-w-[200px] ${
            isDark ? "bg-slate-950/80 border-slate-800" : "bg-[#f0f6fc] border-blue-300 shadow-xs"
          }`}>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-blue-950 dark:text-white flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                <span>Profile Strength</span>
              </span>
              <span className="text-blue-700 dark:text-indigo-400 font-black">{score}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            {score < 100 && (
              <button
                onClick={() => setActiveTab("profile")}
                className="text-[11px] font-bold text-blue-700 dark:text-indigo-400 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Complete missing credentials</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-900/60 dark:text-slate-400">Total Consultations</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-indigo-400">
              <MessageSquare size={16} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white">
            {totalInquiries}
          </h3>
          <span className="text-[11px] font-semibold text-blue-900/50 dark:text-slate-400 mt-1 block">
            Direct client queries received
          </span>
        </div>

        {/* Card 2 */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Pending Inquiries</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white">
            {pendingInquiries}
          </h3>
          <span className="text-[11px] font-semibold text-amber-700/70 dark:text-amber-400/70 mt-1 block">
            Requires your review & response
          </span>
        </div>

        {/* Card 3 */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Accepted & Connected</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white">
            {acceptedInquiries}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700/70 dark:text-emerald-400/70 mt-1 block">
            Active client consultations
          </span>
        </div>

        {/* Card 4 */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-900/60 dark:text-slate-400">Consultation Fee</span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400">
              <Award size={16} />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white truncate">
            {lawyerData.fee || "₹1,500 / session"}
          </h3>
          <span className="text-[11px] font-semibold text-blue-900/50 dark:text-slate-400 mt-1 block">
            Standard advisory rate
          </span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`p-5 rounded-3xl border text-left transition-all hover:-translate-y-1 cursor-pointer ${
            isDark
              ? "bg-slate-900 hover:bg-slate-850 border-slate-800"
              : "bg-[#f0f6fc] hover:bg-[#e2edf7] border-blue-200/90 shadow-xs"
          }`}
        >
          <div className="p-2.5 rounded-2xl bg-blue-700 text-white w-fit mb-3">
            <UserCheck size={18} />
          </div>
          <h4 className="font-bold text-sm text-blue-950 dark:text-white">Edit Profile & Credentials</h4>
          <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1">
            Update your Bar Council ID, practice categories, courts, and consultation fees.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`p-5 rounded-3xl border text-left transition-all hover:-translate-y-1 cursor-pointer ${
            isDark
              ? "bg-slate-900 hover:bg-slate-850 border-slate-800"
              : "bg-[#f0f6fc] hover:bg-[#e2edf7] border-blue-200/90 shadow-xs"
          }`}
        >
          <div className="p-2.5 rounded-2xl bg-amber-600 text-white w-fit mb-3">
            <MessageSquare size={18} />
          </div>
          <h4 className="font-bold text-sm text-blue-950 dark:text-white">Review Client Inquiries</h4>
          <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1">
            View case descriptions, contact client via phone/email, and accept consultations.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`p-5 rounded-3xl border text-left transition-all hover:-translate-y-1 cursor-pointer ${
            isDark
              ? "bg-slate-900 hover:bg-slate-850 border-slate-800"
              : "bg-[#f0f6fc] hover:bg-[#e2edf7] border-blue-200/90 shadow-xs"
          }`}
        >
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white w-fit mb-3">
            <Eye size={18} />
          </div>
          <h4 className="font-bold text-sm text-blue-950 dark:text-white">Public Profile Live Preview</h4>
          <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1">
            Preview how your credentials and card appear to clients in the advocate directory.
          </p>
        </button>
      </div>

      {/* Recent Inquiries List */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-blue-950 dark:text-white">
              Recent Case Consultations
            </h3>
            <p className="text-xs text-blue-900/60 dark:text-slate-400 font-medium">
              Latest inquiries submitted by clients through the ApnaVakil platform
            </p>
          </div>

          <button
            onClick={() => setActiveTab("requests")}
            className="text-xs font-bold text-blue-700 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({requests.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-blue-900/60 dark:text-slate-400 font-medium">
            No consultation inquiries received yet. When clients submit case inquiries, they will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req._id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isDark ? "bg-slate-950/60 border-slate-800" : "bg-[#f4f9fd] border-blue-200/80"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-blue-950 dark:text-white">{req.clientName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                      req.status === "pending"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : req.status === "accepted"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-900/70 dark:text-slate-300 font-medium mt-0.5 line-clamp-1">
                    "{req.message}"
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("requests")}
                  className="text-xs font-bold text-blue-700 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer"
                >
                  Manage Inquiry →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
