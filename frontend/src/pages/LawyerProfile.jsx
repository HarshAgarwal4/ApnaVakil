import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import axios from "../services/axios";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  Globe,
  Share2,
  Send,
  Sparkles,
  Lock,
  ExternalLink
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, user } = useStore();
  const isDark = theme === "dark";

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consultation Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCaseType, setInquiryCaseType] = useState("Civil Dispute");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (!inquiryName) setInquiryName(user.name || "");
      if (!inquiryEmail) setInquiryEmail(user.email || "");
      if (!inquiryPhone) setInquiryPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    fetchLawyerDetails();
  }, [id]);

  const fetchLawyerDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/lawyer/${id}`);
      if (res.data?.status === 1 && res.data?.lawyer) {
        setLawyer(res.data.lawyer);
      } else {
        // Fallback: fetch from general lawyers list
        const allRes = await axios.get("/fetchLawyer");
        if (allRes.data?.lawyers) {
          const match = allRes.data.lawyers.find(
            (l) => l._id === id || l.email === id
          );
          if (match) setLawyer(match);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeContactDetails = (text) => {
    if (!text) return "";
    let clean = text.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[Contact Info Restricted]");
    clean = clean.replace(/\b[6-9]\d{9}\b/g, "[Phone Restricted]");
    clean = clean.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[Email Restricted]");
    return clean;
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) {
      toast.error("Please describe your legal matter");
      return;
    }

    const sanitizedMessage = sanitizeContactDetails(inquiryMessage);

    setIsSubmitting(true);
    try {
      const res = await axios.post("/askLawyer", {
        email: lawyer.email,
        query: sanitizedMessage,
        name: inquiryName || user?.name || "ApnaVakil Client",
        clientEmail: user?.email || "",
        caseType: inquiryCaseType,
      });

      if (res.status === 200 && res.data.status === 1) {
        toast.success("Consultation inquiry transmitted securely to Advocate! ⚖️");
        setInquiryMessage("");
      } else {
        toast.error(res.data?.msg || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to transmit consultation inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-slate-950 text-white" : "bg-[#eaf2f8] text-blue-950"
      }`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400">
            Loading Advocate Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        isDark ? "bg-slate-950 text-white" : "bg-[#eaf2f8] text-blue-950"
      }`}>
        <h2 className="text-xl font-bold mb-2">Advocate Profile Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested advocate credentials could not be loaded.</p>
        <Link
          to="/lawyers"
          className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          ← Return to Advocate Directory
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-[#eaf2f8] text-blue-950"
    }`}>
      {/* Top Header */}
      <header className={`px-4 sm:px-8 py-3.5 border-b backdrop-blur-md sticky top-0 z-40 flex items-center justify-between transition-colors ${
        isDark ? "bg-slate-900/90 border-slate-800" : "bg-[#f0f6fc]/90 border-blue-200/90 shadow-sm"
      }`}>
        <div className="flex items-center gap-3">
          <Link
            to="/lawyers"
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Directory</span>
          </Link>

          <div className="h-4 w-px bg-blue-300 dark:bg-slate-700 hidden sm:block" />

          <h2 className="text-sm sm:text-base font-black truncate text-blue-950 dark:text-white">
            {lawyer.name}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="px-3 py-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95"
          >
            🤖 AI Legal Assistant
          </Link>
        </div>
      </header>

      {/* Main Profile Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* HERO BANNER CARD */}
        <div className={`p-6 sm:p-9 rounded-3xl border relative overflow-hidden transition-all shadow-md mb-8 ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-gradient-to-b from-[#dcebf6] via-[#e2edf7] to-[#eaf2f8] border-blue-200/90 text-blue-950"
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={lawyer.images || "/profile.png"}
                  alt={lawyer.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-3 border-blue-300 dark:border-slate-700 shadow-xl"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                  <ShieldCheck size={16} />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 dark:text-white">
                    {lawyer.name}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Bar Council Verified</span>
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-blue-900/70 dark:text-slate-300 mt-1">
                  {lawyer.speciality || "High Court & Appellate Advocate"}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-blue-900/60 dark:text-slate-400 mt-2">
                  {lawyer.barNumber && (
                    <span className="flex items-center gap-1">
                      <Award size={14} className="text-blue-700 dark:text-indigo-400" />
                      <span>Bar ID: <strong>{lawyer.barNumber}</strong></span>
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <BookOpen size={14} className="text-blue-700 dark:text-indigo-400" />
                    <span>{lawyer.experience || "5+ Years"} Practice</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-blue-700 dark:text-indigo-400" />
                    <span>{lawyer.city || "New Delhi"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Consultation Fee Badge */}
            <div className={`p-4 rounded-2xl border text-center self-stretch sm:self-auto ${
              isDark ? "bg-slate-800/90 border-slate-700" : "bg-[#f0f6fc] border-blue-300 shadow-sm"
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400 block">
                Standard Consultation Fee
              </span>
              <span className="text-xl font-black text-blue-950 dark:text-white mt-0.5 block">
                {lawyer.fee || "₹1,500 / consultation"}
              </span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN CONTENT & BOOKING FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 7 COLS: CREDENTIALS & DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bio Section */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
            }`}>
              <h3 className="text-base font-black uppercase tracking-wider text-blue-950 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-700 dark:text-indigo-400" />
                <span>Professional Background & Overview</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-blue-950/80 dark:text-slate-300 font-medium whitespace-pre-line">
                {lawyer.desc || "Experienced advocate dedicated to delivering precise statutory defense, comprehensive corporate advisory, and effective dispute resolution across civil and criminal jurisdictions."}
              </p>
            </div>

            {/* Practice Areas / Categories */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
            }`}>
              <h3 className="text-base font-black uppercase tracking-wider text-blue-950 dark:text-white mb-3.5 flex items-center gap-2">
                <Award size={18} className="text-blue-700 dark:text-indigo-400" />
                <span>Practice Areas & Domains</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.categories?.map((cat, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border ${
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

            {/* Courts Practicing In */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
            }`}>
              <h3 className="text-base font-black uppercase tracking-wider text-blue-950 dark:text-white mb-3.5 flex items-center gap-2">
                <Building size={18} className="text-blue-700 dark:text-indigo-400" />
                <span>Courts of Practice & Jurisdiction</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(lawyer.courts) ? lawyer.courts : ["High Court of Judicature", "District & Sessions Courts", "Tribunals"]).map((court, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-200"
                        : "bg-[#e2edf7] border-blue-300 text-blue-950"
                    }`}
                  >
                    🏛️ {court}
                  </span>
                ))}
              </div>
            </div>

            {/* Chamber Details */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
            }`}>
              <h3 className="text-base font-black uppercase tracking-wider text-blue-950 dark:text-white mb-3.5 flex items-center gap-2">
                <MapPin size={18} className="text-blue-700 dark:text-indigo-400" />
                <span>Chamber & Office Location</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-semibold text-blue-900/70 dark:text-slate-300">
                <p>📍 {lawyer.address || `Lawyers Chamber Block, ${lawyer.city || "New Delhi"}, India`}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  🛡️ Verified Platform Confidential Channel Active
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: INQUIRY / CONNECT FORM */}
          <div className="lg:col-span-5">
            {user?.role === "lawyer" ? (
              <div className={`p-6 sm:p-7 rounded-3xl border text-center space-y-4 ${
                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
              }`}>
                <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-indigo-400 w-fit mx-auto">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-blue-950 dark:text-white">
                    Advocate Colleague View
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mt-1 inline-block">
                    Verified Advocate Network
                  </span>
                </div>
                <p className="text-xs text-blue-900/70 dark:text-slate-300 leading-relaxed font-medium">
                  You are viewing this advocate's verified public credentials as a colleague on the platform. Direct case inquiries are reserved for client accounts.
                </p>

                <div className="pt-2 space-y-2.5">
                  <Link
                    to="/lawyer/dashboard"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Go to Your Lawyer Panel</span>
                  </Link>

                  <Link
                    to="/lawyers"
                    className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isDark
                        ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                        : "border-blue-300 text-blue-950 hover:bg-[#e2edf7]"
                    }`}
                  >
                    <span>Browse All Advocates</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm sticky top-24 transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
              }`}>
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-700 text-white shadow-xs">
                    Verified In-App Consultation
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white mt-2">
                    Request Case Consultation
                  </h3>
                  <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                    Submit your query directly to {lawyer.name}. Your details are securely transmitted for advocate case review.
                  </p>
                </div>

                {/* Confidentiality Alert */}
                <div className={`p-3 rounded-2xl border mb-4 text-xs flex items-start gap-2 ${
                  isDark
                    ? "bg-slate-950 border-blue-900/50 text-slate-300"
                    : "bg-blue-100/60 border-blue-200 text-blue-950"
                }`}>
                  <Lock size={15} className="text-blue-700 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-snug text-[11px] font-semibold">
                    <strong>Confidentiality Protection:</strong> Direct personal contact details are restricted to protect client-attorney confidentiality. All consultation updates are tracked inside ApnaVakil.
                  </p>
                </div>

                <form onSubmit={handleSendInquiry} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-blue-950 dark:text-slate-300">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Amit Kumar"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition ${
                        isDark
                          ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                          : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-blue-950 dark:text-slate-300">
                      Case Matter / Domain
                    </label>
                    <select
                      value={inquiryCaseType}
                      onChange={(e) => setInquiryCaseType(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition ${
                        isDark
                          ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                          : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                      }`}
                    >
                      <option value="Civil Dispute">Civil Litigation / Dispute</option>
                      <option value="Criminal Defense">Criminal Law & Bail</option>
                      <option value="Corporate & Contract">Corporate / Contract Review</option>
                      <option value="Property Matter">Property & Real Estate</option>
                      <option value="Family / Matrimonial">Family / Matrimonial</option>
                      <option value="Other Legal Advisory">Other Legal Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-blue-950 dark:text-slate-300">
                      Case Description & Notice Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Briefly describe your legal issue, notice received, or courtroom stage..."
                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition resize-none ${
                        isDark
                          ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                          : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>{isSubmitting ? "Transmitting Query..." : "Transmit Consultation Request"}</span>
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-900/50 dark:text-slate-400">
                  <Lock size={12} />
                  <span>Protected under Advocate-Client Confidentiality Standards</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
