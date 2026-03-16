import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import { Search } from 'lucide-react';
import ConsultationModal from './LawyerModal';
import { FaBars } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    setRightSideBarOpen
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

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-blue-100 shadow-sm relative z-[100]">

      {/* LEFT */}
      <div className='flex items-center gap-3'>
        <div onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer">
          <FaBars size={24} />
        </div>

        <h2 className="text-sm sm:text-md md:text-lg font-semibold text-blue-900 tracking-wide">
          Apna Vakil
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

        <div className="hidden md:flex items-center bg-blue-50 border border-blue-200 rounded-full px-5 py-2 w-[40vw] focus-within:ring-2 focus-within:ring-blue-900 transition-all">

          <div className="h-5 w-px bg-blue-200 mr-4"></div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${mode}...`}
            className="flex-1 bg-transparent outline-none text-sm text-blue-900 placeholder:text-blue-400"
          />

          <Search size={18} className="ml-3 text-blue-600" />
        </div>

        {mode === "lawyers" && search && (
          <div className="absolute mt-2 w-[40vw] bg-white border border-blue-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">

            {box.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">
                No Lawyers found
              </div>
            ) : (
              box.map((itm) => (
                <div
                  key={itm._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => {
                    setCurrentLawyer(itm);
                    setShowModal(true);
                    setSearch("");
                    setBox([]);
                  }}
                >
                  <img
                    src={itm.images}
                    alt={itm.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm text-blue-900 font-medium">
                    {itm.name}
                  </span>
                </div>
              ))
            )}

          </div>
        )}

      </div>

      {/* DESKTOP RIGHT BUTTONS */}
      <div className='hidden md:flex gap-4 items-center'>

        <button
          onClick={toggleDraft}
          className='px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm transition'
        >
          {DraftMode ? "ChatBot" : "Drafts"}
        </button>

        <button
          onClick={() => navigate('/lawyers')}
          className='px-4 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 text-sm transition'
        >
          Lawyers
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">

          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 text-sm text-blue-900 transition"
          >
            {user?.name || "User"}
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-blue-100 rounded-xl shadow-xl z-50">

              <button
                onClick={() => {
                  setShowPricingBox(!showPricingBox);
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-blue-900 hover:bg-blue-50 rounded-t-xl transition"
              >
                Subscription
              </button>

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl transition"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {/* MOBILE THREE DOT MENU */}
      <div className="md:hidden relative">

        <div className='flex justify-center gap-2'>

          {DraftMode ? (
            <button
              onClick={() => setRightSideBarOpen(!rightSideBarOpen)}
              className='btn'
            >
              View Draft
            </button>
          ) : (
            <button
              onClick={() => setRightSideBarOpen(!rightSideBarOpen)}
              className='btn'
            >
              Panel
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2"
          >
            {menuOpen ? "❌" : <BsThreeDotsVertical size={22} />}
          </button>

        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-blue-100 rounded-xl shadow-xl z-50">

            <button
              onClick={() => {
                toggleDraft();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-blue-900 hover:bg-blue-50 transition"
            >
              {DraftMode ? "ChatBot" : "Drafts"}
            </button>

            <button
              onClick={() => {
                navigate('/lawyers');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-blue-900 hover:bg-blue-50 transition"
            >
              Lawyers
            </button>

            <button
              onClick={() => {
                setShowPricingBox(!showPricingBox);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-blue-900 hover:bg-blue-50 transition"
            >
              Subscription
            </button>

            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl transition"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
};

export default Header;