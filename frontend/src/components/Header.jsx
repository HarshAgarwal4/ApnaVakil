import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import { Search } from 'lucide-react';
import ConsultationModal from './LawyerModal';
import UserConnectionsModal from './UserConnectionsModal';
import { FaBars } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  const {
    showPricingBox,
    setShowPricingBox,
    user,
    logout,
    sidebarOpen,
    setSidebarOpen,
    DraftMode,
    setDraft,
    Lawyers,
    rightSideBarOpen,
    setRightSideBarOpen,
    theme
  } = useStore();

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("lawyers");
  const [box, setBox] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLawyer, setCurrentLawyer] = useState(null);

  function toggleDraft() {
    if (location.pathname === '/lawyers') {
      navigate('/dashboard');
    } else {
      setDraft(!DraftMode);
    }
  }

  useEffect(() => {
    if (mode !== "lawyers") return;

    if (!search.trim()) {
      setBox([]);
      return;
    }

    const filtered = Lawyers?.lawyers?.filter(item =>
      item.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    setBox(filtered || []);
  }, [search, mode, Lawyers]);

  const isDark = theme === "dark";

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-3 bg-[#f0f6fc] dark:bg-slate-900 border-b border-blue-200/90 dark:border-slate-800 shadow-sm relative z-[100] transition-colors duration-300">

      {/* LEFT */}
      <div className='flex items-center gap-3'>
        <div onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer text-blue-950 dark:text-slate-200 hover:text-blue-700 transition-colors p-1">
          <FaBars size={20} />
        </div>

        <h2 className="text-base sm:text-lg font-black text-blue-950 dark:text-white tracking-tight flex items-center gap-1.5">
          <span>Apna</span>
          <span className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Vakil</span>
        </h2>
      </div>

      {/* CENTER SEARCH */}
      <div className="relative">

        {showModal && (
          <ConsultationModal
            lawyer={currentLawyer}
            onClose={() => setShowModal(false)}
          />
        )}

        <div className="hidden md:flex items-center bg-[#e4eff8] dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-full px-5 py-2 w-[35vw] focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all shadow-xs">

          <div className="h-4 w-px bg-blue-300 dark:bg-slate-600 mr-3"></div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${mode}...`}
            className="flex-1 bg-transparent outline-none text-sm text-blue-950 dark:text-slate-100 placeholder:text-blue-900/50 dark:placeholder:text-slate-500 font-semibold"
          />

          <Search size={18} className="ml-3 text-blue-700 dark:text-indigo-400" />
        </div>

        {mode === "lawyers" && search && (
          <div className="absolute mt-2 w-[35vw] bg-[#f0f6fc] dark:bg-slate-900 border border-blue-300 dark:border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 p-1">

            {box.length === 0 ? (
              <div className="p-4 text-xs font-bold text-blue-900/60 dark:text-slate-400 text-center">
                No advocates found matching "{search}"
              </div>
            ) : (
              box.map((itm) => (
                <div
                  key={itm._id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#e2edf7] dark:hover:bg-slate-800 cursor-pointer transition"
                  onClick={() => {
                    setCurrentLawyer(itm);
                    setShowModal(true);
                    setSearch("");
                    setBox([]);
                  }}
                >
                  <img
                    src={itm.images || "/logo.png"}
                    alt={itm.name}
                    className="w-8 h-8 rounded-full object-cover border border-blue-200 dark:border-slate-700"
                  />
                  <span className="text-xs font-bold text-blue-950 dark:text-slate-100">
                    {itm.name}
                  </span>
                </div>
              ))
            )}

          </div>
        )}

      </div>

      {/* DESKTOP RIGHT BUTTONS */}
      <div className='hidden md:flex gap-2.5 items-center'>

        {/* Lawyer Panel Button for Advocates */}
        {user?.role === "lawyer" && (
          <button
            onClick={() => navigate('/lawyer/dashboard')}
            className='px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5'
          >
            <span>⚖️ Lawyer Panel</span>
          </button>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        <button
          onClick={toggleDraft}
          className='px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20 transition-all cursor-pointer'
        >
          {DraftMode ? "🤖 ChatBot" : "📄 AI Drafter"}
        </button>

        <button
          onClick={() => navigate('/lawyers')}
          className='px-3.5 py-2 border border-blue-200 dark:border-slate-700 text-blue-950 dark:text-slate-200 bg-[#e4eff8] dark:bg-slate-800 hover:bg-[#d5e6f5] dark:hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer'
        >
          Advocates
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">

          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="px-3.5 py-2 bg-[#e4eff8] dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-[#d5e6f5] dark:hover:bg-slate-700 text-xs sm:text-sm font-bold text-blue-950 dark:text-slate-200 transition"
          >
            {user?.name || "User"}
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#f0f6fc] dark:bg-slate-900 border border-blue-300 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">

              {user?.role === "lawyer" && (
                <button
                  onClick={() => {
                    navigate('/lawyer/dashboard');
                    setProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-emerald-700 dark:text-emerald-400 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-bold border-b border-blue-200 dark:border-slate-800"
                >
                  ⚖️ Advocate Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  setShowConnectionsModal(true);
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-blue-950 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-bold"
              >
                🤝 My Advocate Connections
              </button>

              <button
                onClick={() => {
                  setShowPricingBox(!showPricingBox);
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-blue-950 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-bold"
              >
                ⭐ Subscription Plan
              </button>

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-t border-blue-200 dark:border-slate-800 transition text-xs font-bold"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {/* MOBILE THREE DOT MENU & PANEL TOGGLE */}
      <div className="md:hidden relative flex items-center gap-1.5 sm:gap-2">

        <ThemeToggle />

        <div className='flex justify-center gap-1.5 sm:gap-2 items-center'>

          {DraftMode ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRightSideBarOpen(!rightSideBarOpen);
              }}
              className='px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition'
            >
              <span>📄 Doc</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRightSideBarOpen(!rightSideBarOpen);
              }}
              className='px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-[#dcebf6] dark:bg-slate-800 border border-blue-300 dark:border-slate-700 text-blue-950 dark:text-slate-200 hover:bg-[#cee2f1] dark:hover:bg-slate-700 shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition'
            >
              <span>⚖️ Panel</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl text-blue-950 dark:text-slate-200 hover:bg-[#dcebf6] dark:hover:bg-slate-800 border border-blue-300 dark:border-slate-700 transition cursor-pointer"
            aria-label="Menu"
          >
            <BsThreeDotsVertical size={16} />
          </button>

        </div>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-56 bg-[#f0f6fc] dark:bg-slate-900 border border-blue-300 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">

            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{user?.name || "ApnaVakil User"}</span>
              {user?.role === "lawyer" && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Advocate
                </span>
              )}
            </div>

            {user?.role === "lawyer" && (
              <button
                onClick={() => {
                  navigate('/lawyer/dashboard');
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-emerald-700 dark:text-emerald-400 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-bold"
              >
                ⚖️ Advocate Dashboard
              </button>
            )}

            <button
              onClick={() => {
                setShowConnectionsModal(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              🤝 My Lawyer Inquiries
            </button>

            <button
              onClick={() => {
                toggleDraft();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              {DraftMode ? "🤖 Switch to ChatBot" : "📄 Switch to Drafts"}
            </button>

            <button
              onClick={() => {
                navigate('/lawyers');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              👨‍⚖️ Verified Advocates
            </button>

            <button
              onClick={() => {
                setShowPricingBox(!showPricingBox);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#e2edf7] dark:hover:bg-slate-800 transition text-xs font-medium"
            >
              ⭐ Subscription Plans
            </button>

            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-t border-blue-200 dark:border-slate-800 transition text-xs font-bold"
            >
              🚪 Logout
            </button>

          </div>
        )}

      </div>

      {/* User Connections Modal */}
      <UserConnectionsModal
        isOpen={showConnectionsModal}
        onClose={() => setShowConnectionsModal(false)}
      />

    </header>
  );
};

export default Header;