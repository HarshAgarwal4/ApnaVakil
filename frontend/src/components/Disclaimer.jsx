import React from "react";
import { ArrowLeft, AlertCircle, ShieldAlert, Scale } from "lucide-react";
import { useStore } from "../zustand/store";

const Disclaimer = ({ disc, showdisc }) => {
  const { theme } = useStore();
  const isDark = theme === "dark";

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Back button */}
      <button
        onClick={() => showdisc(false)}
        className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white"
            : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:bg-[#dcebf6] shadow-xs"
        }`}
      >
        <ArrowLeft size={16} />
        <span>Back to Workspace</span>
      </button>

      {/* Main Card */}
      <div className={`rounded-2xl border transition-all shadow-xl overflow-hidden ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/40"
          : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-blue-900/5"
      }`}>
        {/* Card Header */}
        <div className={`flex items-center gap-3.5 px-6 py-4 border-b ${
          isDark ? "bg-slate-950/80 border-slate-800" : "bg-[#e2edf7] border-blue-300"
        }`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-blue-950 dark:text-white">
              Legal Disclaimer & Compliance Notice
            </h1>
            <p className="text-[11px] sm:text-xs text-blue-900/60 dark:text-slate-400 font-semibold">
              Applicable under Bar Council of India (BCI) Rule 36 & DPDP Act 2023
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed">
          <p className="text-blue-950/80 dark:text-slate-300 font-medium">
            The legal intelligence tools, automated drafting models, and statutory references provided on the <strong className="text-blue-950 dark:text-white font-black">ApnaVakil</strong> platform are built strictly for <strong>research, reference, and informational purposes only</strong>.
          </p>

          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark
              ? "bg-indigo-950/30 border-indigo-800/60 text-indigo-200"
              : "bg-[#dcebf6] border-blue-300 text-blue-950"
          }`}>
            <Scale className="w-5 h-5 text-blue-700 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="font-bold">
              ApnaVakil does not operate as a law firm and does not solicit legal representation or dispense formal legal counsel. No attorney-client relationship is created through the use of this portal.
            </p>
          </div>

          <p className="text-blue-950/80 dark:text-slate-300 font-medium">
            While our systems are continuously updated with the latest codified Indian statutes including the <strong>Bharatiya Nyaya Sanhita (BNS) 2023</strong>, <strong>BNSS 2023</strong>, and <strong>BSA 2023</strong>, legal precedents and local court procedures evolve rapidly. ApnaVakil makes no express or implied warranties regarding absolute judicial completeness or jurisdictional accuracy.
          </p>

          {/* Highlight Warning */}
          <div className={`rounded-xl border p-4 sm:p-5 ${
            isDark
              ? "bg-amber-950/30 border-amber-800/80 text-amber-200"
              : "bg-amber-50 border-amber-300 text-amber-950 shadow-xs"
          }`}>
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Mandatory Professional Verification</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed font-semibold">
              Users are strongly advised to review all AI-generated draft contracts, agreements, notices, and legal responses with a verified, licensed Advocate before filing in court, executing legally binding signatures, or taking definitive litigation action.
            </p>
          </div>

          <p className="text-blue-950 dark:text-slate-200 font-bold pt-2 border-t border-blue-200/90 dark:border-slate-800">
            By accessing or continuing to utilize ApnaVakil, you expressly agree that ApnaVakil, its operators, and affiliates bear no liability for outcomes arising from reliance on platform content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
