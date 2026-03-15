import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import { Search } from 'lucide-react';
import ConsultationModal from './LawyerModal';
import { FaBars } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    showPricingBox,
    setShowPricingBox,
    user,
    logout,
    sidebarOpen,
    setSidebarOpen,
    DraftMode,
    setDraft,
    Lawyers
  } = useStore();

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("lawyers");
  const [box, setBox] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLawyer, setCurrentLawyer] = useState(null);

  // 🔥 SEARCH MODES (Enable "laws" later by uncommenting)
  const SEARCH_MODES = [
    { value: "lawyers", label: "Lawyers" },
    // { value: "laws", label: "Laws" }, // enable in future
  ];

  function toggleDraft() {
    if (location.pathname === '/lawyers') {
      navigate('/dashboard');
    } else {
      setDraft(!DraftMode);
    }
  }

  // 🔥 Live Search Effect
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
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-blue-100 shadow-sm relative">

      {/* LEFT */}
      <div className='flex items-center gap-3'>
        <div onClick={() => setSidebarOpen(!sidebarOpen)}>
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

        <div className="hidden md:flex items-center 
                                bg-blue-50 border border-blue-200 
                                rounded-full px-5 py-2 w-[40vw] 
                                focus-within:ring-2 focus-within:ring-blue-900 
                                transition-all">

          {/* Mode Dropdown */}
          {/* <div className="relative mr-4">
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="appearance-none bg-transparent pr-6 
                                       text-sm font-medium text-blue-900 
                                       outline-none cursor-pointer"
                        >
                            {SEARCH_MODES.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>

                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500 text-xs pointer-events-none">
                            ▼
                        </span>
                    </div> */}

          <div className="h-5 w-px bg-blue-200 mr-4"></div>

          {/* Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${mode}...`}
            className="flex-1 bg-transparent outline-none text-sm text-blue-900 placeholder:text-blue-400"
          />

          <Search size={18} className="ml-3 text-blue-600" />
        </div>

        {/* 🔥 Live Search Dropdown */}
        {mode === "lawyers" && search && (
          <div className="absolute mt-2 w-[40vw] bg-white 
                                    border border-blue-100 rounded-xl 
                                    shadow-xl max-h-64 overflow-y-auto z-50">

            {box.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">
                No Lawyers found
              </div>
            ) : (
              box.map((itm) => (
                <div
                  key={itm._id}
                  className="flex items-center gap-3 px-4 py-3 
                                               hover:bg-blue-50 cursor-pointer transition"
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

      {/* RIGHT */}
      <div className='flex gap-4 items-center'>

        <button
          onClick={toggleDraft}
          className='px-4 py-2 bg-blue-900 text-white rounded-lg 
                               hover:bg-blue-800 text-sm transition'
        >
          {DraftMode ? "ChatBot" : "Drafts"}
        </button>

        <button
          onClick={() => navigate('/lawyers')}
          className='px-4 py-2 border border-blue-900 text-blue-900 
                               rounded-lg hover:bg-blue-50 text-sm transition'
        >
          Lawyers
        </button>

        {/* USER DROPDOWN */}
        <div className="relative group">
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 
                                    rounded-lg cursor-pointer 
                                    hover:bg-blue-100 text-sm text-blue-900 transition">
            {user?.name || 'User'}
          </div>

          <div className="absolute right-0 mt-2 w-52 bg-white 
                                    border border-blue-100 rounded-xl 
                                    shadow-xl opacity-0 invisible 
                                    group-hover:opacity-100 
                                    group-hover:visible 
                                    transition-all duration-200">

            <button
              onClick={() => setShowPricingBox(!showPricingBox)}
              className="block w-full text-left px-4 py-3 
                                       text-blue-900 hover:bg-blue-50 
                                       rounded-t-xl transition"
            >
              Subscription
            </button>

            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 
                                       text-red-600 hover:bg-red-50 
                                       rounded-b-xl transition"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;