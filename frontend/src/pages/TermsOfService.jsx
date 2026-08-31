import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileCheck2, Scale, Shield, CreditCard, AlertCircle, Ban, HelpCircle, Home, ArrowLeft, Menu, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../zustand/store";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { theme } = useStore();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "agreement",
      icon: FileCheck2,
      title: "1. Acceptance of Terms & Legal Capacity",
      content: (
        <>
          <p className="mb-3">
            These Terms & Conditions ("Terms", "Agreement") constitute a legally binding electronic agreement between you ("User", "you") and <strong>ApnaVakil AI</strong> ("Platform", "we", "us", "our") in terms of the <em>Information Technology Act, 2000</em> and applicable rules thereunder.
          </p>
          <p className="mb-3">
            By registering, accessing, downloading, or using ApnaVakil, you certify that you are at least 18 years of age, possess full legal capacity to enter into binding contracts under the <em>Indian Contract Act, 1872</em>, and agree to abide by all provisions herein.
          </p>
          <p>
            If you do not agree to these Terms in their entirety, you must immediately terminate use of the platform.
          </p>
        </>
      ),
    },
    {
      id: "nature-of-service",
      icon: Scale,
      title: "2. Nature of Platform & AI Service Scope",
      content: (
        <>
          <p className="mb-3">
            ApnaVakil provides automated AI-assisted legal research, draft generation, and access to a directory of independent legal practitioners.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm mb-3">
            <li><strong>AI Drafting Assistance:</strong> Templates and AI-generated outputs are algorithmic summaries. They do not constitute formal legal drafting under the Advocates Act, 1961.</li>
            <li><strong>Independent Advocates:</strong> Advocates listed on the platform operate independently. ApnaVakil acts solely as a technological intermediary connecting users with advocates upon specific user request.</li>
            <li><strong>User Responsibility:</strong> You are solely responsible for verifying the factual accuracy, legal enforceability, and stamp duty requirements of any documents generated on this platform prior to signing or submitting before authorities.</li>
          </ul>
        </>
      ),
    },
    {
      id: "acceptable-use",
      icon: Ban,
      title: "3. User Conduct & Prohibited Activities",
      content: (
        <>
          <p className="mb-3">You agree not to misuse ApnaVakil. Prohibited activities include, but are not limited to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Generating forged, fraudulent, defamatory, seditious, or unlawful legal documentation.</li>
            <li>Using the AI assistant or drafting tools to generate material violating intellectual property, privacy, or trade secrets of third parties.</li>
            <li>Attempting to reverse engineer, decompile, scrape, or extract source code or AI weights from the platform.</li>
            <li>Impersonating judicial officers, government officials, law enforcement personnel, or licensed advocates.</li>
            <li>Submitting automated high-frequency API requests designed to disrupt, overload, or degrade service performance.</li>
          </ul>
        </>
      ),
    },
    {
      id: "subscriptions",
      icon: CreditCard,
      title: "4. Subscription Plans, Billing & Refund Policy",
      content: (
        <>
          <p className="mb-3">Certain advanced features (such as priority lawyer consultations, unlimited document exports, and advanced AI drafting) require paid subscriptions:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm mb-3">
            <li><strong>Pricing & Taxes:</strong> All fees are stated in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST) unless specified otherwise.</li>
            <li><strong>Payment Gateways:</strong> Payments are securely processed via RBI-authorized payment aggregators (e.g. Razorpay/Stripe). ApnaVakil does not store raw credit/debit card numbers.</li>
            <li><strong>Refund Policy:</strong> Due to the immediate delivery of digital computing resources and AI generation tokens, subscription fees are generally non-refundable. If a technical transaction failure occurs, refunds will be credited within 5-7 business days upon investigation.</li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      icon: Shield,
      title: "5. Intellectual Property Rights",
      content: (
        <>
          <p className="mb-3">
            <strong>Platform IP:</strong> All proprietary software, user interfaces, branding, logos, graphics, and algorithms of ApnaVakil are protected under the <em>Copyright Act, 1957</em> and <em>Trade Marks Act, 1999</em>.
          </p>
          <p>
            <strong>Your Content & Generated Documents:</strong> You retain ownership of the factual content you input. You are granted a perpetual, royalty-free, worldwide license to use, download, print, edit, and execute any legal document drafts generated by you through the platform.
          </p>
        </>
      ),
    },
    {
      id: "dispute-resolution",
      icon: AlertCircle,
      title: "6. Dispute Resolution & Arbitration",
      content: (
        <>
          <p className="mb-3">
            Any controversy, claim, or dispute arising out of or relating to these Terms shall be resolved amicably through mutual negotiations.
          </p>
          <p className="mb-3">
            If unresolved within 30 days, the dispute shall be referred to and finally resolved by binding arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>. The arbitration shall be conducted by a sole arbitrator mutually appointed by the parties.
          </p>
          <p className="text-sm">
            The seat and venue of arbitration shall be <strong>New Delhi, India</strong>, and proceedings shall be conducted in English.
          </p>
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
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              🛡️ Privacy Policy
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
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-400 backdrop-blur-md">
            <FileCheck2 className="w-4 h-4" />
            <span>Binding User Agreement • IT Act 2000 Compliant</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Terms of Service & Usage
          </h1>

          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Please review the contractual terms governing your access to the ApnaVakil platform, AI services, and advocate directory.
          </p>

          <p className="text-xs text-slate-400">
            Last Revised: August 2026 • Republic of India Jurisdiction
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
          <p>© {new Date().getFullYear()} ApnaVakil AI. All Rights Reserved. Indian Contract Act, 1872 Compliant.</p>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:underline">Legal Disclaimer</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;