import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  Plus,
  Search,
  Sparkles,
  Scale,
  Users,
  CreditCard,
  PanelLeftClose,
  ChevronRight,
  Clock,
  Trash2,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { useStore } from '../zustand/store';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const {
    chat,
    setChat,
    setActiveChat,
    activeChat,
    setHistory,
    sidebarOpen,
    setDraftChatHistory,
    setSidebarOpen,
    All_Histories,
    YourDrafts,
    setActiveDraft,
    activeDraft,
    DraftMode,
    setDraft,
    setDocument,
    theme,
    user,
    setShowPricingBox,
  } = useStore();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === "dark";

  const clear = () => {
    setActiveChat(null);
    setHistory([]);
  };

  const clearDraft = () => {
    setActiveDraft(null);
    setDraftChatHistory([]);
    setDocument(null);
  };

  // Filter history items by search query
  const filteredChatHistory = useMemo(() => {
    const list = All_Histories?.all_h || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) => {
      const title = item.title || item.messages?.[0]?.parts?.[0]?.text || '';
      return title.toLowerCase().includes(q);
    });
  }, [All_Histories, searchQuery]);

  // Filter drafts by search query
  const filteredDrafts = useMemo(() => {
    const list = YourDrafts?.drafts || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) => {
      const title = item.title || item.messages?.[0]?.content || '';
      return title.toLowerCase().includes(q);
    });
  }, [YourDrafts, searchQuery]);

  return (
    <aside
      className={`
        flex flex-col transition-all duration-300 ease-in-out
        fixed sm:relative h-full z-50 border-r select-none
        ${isDark
          ? "bg-slate-900/95 border-slate-800 text-slate-200 shadow-2xl shadow-black/60"
          : "bg-[#ebf4fa] border-blue-200/90 text-blue-950 shadow-lg shadow-blue-900/5"
        }
        ${sidebarOpen
          ? "w-[80vw] sm:w-[320px] md:w-[280px] lg:w-[300px] opacity-100"
          : "w-0 opacity-0 overflow-hidden pointer-events-none"
        }
      `}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-blue-200/90 dark:border-slate-800/80">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg drop-shadow-sm group-hover:scale-105 transition"
            alt="ApnaVakil Logo"
          />
          <div className="flex flex-col">
            <span className={`text-base font-black tracking-tight flex items-center gap-1 ${isDark ? "text-white" : "text-blue-950"}`}>
              Apna<span className="text-blue-700 dark:text-indigo-400">Vakil</span>
            </span>
            <span className="text-[9px] text-blue-900/60 dark:text-slate-400 font-semibold">Legal Intelligence</span>
          </div>
        </Link>

        <button
          onClick={() => setSidebarOpen(false)}
          className={`p-1.5 rounded-lg border transition ${
            isDark
              ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              : "border-blue-300 text-blue-900 hover:text-blue-950 hover:bg-[#dbeaf5]"
          }`}
          aria-label="Close Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Switcher Segmented Control */}
      <div className="px-3 pt-3">
        <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
          isDark ? "bg-slate-950/60 border-slate-800" : "bg-[#dcebf6] border-blue-300"
        }`}>
          <button
            type="button"
            onClick={() => setDraft(false)}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              !DraftMode
                ? "bg-blue-800 text-white shadow-sm font-bold"
                : isDark
                ? "text-slate-400 hover:text-slate-200"
                : "text-blue-950/80 hover:text-blue-950 hover:bg-[#cde1f0]"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>ChatBot</span>
          </button>
          <button
            type="button"
            onClick={() => setDraft(true)}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              DraftMode
                ? "bg-blue-800 text-white shadow-sm font-bold"
                : isDark
                ? "text-slate-400 hover:text-slate-200"
                : "text-blue-950/80 hover:text-blue-950 hover:bg-[#cde1f0]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Drafter</span>
          </button>
        </div>
      </div>

      {/* New Session Action CTA */}
      <div className="px-3 pt-2.5">
        <button
          onClick={DraftMode ? clearDraft : clear}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-900/20 transition-all text-xs sm:text-sm active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{DraftMode ? "New Legal Draft" : "New Consultation"}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-2.5">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
          isDark
            ? "bg-slate-950/60 border-slate-800 text-slate-300 focus-within:border-indigo-500"
            : "bg-[#e2edf7] border-blue-300 text-blue-950 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100"
        }`}>
          <Search className="w-3.5 h-3.5 text-blue-700/60 dark:text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={DraftMode ? "Search saved drafts..." : "Search past inquiries..."}
            className="w-full bg-transparent outline-none text-xs placeholder:text-blue-900/40 dark:placeholder-slate-400 font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-900/50 hover:text-blue-950 dark:hover:text-slate-200 text-[11px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* History / Drafts List */}
      <nav className="flex-1 flex flex-col px-3 pt-3 pb-2 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-2 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-950/60 dark:text-slate-400">
            {DraftMode ? "Saved Documents" : "Recent Inquiries"}
          </span>
          <span className="text-[10px] font-bold text-blue-950/60 dark:text-slate-500">
            {DraftMode ? filteredDrafts.length : filteredChatHistory.length}
          </span>
        </div>

        {DraftMode ? (
          filteredDrafts.length === 0 ? (
            <div className="text-center py-8 px-2 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-blue-900/30 dark:text-slate-700 stroke-1" />
              <p className="text-xs text-blue-950/70 dark:text-slate-400 font-bold">
                {searchQuery ? "No matching drafts" : "No saved drafts yet"}
              </p>
              <p className="text-[11px] text-blue-900/50 dark:text-slate-600 font-medium">
                Generate agreements, NDAs & affidavits in the workspace
              </p>
            </div>
          ) : (
            filteredDrafts.map((item, i) => {
              const isActive = activeDraft?._id === item._id;
              const title = item.title || item.messages?.[0]?.content?.slice(0, 26) || "Untitled Draft";
              return (
                <button
                  onClick={() => setActiveDraft(item)}
                  key={item._id || i}
                  className={`group flex w-full items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all border ${
                    isActive
                      ? isDark
                        ? "bg-indigo-950/60 border-indigo-500/40 text-indigo-200 shadow-md font-bold"
                        : "bg-[#d4e6f5] border-blue-400 text-blue-950 shadow-xs font-bold"
                      : isDark
                      ? "border-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      : "border-blue-200/50 text-blue-950 hover:bg-[#dbeaf5] hover:border-blue-300 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <FileText className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-800 dark:text-indigo-400" : "text-blue-700/60 group-hover:text-blue-900"}`} />
                    <span className="truncate">{title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-800 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })
          )
        ) : (
          filteredChatHistory.length === 0 ? (
            <div className="text-center py-8 px-2 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-blue-900/30 dark:text-slate-700 stroke-1" />
              <p className="text-xs text-blue-950/70 dark:text-slate-400 font-bold">
                {searchQuery ? "No matching chats" : "No consultations yet"}
              </p>
              <p className="text-[11px] text-blue-900/50 dark:text-slate-600 font-medium">
                Ask a legal question under BNS 2023 to start
              </p>
            </div>
          ) : (
            filteredChatHistory.map((item, i) => {
              const isActive = activeChat?._id === item._id;
              const title = item.title || item.messages?.[0]?.parts?.[0]?.text?.slice(0, 26) || "Legal Inquiry";
              return (
                <button
                  onClick={() => setActiveChat(item)}
                  key={item._id || i}
                  className={`group flex w-full items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all border ${
                    isActive
                      ? isDark
                        ? "bg-indigo-950/60 border-indigo-500/40 text-indigo-200 shadow-md font-bold"
                        : "bg-[#d4e6f5] border-blue-400 text-blue-950 shadow-xs font-bold"
                      : isDark
                      ? "border-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      : "border-blue-200/50 text-blue-950 hover:bg-[#dbeaf5] hover:border-blue-300 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-800 dark:text-indigo-400" : "text-blue-700/60 group-hover:text-blue-900"}`} />
                    <span className="truncate">{title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-800 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })
          )
        )}
      </nav>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-blue-200/90 dark:border-slate-800/80 space-y-2">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <Link
            to="/lawyers"
            className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              isDark
                ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                : "bg-[#dcebf6] border-blue-300 text-blue-950 hover:bg-[#cee2f1]"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-700 dark:text-indigo-400 shrink-0" />
            <span className="truncate">Advocates</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowPricingBox(true)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold transition text-left cursor-pointer ${
              isDark
                ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                : "bg-[#dcebf6] border-blue-300 text-blue-950 hover:bg-[#cee2f1]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Upgrade</span>
          </button>
        </div>

        {/* User Card & Theme Switch */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isDark ? "bg-slate-950/80 border-slate-800" : "bg-[#dcebf6] border-blue-300 shadow-xs"
        }`}>
          <div className="flex items-center gap-2 truncate pr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-black text-blue-950 dark:text-white truncate">
                {user?.name || "ApnaVakil User"}
              </p>
              <p className="text-[10px] font-bold text-blue-900/60 dark:text-slate-400 truncate">
                {user?.plan ? `${user.plan} Plan` : "Free Tier"}
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
