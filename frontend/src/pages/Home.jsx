import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  FileText,
  Gavel,
  ArrowRight,
  CheckCircle2,
  Zap,
  Search,
  Users,
  BookOpen,
  Building2,
  Cpu,
  HelpCircle,
  Send,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Lock,
  BadgeCheck,
  Compass,
  FileCheck,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { useStore } from '../zustand/store';
import { HashLink } from "react-router-hash-link";
import ThemeToggle from '../components/ThemeToggle';
import LoadingPage from '../components/Loading';

const Home = () => {
  const { user, loading, theme } = useStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // Search query & interactive tabs & mobile navbar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");
  const [activeDocTab, setActiveDocTab] = useState("rental");
  const [openFaq, setOpenFaq] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  useEffect(() => {
    if (user && loading === false) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingPage />;

  const sampleLegalQueries = [
    "Tenant refusing to vacate after lease expiry",
    "Notice for Cheque Bounce under Section 138 NI Act",
    "BNS Section 69 key definitions & defenses",
    "Drafting mutual Non-Disclosure Agreement (NDA)",
    "Consumer court complaint for defective electronics"
  ];

  const legalDomains = [
    { icon: Gavel, title: "Criminal Law (BNS 2023)", desc: "Bail provisions, FIR procedures, and Bharatiya Nyaya Sanhita compliance." },
    { icon: Building2, title: "Property & Tenancy", desc: "Residential leases, eviction notices, registry, and title verification." },
    { icon: FileText, title: "Contracts & Corporate", desc: "Founders' agreements, NDAs, SaaS MSAs, and employment covenants." },
    { icon: Scale, title: "Civil & Consumer Disputes", desc: "Deficiency in service claims, recovery suits, and legal notices." },
    { icon: ShieldCheck, title: "Cyber & IT Law", desc: "DPDP Act 2023 compliance, digital fraud, and unauthorized access." },
    { icon: Users, title: "Family & Matrimonial", desc: "Mutual consent divorce, maintenance, succession, and child custody laws." },
  ];

  const documentTemplates = {
    rental: {
      title: "Residential Tenancy Agreement",
      jurisdiction: "Indian Registration & Stamp Duty Act Compliant",
      clauses: [
        "1. Term of Lease: 11 Months with mandatory 1-month notice period.",
        "2. Security Deposit: ₹50,000 refundable upon handover in pristine condition.",
        "3. Permitted Use: Exclusively residential purposes; no commercial sub-leasing.",
        "4. Maintenance & Utilities: Electricity & water charges payable by Tenant as per meter."
      ],
      aiNotes: "Standard 11-month clause prevents compulsory registration in most Indian states."
    },
    nda: {
      title: "Mutual Non-Disclosure Agreement",
      jurisdiction: "Indian Contract Act, 1872",
      clauses: [
        "1. Definition of Confidential Information: Proprietary trade secrets, source code, financial metrics.",
        "2. Non-Disclosure Obligations: 3-year term following termination of discussions.",
        "3. Exclusions from Confidentiality: Publicly known data or independently developed tech.",
        "4. Dispute Resolution: Binding arbitration under Arbitration & Conciliation Act, 1996 in New Delhi."
      ],
      aiNotes: "Includes bilateral IP protection and enforceability across Indian high courts."
    },
    notice: {
      title: "Legal Notice for Recovery of Dues",
      jurisdiction: "Civil Procedure Code, 1908",
      clauses: [
        "1. Notice Demand: Immediate payment of outstanding ₹1,20,000 within 15 calendar days.",
        "2. Interest Claim: 18% per annum commercial interest from due date.",
        "3. Legal Escalation: Failure to comply will result in summary civil suit under Order 37 CPC.",
        "4. Cost of Notice: ₹5,000 legal notice drafting fees added to principal liability."
      ],
      aiNotes: "Strict 15-day statutory timeline provides foundation for fast-track summary suits."
    },
    affidavit: {
      title: "General Verification Affidavit",
      jurisdiction: "Notary Act & Indian Oaths Act, 1969",
      clauses: [
        "1. Deponent Identity: Self-attested identity proof with Aadhaar number record.",
        "2. Statement of Truth: Full verification that statements made in para 1 to 4 are true to best of knowledge.",
        "3. Penal Consequences: Acknowledging liability under Section 227 BNS for false statements.",
        "4. Execution: Sworn and signed before an authorized Oath Commissioner or Notary Public."
      ],
      aiNotes: "Complies with sworn evidentiary standards for Indian district and high court submissions."
    }
  };

  const faqs = [
    {
      q: "Is ApnaVakil a certified law firm or substitute for a lawyer?",
      a: "No. ApnaVakil is an advanced legal technology platform. In strict compliance with the Advocates Act 1961 and Bar Council of India Rule 36, ApnaVakil provides automated legal information, statutory citations, and draft templates. We recommend consulting our directory of licensed advocates for formal court representation."
    },
    {
      q: "Are the AI drafts compliant with the new criminal laws (BNS / BNSS 2023)?",
      a: "Yes! ApnaVakil's legal engine has been updated to incorporate the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) alongside classic statutory codes."
    },
    {
      q: "How is my confidential legal data and uploaded contracts protected?",
      a: "All user prompts, uploaded documents, and generated drafts are secured with bank-grade 256-bit SSL encryption in transit and AES-256 at rest. In compliance with the Digital Personal Data Protection Act (DPDP) 2023, your private legal files are never sold or used for public AI training."
    },
    {
      q: "Can I print, download, or edit the legal documents I generate?",
      a: "Yes. Once you generate a document in the dashboard, you have full ownership and perpetual rights to edit, export as PDF, print, or attach it to official correspondence."
    },
  ];

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!heroQuery.trim()) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard', { state: { initialPrompt: heroQuery } });
    }
  };

  const handleContactSubmit = async (data) => {
    try {
      const res = await axios.post('/contact', data);
      if (res.status === 200) {
        if (res.data.status === 1) {
          toast.success("Thank you! Your message has been sent to our legal desk ✉️");
          reset();
        } else if (res.data.status === 7) {
          toast.error("Please fill in all valid fields.");
        } else {
          toast.error("Unable to submit message. Please try again.");
        }
      }
    } catch (err) {
      toast.error("Server error. Please reach out to support@apnavakil.in");
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 overflow-x-hidden ${
      isDark ? "bg-[#090D16] text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>

      {/* ================= TOP RESPONSIVE NAVBAR ================= */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b shadow-sm transition-all duration-300 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 shadow-black/40"
          : "bg-white/95 border-slate-200 shadow-slate-200/50"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/logo.png"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                alt="ApnaVakil Logo"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-[#090D16] rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className={`text-base sm:text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Apna<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Vakil</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">Indian Legal Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav Menu */}
          <div className={`hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-medium ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}>
            <a className="hover:text-indigo-500 transition-colors" href="#Home">Home</a>
            <a className="hover:text-indigo-500 transition-colors" href="#workspace">AI Workspace</a>
            <a className="hover:text-indigo-500 transition-colors" href="#domains">Legal Domains</a>
            <a className="hover:text-indigo-500 transition-colors" href="#working">How It Works</a>
            <a className="hover:text-indigo-500 transition-colors" href="#lawyers">Lawyers</a>
            <a className="hover:text-indigo-500 transition-colors" href="#faq">FAQ</a>
            <a className="hover:text-indigo-500 transition-colors" href="#contact">Contact</a>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />

            <Link
              to="/login"
              className={`hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isDark
                  ? "text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex relative group px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white overflow-hidden shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:opacity-90 transition-opacity" />
              <div className="relative flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>Try AI Assistant</span>
              </div>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`lg:hidden border-b overflow-hidden px-4 py-4 space-y-3 shadow-2xl backdrop-blur-2xl ${
                isDark
                  ? "bg-slate-900/95 border-slate-800 text-slate-200"
                  : "bg-white/98 border-slate-200 text-slate-800"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <a
                  href="#Home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>🏠 Home</span>
                </a>
                <a
                  href="#workspace"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>✨ AI Workspace</span>
                </a>
                <a
                  href="#domains"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>⚖️ Legal Domains</span>
                </a>
                <a
                  href="#working"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>⚡ How It Works</span>
                </a>
                <a
                  href="#lawyers"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>👨‍⚖️ Advocates</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>❓ FAQs</span>
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>✉️ Contact Desk</span>
                </a>
                <Link
                  to="/disclaimer"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-2 ${
                    isDark ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span>📜 Disclaimer</span>
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold border transition ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                      : "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                >
                  Sign Up Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        id="Home"
        className={`relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 overflow-hidden transition-colors ${
          isDark ? "bg-[#090D16]" : "bg-slate-50/80"
        }`}
      >
        {/* Ambient Grid and Glow Mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,#6366f110_1px,transparent_1px),linear-gradient(to_bottom,#6366f110_1px,transparent_1px)]"
          } bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]`} />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          
          {/* Top Trust & Compliance Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/25 text-xs sm:text-sm font-bold text-indigo-400 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">Indian Legal Intelligence:</span>
            <span>Updated with Bharatiya Nyaya Sanhita (BNS) 2023</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12]">
              <span className={`block ${isDark ? "text-white" : "text-slate-900"}`}>
                Instant Legal Clarity.
              </span>
              <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Powered by Indian Legal AI.
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`max-w-3xl mx-auto text-xs sm:text-base md:text-lg leading-relaxed pt-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Draft contracts, analyze court procedures, decode legal notices, and consult verified advocates across India with 256-bit bank-grade security and full BCI Rule 36 compliance.
            </p>
          </div>

          {/* Quick Action Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { label: "📄 Draft Rental Agreement", query: "Draft a 11-month residential rental agreement in Delhi with 10% annual escalation" },
              { label: "⚖️ BNS 2023 Cheque Bounce", query: "Draft legal notice for dishonour of cheque under Section 138 NI Act and BNS" },
              { label: "🛡️ Mutual Non-Disclosure Agreement", query: "Draft a mutual NDA for a tech startup under Indian Contract Act 1872" },
              { label: "👨‍⚖️ Consult High Court Advocate", query: "Connect with verified civil litigation advocates in Mumbai High Court" },
            ].map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroQuery(action.query)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Hero Interactive AI Query Search Box */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleHeroSearch} className={`relative flex items-center rounded-2xl p-1.5 sm:p-2 border shadow-2xl transition-all ${
              isDark
                ? "bg-slate-900/95 border-slate-700 shadow-indigo-950/40 focus-within:border-indigo-500 ring-1 ring-white/5"
                : "bg-white border-slate-300 shadow-xl shadow-slate-200/80 focus-within:border-indigo-500"
            }`}>
              <div className="pl-3 sm:pl-4 text-indigo-500">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Ask any legal question (e.g., 'Eviction notice for tenant under Delhi Rent Control')..."
                className={`w-full bg-transparent px-3 py-2 sm:py-3 text-xs sm:text-sm md:text-base outline-none ${
                  isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
                }`}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-500/25 transition active:scale-95"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            {/* Quick Sample Query Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-[11px] sm:text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Trending queries:</span>
              {sampleLegalQueries.slice(0, 3).map((query, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroQuery(query)}
                  className={`px-2.5 py-1 rounded-lg border text-left transition-all ${
                    isDark
                      ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-indigo-500"
                      : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 shadow-sm"
                  }`}
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto pt-2">
            <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 text-left ${
              isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white/70 border-slate-200/80"
            }`}>
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">BCI Rule 36</p>
                <p className="text-[10px] text-slate-400">Directory Compliant</p>
              </div>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 text-left ${
              isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white/70 border-slate-200/80"
            }`}>
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">256-Bit SSL</p>
                <p className="text-[10px] text-slate-400">DPDP Act 2023 Secure</p>
              </div>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 text-left ${
              isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white/70 border-slate-200/80"
            }`}>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">&lt; 30s Drafts</p>
                <p className="text-[10px] text-slate-400">Automated Drafting</p>
              </div>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 text-left ${
              isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white/70 border-slate-200/80"
            }`}>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">1,200+ Acts</p>
                <p className="text-[10px] text-slate-400">Central & State Indexed</p>
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics Grid Cards */}
          <div className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all hover:scale-105 ${
              isDark ? "bg-slate-900/80 border-slate-800 shadow-lg" : "bg-white border-slate-200 shadow-md shadow-slate-100"
            }`}>
              <p className="text-2xl sm:text-3xl font-black text-indigo-500">50,000+</p>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Legal Queries Solved</p>
            </div>
            <div className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all hover:scale-105 ${
              isDark ? "bg-slate-900/80 border-slate-800 shadow-lg" : "bg-white border-slate-200 shadow-md shadow-slate-100"
            }`}>
              <p className="text-2xl sm:text-3xl font-black text-purple-500">99.4%</p>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">BNS & IPC Precision</p>
            </div>
            <div className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all hover:scale-105 ${
              isDark ? "bg-slate-900/80 border-slate-800 shadow-lg" : "bg-white border-slate-200 shadow-md shadow-slate-100"
            }`}>
              <p className="text-2xl sm:text-3xl font-black text-pink-500">256-Bit</p>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Bank-Grade Privacy</p>
            </div>
            <div className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all hover:scale-105 ${
              isDark ? "bg-slate-900/80 border-slate-800 shadow-lg" : "bg-white border-slate-200 shadow-md shadow-slate-100"
            }`}>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500">100%</p>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Advocate Verified</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= INTERACTIVE AI LEGAL WORKSPACE PREVIEW ================= */}
      <section id="workspace" className={`py-12 sm:py-20 md:py-24 border-y transition-colors ${
        isDark ? "bg-[#0B0F19] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Demo</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              AI Legal Drafting in Real-Time
            </h2>
            <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Select a legal document to see how ApnaVakil formats enforceable clauses compliant with Indian statutes.
            </p>
          </div>

          {/* Document Tab Switchers */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[
              { id: "rental", label: "Rental Agreement", icon: Building2 },
              { id: "nda", label: "Mutual NDA", icon: Lock },
              { id: "notice", label: "Legal Notice", icon: Gavel },
              { id: "affidavit", label: "Court Affidavit", icon: FileCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDocTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeDocTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : isDark
                    ? "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Document Live Simulation Card */}
          <div className={`rounded-3xl border p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              
              {/* Document Paper Mockup */}
              <div className={`flex-1 w-full rounded-2xl p-4 sm:p-6 border font-mono text-xs sm:text-sm space-y-3 sm:space-y-4 shadow-inner ${
                isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-indigo-500 text-xs sm:text-sm truncate mr-2">
                    {documentTemplates[activeDocTab].title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-sans font-semibold shrink-0">
                    ✓ Validated
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs font-sans text-slate-500">
                  <strong>Jurisdiction:</strong> {documentTemplates[activeDocTab].jurisdiction}
                </p>

                <div className="space-y-2 sm:space-y-2.5 font-sans">
                  {documentTemplates[activeDocTab].clauses.map((clause, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg border ${
                      isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <p className="text-[11px] sm:text-xs leading-relaxed">{clause}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assistant Side Analysis */}
              <div className="w-full md:w-80 space-y-3 sm:space-y-4">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? "bg-indigo-950/40 border-indigo-500/30" : "bg-indigo-50 border-indigo-200"
                }`}>
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Compliance Check</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {documentTemplates[activeDocTab].aiNotes}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                  >
                    <span>Customize in AI Drafter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/lawyers')}
                    className={`w-full py-2 sm:py-2.5 rounded-xl border font-semibold text-xs sm:text-sm transition ${
                      isDark
                        ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Verify with Advocate
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 12 KEY LEGAL DOMAINS ================= */}
      <section id="domains" className={`py-12 sm:py-20 md:py-24 transition-colors ${
        isDark ? "bg-[#090D16]" : "bg-slate-50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-14">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Comprehensive Indian Legal Coverage
            </h2>
            <p className={`text-xs sm:text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              From civil recovery to criminal bail, our AI model is trained on thousands of Indian High Court & Supreme Court precedents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {legalDomains.map((domain, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/dashboard')}
                className={`group p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 shadow-xl shadow-black/30"
                    : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl shadow-sm"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <domain.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-1.5 group-hover:text-indigo-500 transition-colors ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {domain.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {domain.desc}
                </p>
                <div className="mt-3.5 flex items-center gap-1.5 text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                  <span>Explore Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="working" className={`py-12 sm:py-20 md:py-24 border-y transition-colors ${
        isDark ? "bg-[#0B0F19] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-14">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              How ApnaVakil Works in 3 Simple Steps
            </h2>
            <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Get from legal dilemma to a finalized draft in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center relative">
            
            {/* Step 1 */}
            <div className={`p-5 sm:p-6 rounded-3xl border ${
              isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg sm:text-xl mb-3 sm:mb-4 shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                State Your Legal Query
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Type your issue in plain English, Hindi, or conversational text. No legal jargon required.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-5 sm:p-6 rounded-3xl border ${
              isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center font-black text-lg sm:text-xl mb-3 sm:mb-4 shadow-lg shadow-purple-600/30">
                2
              </div>
              <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                AI Analyzes Statutes & Drafts
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our system cross-references BNS, CPC, CrPC, and case laws to formulate valid statutory clauses.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-5 sm:p-6 rounded-3xl border ${
              isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center font-black text-lg sm:text-xl mb-3 sm:mb-4 shadow-lg shadow-pink-600/30">
                3
              </div>
              <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                Download, Print or Consult
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Export your document or instantly connect with an advocate for court representation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= VERIFIED ADVOCATES ================= */}
      <section id="lawyers" className={`py-12 sm:py-20 md:py-24 transition-colors ${
        isDark ? "bg-[#090D16]" : "bg-slate-50"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 sm:mb-12">
            <div className="text-left space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                Verified Advocate Network
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Connect directly with experienced advocates enrolled in State Bar Councils.
              </p>
            </div>

            <Link
              to="/lawyers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              <span>View All Advocates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                name: "Adv. Rahul Sharma",
                exp: "12+ Years Exp",
                court: "Delhi High Court • Supreme Court",
                specialty: "Criminal Defense, BNS & Commercial Litigation",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              },
              {
                name: "Adv. Priya Deshmukh",
                exp: "9+ Years Exp",
                court: "Bombay High Court • NCLT",
                specialty: "Corporate M&A, Intellectual Property & Tech Law",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              },
              {
                name: "Adv. Ananya Iyer",
                exp: "14+ Years Exp",
                court: "Karnataka High Court • DRT",
                specialty: "Property Disputes, RERA & Consumer Protection",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              }
            ].map((lawyer, i) => (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isDark
                    ? "bg-slate-900/70 border-slate-800 hover:border-indigo-500/40"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img src={lawyer.img} alt={lawyer.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-500" />
                  <div>
                    <h3 className={`font-bold text-xs sm:text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{lawyer.name}</h3>
                    <p className="text-[10px] sm:text-[11px] text-indigo-500 font-semibold">{lawyer.exp}</p>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1">{lawyer.court}</p>
                <p className={`text-xs font-medium mb-3.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{lawyer.specialty}</p>
                <button
                  onClick={() => navigate('/lawyers')}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-xs font-bold transition"
                >
                  Book Consultation
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className={`py-12 sm:py-20 md:py-24 border-y transition-colors ${
        isDark ? "bg-[#0B0F19] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Clear answers regarding technology, Bar Council compliance, and security.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isDark
                      ? "bg-slate-900/60 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm md:text-base"
                  >
                    <span className={isDark ? "text-white" : "text-slate-900"}>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                          isDark ? "text-slate-300 border-slate-800" : "text-slate-600 border-slate-200"
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className={`py-12 sm:py-20 md:py-24 transition-colors ${
        isDark ? "bg-[#090D16]" : "bg-slate-50"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            {/* Left Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  Connect With ApnaVakil
                </h2>
                <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Have questions about partnership, API integrations, enterprise accounts, or general feedback? Our legal desk responds within 24 hours.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] sm:text-[11px]">Direct Legal Inquiries</p>
                    <a href="mailto:support@apnavakil.in" className="font-bold text-indigo-500 hover:underline">
                      support@apnavakil.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] sm:text-[11px]">Phone Support</p>
                    <p className="font-bold">+91 8949841606</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] sm:text-[11px]">Principal Desk</p>
                    <p className="font-bold">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className={`p-5 sm:p-7 md:p-8 rounded-3xl border shadow-2xl ${
              isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Send a Direct Inquiry
              </h3>
              
              <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Full Name</label>
                  <input
                    {...register("name", { required: "Full name is required" })}
                    type="text"
                    placeholder="e.g. Rahul Gupta"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">• {errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                    })}
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">• {errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Message or Query</label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    rows="3"
                    placeholder="How can we assist you with legal intelligence or advocate partnerships?"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                    }`}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs mt-1">• {errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? "Dispatching..." : "Send Message to Legal Desk"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HIGH-END PROFESSIONAL FOOTER ================= */}
      <footer className={`border-t pt-8 pb-14 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
        isDark ? "bg-slate-950 border-slate-800/80 text-slate-400" : "bg-slate-900 text-slate-400"
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-6 border-b border-slate-800 pb-6">
          
          {/* Column 1 & 2: Branding & Compliance Seal */}
          <div className="sm:col-span-2 space-y-2.5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <img src="/logo.png" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="logo" />
              Apna<span className="text-indigo-400">Vakil</span>
            </h3>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              India's AI legal assistant empowering citizens, startups, and legal professionals with rapid statutory analysis under BNS 2023, automated drafts, and verified advocate access.
            </p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                BCI Rule 36 & DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          {/* Column 3: Product Navigation */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">Product</h4>
            <ul className="space-y-1.5">
              <li><HashLink smooth to="/#workspace" className="hover:text-indigo-400 transition-colors">AI Drafter Demo</HashLink></li>
              <li><HashLink smooth to="/#domains" className="hover:text-indigo-400 transition-colors">Legal Domains</HashLink></li>
              <li><Link to="/lawyers" className="hover:text-indigo-400 transition-colors">Verified Lawyers</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">AI Legal Assistant</Link></li>
            </ul>
          </div>

          {/* Column 4: Official Legal Policies */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">Legal & Policies</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/disclaimer" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>⚖️ Statutory Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>📋 Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>🛡️ Privacy Policy (DPDP)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Quick Access */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">Help & Access</h4>
            <ul className="space-y-1.5">
              <li><a href="mailto:support@apnavakil.in" className="hover:text-indigo-400 transition-colors">support@apnavakil.in</a></li>
              <li><Link to="/signup" className="hover:text-indigo-400 transition-colors">Create Free Profile</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link></li>
              <li><HashLink smooth to="/#contact" className="hover:text-indigo-400 transition-colors">Contact Legal Desk</HashLink></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} ApnaVakil AI Platform. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* ================= FIXED CONTINUOUS MOVING STATUTORY DISCLAIMER TICKER ================= */}
      <aside
        aria-label="Statutory Legal Disclaimer Ticker"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "44px",
          background: "#020617",
          color: "#fde047", // bright yellow/amber text
          borderTop: "1px solid rgba(234, 179, 8, 0.3)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            whiteSpace: "nowrap",
            animation: "apnaVakilMarquee 28s linear infinite"
          }}
          className="hover:[animation-play-state:paused]"
        >
          <span style={{ paddingRight: "80px", fontSize: "13px", fontWeight: "600" }}>
            ⚠️ <strong>STATUTORY DISCLAIMER:</strong> The information provided on ApnaVakil is intended solely for general informational and educational assistance. ApnaVakil is an AI platform and does not provide formal legal advice or create an advocate-client relationship under the Advocates Act, 1961. Always consult a certified legal practitioner for court proceedings.
          </span>

          <span style={{ paddingRight: "80px", fontSize: "13px", fontWeight: "600" }}>
            ⚠️ <strong>STATUTORY DISCLAIMER:</strong> The information provided on ApnaVakil is intended solely for general informational and educational assistance. ApnaVakil is an AI platform and does not provide formal legal advice or create an advocate-client relationship under the Advocates Act, 1961. Always consult a certified legal practitioner for court proceedings.
          </span>
        </div>
      </aside>

      <style>
        {`
          @keyframes apnaVakilMarquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>

    </div>
  );
};

export default Home;