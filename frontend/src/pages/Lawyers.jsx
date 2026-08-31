import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import { useStore } from "../zustand/store";
import PricingBox from "../components/payment";
import LawyerCard from "../components/LawyerCard";
import LoadingPage from "../components/Loading";
import WhatsAppChat from "../components/WhatsAppChat";
import { Search, ShieldCheck, Scale, Users, MessageSquare, X } from "lucide-react";

export default function LawyersPage() {
  const { showPricingBox, Lawyers, theme, user } = useStore();
  const isDark = theme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showChatModal, setShowChatModal] = useState(false);

  const categories = [
    "All",
    "Criminal Defense & Bail",
    "Corporate & Contracts",
    "Property & Real Estate",
    "Civil Litigation",
    "Family & Matrimonial",
    "High Court Writs",
    "Consumer Protection",
  ];

  const demoLawyers = Lawyers?.lawyers || [];

  // Filtered lawyers by search query and category
  const filteredLawyers = useMemo(() => {
    return demoLawyers.filter((lawyer) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lawyer.name?.toLowerCase().includes(q) ||
        lawyer.speciality?.toLowerCase().includes(q) ||
        lawyer.desc?.toLowerCase().includes(q) ||
        lawyer.city?.toLowerCase().includes(q) ||
        lawyer.categories?.some((cat) => cat.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "All" ||
        lawyer.categories?.some(
          (cat) => cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
        ) ||
        (lawyer.speciality &&
          lawyer.speciality.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });
  }, [demoLawyers, searchQuery, selectedCategory]);

  if (Lawyers?.isloading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#eaf2f8] dark:bg-slate-950 text-blue-950 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      {showPricingBox && <PricingBox />}
      <Header />

      <main className="flex-1 pb-16">
        {/* COMPACT & RELEVANT TOP HERO */}
        <section
          className={`py-8 sm:py-10 px-4 sm:px-6 md:px-8 border-b transition-colors ${
            isDark
              ? "bg-slate-900/90 border-slate-800"
              : "bg-[#e2edf7] border-blue-200/90"
          }`}
        >
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-300 dark:border-indigo-800 bg-blue-100/80 dark:bg-indigo-950/60 text-blue-900 dark:text-indigo-300 text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-indigo-400" />
                  <span>Bar Council Verified Legal Practitioners</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white tracking-tight">
                  Consult Verified Advocates
                </h1>
                <p className="text-xs sm:text-sm text-blue-900/70 dark:text-slate-300 font-medium mt-1">
                  Connect securely for legal advisory, document drafting, and representation across High Courts & District Courts.
                </p>
              </div>

              {/* Quick WhatsApp Chat button for connected users */}
              {user && (
                <button
                  onClick={() => setShowChatModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-bold rounded-2xl shadow-sm flex items-center gap-2 text-xs sm:text-sm shrink-0 self-start md:self-auto cursor-pointer transition"
                >
                  <MessageSquare size={16} />
                  <span>My Active Consultations</span>
                </button>
              )}
            </div>

            {/* DIRECTORY SEARCH & CATEGORY FILTER */}
            <div className="pt-2 space-y-3">
              {/* Search Bar */}
              <div
                className={`flex items-center rounded-2xl border-2 p-1.5 shadow-sm transition-all ${
                  isDark
                    ? "bg-slate-950 border-slate-700 focus-within:border-indigo-500"
                    : "bg-white border-blue-300 focus-within:border-blue-700 shadow-blue-900/5"
                }`}
              >
                <Search className="w-4 h-4 text-blue-700 dark:text-indigo-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by advocate name, specialty, or city (e.g. Criminal, Property, Delhi)..."
                  className="w-full px-2.5 py-1.5 bg-transparent outline-none text-xs sm:text-sm font-semibold text-blue-950 dark:text-white placeholder:text-blue-900/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-blue-900/50 hover:text-blue-950 dark:hover:text-slate-200 mr-2 rounded-lg cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-blue-700 text-white border-blue-700 shadow-xs"
                          : isDark
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                          : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:bg-[#dcebf6]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS COUNT & ADVOCATE CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex items-center justify-between mb-4 text-xs font-bold text-blue-900/60 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Scale size={14} className="text-blue-700 dark:text-indigo-400" />
              <span>Available Practitioners ({filteredLawyers.length})</span>
            </span>
            <span>🔒 Confidential Platform Inquiries</span>
          </div>

          {filteredLawyers.length === 0 ? (
            <div
              className={`text-center py-16 px-4 rounded-3xl border ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-[#f0f6fc] border-blue-200/90 shadow-xs"
              }`}
            >
              <Users className="w-10 h-10 mx-auto text-blue-900/40 mb-3" />
              <h3 className="text-base font-black text-blue-950 dark:text-white">
                No advocates found matching "{searchQuery || selectedCategory}"
              </h3>
              <p className="text-blue-900/60 dark:text-slate-400 text-xs mt-1 max-w-sm mx-auto font-medium">
                Try selecting "All" categories or searching another city or practice domain.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* WHATSAPP CHAT MODAL */}
      {showChatModal && (
        <WhatsAppChat isModal={true} onClose={() => setShowChatModal(false)} />
      )}
    </div>
  );
}