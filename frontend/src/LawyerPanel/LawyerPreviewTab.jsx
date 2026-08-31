import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Sparkles, ExternalLink, Award, MapPin, Building, BookOpen } from "lucide-react";
import { useStore } from "../zustand/store";

export default function LawyerPreviewTab({ formData, imagePreview }) {
  const { theme } = useStore();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-300"
          : "bg-[#e2edf7] border-blue-300 text-blue-950 shadow-xs"
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-700 dark:text-indigo-400 shrink-0" />
          <span>This is how your verified credentials appear to clients searching in the directory.</span>
        </div>
      </div>

      {/* Directory Card Preview */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400 mb-3">
          1. Public Directory Card Preview
        </h4>

        <div className="max-w-md">
          <div className={`group rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-100 shadow-xl"
              : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-md"
          }`}>
            <div>
              <div className="flex items-start gap-4 mb-5">
                <div className="relative shrink-0">
                  <img
                    src={imagePreview || "/profile.png"}
                    alt={formData.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-200 dark:border-slate-700 shadow-sm"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-black truncate text-blue-950 dark:text-white">
                    {formData.name || "Advocate Name"}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900/60 dark:text-slate-400 mt-0.5 truncate">
                    {formData.speciality || "High Court & Civil Advocate"}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {formData.categories?.slice(0, 3).map((cat, index) => (
                      <span
                        key={index}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDark
                            ? "bg-slate-800 border-slate-700 text-indigo-300"
                            : "bg-[#e2edf7] border-blue-300 text-blue-950 font-bold"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-blue-950/80 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
                {formData.desc || "Experienced legal practitioner specializing in comprehensive legal advisory and courtroom litigation."}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between pt-3 mb-4 border-t border-blue-200/90 dark:border-slate-800 text-xs font-bold text-blue-950 dark:text-slate-300">
                <span>💵 {formData.fee || "₹1,500 / session"}</span>
                <span>📍 {formData.city || "New Delhi"}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isDark
                      ? "border-slate-700 text-slate-200"
                      : "border-blue-300 text-blue-950"
                  }`}
                >
                  <span>View Profile</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  className="py-2.5 px-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Connect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Profile Sheet Preview */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400 mb-3">
          2. Complete Credentials Section Preview
        </h4>

        <div className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
          <div>
            <h4 className="text-base font-black text-blue-950 dark:text-white flex items-center gap-2">
              <BookOpen size={17} className="text-blue-700 dark:text-indigo-400" />
              <span>Practice Overview</span>
            </h4>
            <p className="text-xs sm:text-sm text-blue-900/80 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line font-medium">
              {formData.desc || "Dedicated advocate providing top-tier legal advice, dispute resolution, and appellate litigation."}
            </p>
          </div>

          <div className="pt-3 border-t border-blue-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 dark:text-white mb-2 flex items-center gap-1.5">
              <Award size={15} className="text-blue-700 dark:text-indigo-400" />
              <span>Specialized Domains & Practice Categories</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.categories?.map((cat, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-indigo-300"
                      : "bg-[#e2edf7] border-blue-300 text-blue-950"
                  }`}
                >
                  ⚖️ {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-blue-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 dark:text-white mb-2 flex items-center gap-1.5">
              <Building size={15} className="text-blue-700 dark:text-indigo-400" />
              <span>Courts & Jurisdictions</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(formData.courts ? formData.courts.split(",") : ["Supreme Court", "High Court"]).map((c, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-200"
                      : "bg-[#e2edf7] border-blue-300 text-blue-950"
                  }`}
                >
                  🏛️ {c.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
