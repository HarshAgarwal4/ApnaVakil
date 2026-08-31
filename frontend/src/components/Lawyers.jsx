import React from 'react';
import { useStore } from '../zustand/store';
import { UserCheck, PhoneCall, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Lawyers = () => {
  const { lawyer, setLawyer, theme } = useStore();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-4 overflow-auto rounded-2xl border transition-colors ${
        isDark
          ? "bg-slate-950/60 border-slate-800 text-slate-200"
          : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
      } ${lawyer.length === 0 ? 'h-[16vh]' : 'flex-1 min-h-[22vh]'}`}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200/90 dark:border-slate-800">
        <h3 className="font-black text-xs uppercase tracking-wider text-blue-950 dark:text-white flex items-center gap-1.5">
          <span>👨‍⚖️ Verified Advocates</span>
        </h3>
        <Link
          to="/lawyers"
          className="text-[11px] font-black text-blue-700 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {lawyer.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-blue-900/50 font-bold italic">No advocates matched to current prompt</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lawyer.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-200"
                  : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:border-blue-500 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black text-xs text-blue-950 dark:text-white">{item?.name}</p>
                  <p className="text-[11px] text-blue-900/60 font-semibold">{item?.speciality}</p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </div>
              {item.contact && (
                <a
                  href={`tel:${item.contact}`}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-indigo-400 hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{item.contact}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lawyers;
