import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldAlert, AlertTriangle, FileText, CheckCircle2, Home, ArrowLeft, Gavel, HelpCircle, Menu, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../zustand/store";

const Disclaimer = () => {
  const { theme } = useStore();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: "no-legal-advice",
      title: "1. Not a Substitute for Professional Legal Counsel",
      content: (
        <>
          <p className="mb-3">
            The information, analysis, document templates, automated conversational outputs, and AI-generated text provided on <strong>ApnaVakil</strong> (referred to as "Platform" or "Service") are intended <strong>solely for general educational and informational purposes</strong>.
          </p>
          <p className="mb-3">
            ApnaVakil is a legal technology platform powered by Artificial Intelligence and Large Language Models. <strong>ApnaVakil is not a law firm</strong>, and its services do not constitute the practice of law, legal advice, solicitor-client privilege, or professional attorney representation under the Advocates Act, 1961.
          </p>
          <p>
            No user should act or refrain from acting on the basis of any material contained on this website without seeking appropriate legal or other professional advice on the particular facts and circumstances at issue from an advocate licensed in the relevant jurisdiction.
          </p>
        </>
      ),
    },
    {
      id: "bar-council",
      title: "2. Bar Council of India (BCI) Compliance & Non-Solicitation",
      content: (
        <>
          <p className="mb-3">
            In strict compliance with <strong>Rule 36 of the Bar Council of India Rules</strong> (framed under the Advocates Act, 1961), Indian advocates and law firms are prohibited from soliciting work or advertising their services.
          </p>
          <p className="mb-3">
            Any directory listing, advocate profile, or consultation booking feature available on this platform is purely informational and provided upon specific user request. It does not constitute an advertisement, solicitation, inducement, or recommendation by ApnaVakil or any associated advocates.
          </p>
          <p>
            By accessing any lawyer profile on ApnaVakil, you expressly confirm and acknowledge that you are doing so of your own volition and that there has been no solicitation, invitation, or inducement by ApnaVakil or any of its registered practitioners.
          </p>
        </>
      ),
    },
    {
      id: "ai-limitations",
      title: "3. Artificial Intelligence Technology & Accuracy Limitations",
      content: (
        <>
          <p className="mb-3">
            ApnaVakil utilizes advanced machine learning, neural networks, and generative AI models to interpret statutory frameworks (such as the <em>Bharatiya Nyaya Sanhita, 2023</em>, <em>Bharatiya Nagarik Suraksha Sanhita, 2023</em>, <em>Indian Contract Act, 1872</em>, and related enactments).
          </p>
          <p className="mb-3">
            While we continuously refine and update our models against authoritative Indian law databases:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3 text-sm">
            <li>AI outputs may occasionally contain inaccuracies, hallucinations, outdated case law, or incomplete citations.</li>
            <li>Statutory interpretations, local municipal rules, state-specific amendments, and court precedents vary widely across jurisdictions.</li>
            <li>Automated draft documents (including rental agreements, notices, affidavits, or NDAs) require mandatory review by a qualified legal professional before execution or filing before any court or judicial authority.</li>
          </ul>
          <p>
            ApnaVakil makes no express or implied warranty regarding the legal validity, enforceability, or suitability of any AI-generated draft for your specific legal matter.
          </p>
        </>
      ),
    },
    {
      id: "no-attorney-client",
      title: "4. No Creation of Advocate-Client Relationship",
      content: (
        <>
          <p className="mb-3">
            Using the ApnaVakil platform, submitting prompts to the AI chatbot, or creating account credentials <strong>does not create an advocate-client relationship</strong> between you and ApnaVakil or any affiliated entity.
          </p>
          <p>
            An advocate-client relationship is only established when you independently engage an advocate through a formal written agreement, Power of Attorney / Vakalatnama, and agreed professional consideration directly with the concerned legal practitioner.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "5. Absolute Limitation of Liability",
      content: (
        <>
          <p className="mb-3">
            To the maximum extent permitted by applicable Indian law (including the Information Technology Act, 2000 and the Consumer Protection Act, 2019):
          </p>
          <p className="mb-3">
            Neither ApnaVakil, its founders, developers, employees, affiliates, nor data providers shall be held liable for any direct, indirect, incidental, punitive, special, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3 text-sm">
            <li>Reliance on any AI-generated answer, document template, or summary.</li>
            <li>Failure to meet legal deadlines, limitation periods, or filing requirements.</li>
            <li>Any disputes, outcomes, or financial losses incurred in connection with legal proceedings.</li>
            <li>Unauthorized access, technical outages, or transmission errors.</li>
          </ul>
          <p>
            Your sole and exclusive remedy for dissatisfaction with the service is to discontinue using the platform.
          </p>
        </>
      ),
    },
    {
      id: "jurisdiction",
      title: "6. Governing Law & Jurisdiction",
      content: (
        <>
          <p>
            This disclaimer and all matters arising out of or related to your use of ApnaVakil shall be governed by and construed in accordance with the laws of the Republic of India. The courts located in <strong>New Delhi, India</strong> shall have exclusive jurisdiction over any claims or disputes.
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
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-2 rounded-lg text-xs font-semibold ${isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}
            >
              🛡️ Privacy Policy
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

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-500 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4" />
            <span>Official Legal Notice & Statutory Disclaimers</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Legal Disclaimer & Terms
          </h1>

          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Please read this notice carefully prior to utilizing the automated AI intelligence and advisory services of ApnaVakil.
          </p>

          <p className="text-xs text-slate-400">
            Last Updated: August 2026 • Governed under the Laws of Republic of India
          </p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* Important Alert Box */}
        <div className={`p-5 sm:p-6 rounded-2xl border mb-10 backdrop-blur-md ${
          isDark
            ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
            : "bg-amber-50 border-amber-300 text-amber-900 shadow-sm"
        }`}>
          <div className="flex items-start gap-3.5">
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h3 className="font-bold text-sm sm:text-base">Statutory Notice: Not Licensed Legal Counsel</h3>
              <p className="leading-relaxed">
                ApnaVakil is an automated technological tool. It provides generalized legal summaries and document drafts. It does <strong>not</strong> substitute a certified Advocate enrolled with the State Bar Council. Always corroborate legal outputs with licensed legal practitioners.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
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
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-bold text-sm shrink-0">
                  {idx + 1}
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
        </div>

        {/* Contact Support Box */}
        <div className={`mt-12 p-8 rounded-3xl border text-center space-y-3 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-500/30"
            : "bg-gradient-to-br from-slate-100 to-indigo-50 border-indigo-200"
        }`}>
          <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto" />
          <h3 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Questions Regarding Our Legal Disclaimers?
          </h3>
          <p className={`text-sm max-w-lg mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            If you have questions concerning our regulatory compliance or Bar Council rules, contact our legal desk.
          </p>
          <div className="pt-2">
            <a
              href="mailto:support@apnavakil.in"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
            >
              Contact Legal Desk (support@apnavakil.in)
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-8 px-4 text-center text-xs transition-colors ${
        isDark ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ApnaVakil AI. All Rights Reserved. Compliant under Advocates Act, 1961.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:underline">Terms of Service</Link>
            <Link to="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Disclaimer;