import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, Key, Database, Mail, Home, ArrowLeft, Menu, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../zustand/store";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { theme } = useStore();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "introduction",
      icon: ShieldCheck,
      title: "1. Introduction & Statutory Framework",
      content: (
        <>
          <p className="mb-3">
            ApnaVakil ("we", "our", or "us") is dedicated to protecting your fundamental right to privacy and safeguarding your personal, confidential, and legal data.
          </p>
          <p className="mb-3">
            This Privacy Policy governs the collection, processing, storage, and transfer of data on ApnaVakil in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000 (IT Act)</strong>, and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
          </p>
          <p>
            By creating an account, accessing our platform, or submitting legal drafts, you consent to the data practices described in this policy.
          </p>
        </>
      ),
    },
    {
      id: "data-collection",
      icon: Database,
      title: "2. Information We Collect",
      content: (
        <>
          <p className="mb-3">We collect information to provide intelligent AI legal analysis and lawyer consultation services:</p>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500 mb-1">A. Personal Identification Data</strong>
              <p>Your full name, registered email address, phone number (if provided for OTP verification), and encrypted account authentication credentials.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500 mb-1">B. Legal Inquiries & Document Data</strong>
              <p>Queries submitted to the AI legal assistant, uploaded document drafts, contracts, affidavits, and case details provided during consultations.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500 mb-1">C. Technical & Diagnostic Logs</strong>
              <p>IP address, browser user-agent, session timestamps, and device telemetry to prevent fraud and enhance system stability.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-processing",
      icon: Lock,
      title: "3. How We Process & Protect Your Data",
      content: (
        <>
          <p className="mb-3">Your confidential legal documents and queries are processed strictly for intended services:</p>
          <ul className="list-disc pl-5 space-y-2 mb-3 text-sm">
            <li><strong>AI Analysis & Document Generation:</strong> Inputs are processed by AI models to formulate statutory summaries and generate legal drafts.</li>
            <li><strong>End-to-End Encryption:</strong> Sensitive personal data is encrypted in transit using TLS 1.3 (256-bit encryption) and encrypted at rest with AES-256 standards.</li>
            <li><strong>No Sale of Personal Data:</strong> We never sell, rent, or trade your personal or case information to third-party advertisers or commercial data brokers.</li>
            <li><strong>Model Training Isolation:</strong> User case inputs are isolated and not used to train publicly available third-party foundation models without your explicit opt-in.</li>
          </ul>
        </>
      ),
    },
    {
      id: "data-sharing",
      icon: UserCheck,
      title: "4. Disclosure of Information",
      content: (
        <>
          <p className="mb-3">We only disclose your data under the following limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Verified Legal Practitioners:</strong> When you voluntarily schedule a consultation with an advocate through the platform, relevant consultation notes are shared with that specific advocate.</li>
            <li><strong>Essential Cloud Infrastructure:</strong> With verified SOC-2 certified cloud providers and database infrastructure partners bound by strict confidentiality and non-disclosure obligations.</li>
            <li><strong>Legal & Regulatory Mandates:</strong> When legally mandated by a valid judicial court order, warrant, or statutory subpoena issued by competent law enforcement agencies under Indian law.</li>
          </ul>
        </>
      ),
    },
    {
      id: "user-rights",
      icon: Key,
      title: "5. Your Rights Under DPDP Act 2023",
      content: (
        <>
          <p className="mb-3">Under Indian data privacy regulations, you have full control over your digital personal data:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500">Right to Access & Summary</strong>
              <p className="text-xs mt-1">Request a copy of all personal data and active draft history maintained on our servers.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500">Right to Correction & Erasure</strong>
              <p className="text-xs mt-1">Request rectification of inaccurate data or permanent deletion of your account and case history.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500">Right of Grievance Redressal</strong>
              <p className="text-xs mt-1">Submit privacy concerns directly to our designated Data Protection & Grievance Officer.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <strong className="block text-indigo-500">Right to Nominate</strong>
              <p className="text-xs mt-1">Nominate another individual to exercise your rights in the event of death or incapacity.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "grievance-officer",
      icon: Mail,
      title: "6. Grievance Officer & Contact Details",
      content: (
        <>
          <p className="mb-3">
            In accordance with Rule 5(9) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act, 2023, the details of the Grievance Officer are provided below:
          </p>
          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-sm space-y-1">
            <p><strong>Designation:</strong> Grievance Redressal & Data Protection Officer</p>
            <p><strong>Entity:</strong> ApnaVakil AI Legal Intelligence Platform</p>
            <p><strong>Email:</strong> <a href="mailto:grievance@apnavakil.in" className="text-indigo-500 hover:underline">grievance@apnavakil.in</a> / <a href="mailto:privacy@apnavakil.in" className="text-indigo-500 hover:underline">privacy@apnavakil.in</a></p>
            <p><strong>Address:</strong> New Delhi, India</p>
            <p className="text-xs text-slate-400 pt-2">All grievances will be acknowledged within 24 hours and resolved within 15 working days.</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark ? "bg-[#090D16] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 shadow-lg shadow-black/40"
          : "bg-white/95 border-slate-200 shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
            <img src="/logo.png" className="w-8 h-8 sm:w-10 sm:h-10 aspect-square object-contain" alt="logo" />
            <span className={`text-base sm:text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Apna<span className="text-indigo-500">Vakil</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className={`hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition items-center gap-1.5 ${
                isDark ? "text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700" : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-indigo-500" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 hover:scale-105 transition"
            >
              <span>Try AI Assistant</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`sm:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? "bg-slate-800/80 border-slate-700 text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className={`sm:hidden border-b px-4 py-3 space-y-2 shadow-xl ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              🏠 Home
            </Link>
            <Link
              to="/disclaimer"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              ⚖️ Statutory Disclaimer
            </Link>
            <Link
              to="/terms-and-conditions"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              📋 Terms of Service
            </Link>
            <Link
              to="/lawyers"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              👨‍⚖️ Verified Advocates
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-500 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Act 2023 & IT Act 2000 Compliant</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Privacy Policy & Data Security
          </h1>

          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Learn how ApnaVakil protects your identity, encrypts legal documents, and complies with Indian data protection laws.
          </p>

          <p className="text-xs text-slate-400">
            Effective Date: August 2026 • Version 3.1
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-8">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
              isDark
                ? "bg-slate-900/70 border-slate-800 shadow-xl shadow-black/40"
                : "bg-white border-slate-200 shadow-md shadow-slate-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-bold shrink-0">
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {section.title}
              </h2>
            </div>

            <div className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {section.content}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-8 px-4 text-center text-xs transition-colors ${
        isDark ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ApnaVakil AI. All Rights Reserved. Bank-Grade 256-Bit SSL Encryption.</p>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:underline">Legal Disclaimer</Link>
            <Link to="/terms-and-conditions" className="hover:underline">Terms of Service</Link>
            <Link to="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;