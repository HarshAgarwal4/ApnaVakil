import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";
import {
  ShieldCheck,
  ArrowRight,
  X,
  Send,
  MessageSquare,
  Lock,
  AlertTriangle
} from "lucide-react";

export default function LawyerCard({ lawyer }) {
  const { theme, user } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [caseType, setCaseType] = useState("General Legal Matter");

  // Trim description
  const getShortDesc = (text, limit = 120) => {
    if (!text) return "Experienced legal professional verified to assist with legal matters.";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  // Helper to mask any phone numbers / emails typed by user
  const sanitizeContactDetails = (text) => {
    if (!text) return "";
    let clean = text.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[Contact Info Restricted]");
    clean = clean.replace(/\b[6-9]\d{9}\b/g, "[Phone Restricted]");
    clean = clean.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[Email Restricted]");
    return clean;
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please provide your case matter or inquiry");
      return;
    }

    const sanitizedMessage = sanitizeContactDetails(message);

    setIsSending(true);
    try {
      const res = await axios.post("/askLawyer", {
        query: sanitizedMessage,
        email: lawyer.email,
        caseType,
        name: user?.name || "ApnaVakil Client",
        clientEmail: user?.email || "",
      });

      if (res.status === 200 && res.data.status === 1) {
        toast.success("Connection request sent securely to Advocate! ⚖️");
        setMessage("");
        setShowMessageBox(false);
      } else {
        toast.error(res.data?.msg || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div className={`group rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100 shadow-xl shadow-black/40 hover:border-indigo-500/60 hover:shadow-2xl"
          : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-md shadow-blue-900/5 hover:border-blue-500 hover:shadow-xl"
      }`}>

        <div>
          {/* Header with Avatar and Badges */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative shrink-0">
              <img
                src={lawyer.images || "/profile.png"}
                loading="lazy"
                alt={lawyer.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-200 dark:border-slate-700 shadow-sm"
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-black truncate text-blue-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-indigo-400 transition">
                  {lawyer.name}
                </h3>
              </div>
              <p className="text-xs font-semibold text-blue-900/60 dark:text-slate-400 mt-0.5 truncate">
                {lawyer.speciality || "High Court & Civil Advocate"}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {lawyer.categories?.slice(0, 3).map((cat, index) => (
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

          {/* Description */}
          <p className="text-blue-950/80 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
            {getShortDesc(lawyer.desc)}
          </p>
        </div>

        <div>
          {/* Fee and City Bar */}
          <div className="flex items-center justify-between pt-3 mb-4 border-t border-blue-200/90 dark:border-slate-800 text-xs font-bold text-blue-950 dark:text-slate-300">
            <span>💵 {lawyer.fee || "₹1,500 / session"}</span>
            <span>📍 {lawyer.city || "New Delhi"}</span>
          </div>

          {/* ACTION BUTTONS */}
          {user?.role === "lawyer" ? (
            <button
              onClick={() => navigate(`/lawyer/${lawyer._id}`)}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 active:scale-[0.99] transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigate(`/lawyer/${lawyer._id}`)}
                className={`py-2.5 px-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                    : "border-blue-300 text-blue-950 hover:bg-[#e2edf7]"
                }`}
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowMessageBox(true)}
                className="py-2.5 px-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 active:scale-[0.99] transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Connect</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Direct Connection & Message Modal */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border transition-all ${
            isDark
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-[#f0f6fc] border-blue-300 text-blue-950"
          }`}>
            <button
              onClick={() => setShowMessageBox(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <img
                src={lawyer.images || "/profile.png"}
                alt={lawyer.name}
                className="w-12 h-12 rounded-2xl object-cover border border-blue-200 dark:border-slate-700"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white">
                  Connect with {lawyer.name}
                </h2>
                <p className="text-xs text-blue-900/60 dark:text-slate-400 font-medium">
                  {lawyer.speciality || "Advocate"} • Verified Platform Consultation
                </p>
              </div>
            </div>

            {/* Platform Privacy & Confidentiality Banner */}
            <div className={`p-3 rounded-2xl border mb-4 text-xs flex items-start gap-2 ${
              isDark
                ? "bg-slate-950 border-blue-900/50 text-slate-300"
                : "bg-blue-100/60 border-blue-200 text-blue-950"
            }`}>
              <Lock size={15} className="text-blue-700 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px] font-semibold">
                <strong>Confidential Platform Advisory:</strong> To protect client confidentiality and prevent spam, direct personal contact details are restricted. Communications and consultation statuses are managed securely within ApnaVakil.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-blue-950 dark:text-slate-300">
                  Case Domain / Matter
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white"
                      : "bg-[#f4f9fd] border-blue-300 text-blue-950"
                  }`}
                >
                  <option value="General Legal Matter">General Legal Matter</option>
                  <option value="Criminal Law / Bail">Criminal Law & Bail Notice</option>
                  <option value="Civil & Property Dispute">Civil & Property Dispute</option>
                  <option value="Corporate & Contract">Corporate & Commercial Contract</option>
                  <option value="Family / Matrimonial Matter">Family / Matrimonial Matter</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-blue-950 dark:text-slate-300">
                  Describe Your Legal Query *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your legal matter, notice received, or courtroom stage..."
                  className={`w-full border-2 rounded-2xl p-3 outline-none resize-none text-xs sm:text-sm font-semibold transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                      : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700 focus:bg-white shadow-xs"
                  }`}
                  rows="4"
                />
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white font-bold rounded-2xl shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={15} />
              <span>{isSending ? "Transmitting..." : "Transmit Connection Request"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}