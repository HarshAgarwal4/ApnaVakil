import React, { useState } from "react";
import { Clock, Bell, ShieldCheck, CheckCircle2, Lock, Save, Globe } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";

export default function LawyerSettingsTab() {
  const { theme } = useStore();
  const isDark = theme === "dark";

  const [isAcceptingInquiries, setIsAcceptingInquiries] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [consultationMode, setConsultationMode] = useState("both"); // 'virtual' | 'chamber' | 'both'
  const [workingHours, setWorkingHours] = useState("10:00 AM - 7:00 PM");
  const [workingDays, setWorkingDays] = useState("Monday to Saturday");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Chamber preferences and availability saved! ⚖️");
    }, 600);
  };

  return (
    <form
      onSubmit={handleSaveSettings}
      className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
      }`}
    >
      <div>
        <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white">
          Chamber Availability & Inquiries Configuration
        </h3>
        <p className="text-xs sm:text-sm text-blue-900/60 dark:text-slate-400 mt-0.5 font-medium">
          Control your inquiry intake status, consultation timings, and instant email alert preferences.
        </p>
      </div>

      {/* Inquiry Intake Status */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? "bg-slate-950 border-slate-800" : "bg-[#f4f9fd] border-blue-200"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-blue-950 dark:text-white">
              Accepting Direct Client Consultation Requests
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
              isAcceptingInquiries
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-600 dark:text-red-400"
            }`}>
              {isAcceptingInquiries ? "Active Intake" : "Paused"}
            </span>
          </div>
          <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-0.5 font-medium">
            When enabled, verified clients can transmit case queries to your Lawyer Panel and email.
          </p>
        </div>

        <input
          type="checkbox"
          checked={isAcceptingInquiries}
          onChange={(e) => setIsAcceptingInquiries(e.target.checked)}
          className="w-5 h-5 rounded text-blue-700 accent-blue-700 cursor-pointer"
        />
      </div>

      {/* Email Alerts on Inquiries */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
        isDark ? "bg-slate-950 border-slate-800" : "bg-[#f4f9fd] border-blue-200"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-blue-950 dark:text-white">
              Instant Email Notifications
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-indigo-300">
              Recommended
            </span>
          </div>
          <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-0.5 font-medium">
            Receive immediate email dispatch with client details whenever a new case inquiry is submitted.
          </p>
        </div>

        <input
          type="checkbox"
          checked={emailAlerts}
          onChange={(e) => setEmailAlerts(e.target.checked)}
          className="w-5 h-5 rounded text-blue-700 accent-blue-700 cursor-pointer"
        />
      </div>

      {/* Consultation Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Consultation Hours
          </label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="e.g. 10:00 AM - 7:00 PM"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Available Consultation Days
          </label>
          <input
            type="text"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            placeholder="e.g. Monday to Saturday"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>
      </div>

      {/* Consultation Mode */}
      <div>
        <label className="block text-xs font-bold mb-2 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
          Preferred Consultation Formats
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "both", title: "Virtual & Chamber", desc: "Video consultation and physical office meetings" },
            { id: "chamber", title: "In-Person Chamber Only", desc: "Physical consultations at office/court" },
            { id: "virtual", title: "Virtual Consultation Only", desc: "Secure video conference & phone" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setConsultationMode(mode.id)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                consultationMode === mode.id
                  ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                  : isDark
                  ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850"
                  : "bg-[#f4f9fd] border-blue-200 text-blue-950 hover:bg-[#e2edf7]"
              }`}
            >
              <h5 className="font-bold text-xs">{mode.title}</h5>
              <p className={`text-[11px] mt-0.5 leading-snug ${
                consultationMode === mode.id ? "text-blue-100" : "text-blue-900/60 dark:text-slate-400"
              }`}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 text-xs sm:text-sm flex items-center gap-2 active:scale-98 transition disabled:opacity-50 cursor-pointer"
        >
          <Save size={16} />
          <span>{isSaving ? "Saving Configuration..." : "Save Preferences"}</span>
        </button>
      </div>
    </form>
  );
}
