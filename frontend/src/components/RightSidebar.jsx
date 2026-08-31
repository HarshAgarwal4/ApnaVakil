import React, { useEffect, useState } from 'react';
import Article from './Article';
import Lawyers from './Lawyers';
import DraftChat from './DraftChat';
import { useStore } from '../zustand/store';
import { X } from 'lucide-react';
import DraftBotMsg from './DraftBotMsg';

const RightSidebar = () => {
  const { rightSideBarOpen, setRightSideBarOpen, setShowPrintPage, DraftMode, document } = useStore();
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true)
    }
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {rightSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[998] lg:hidden transition-opacity"
          onClick={() => setRightSideBarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 right-0
          h-full
          w-[88vw] max-w-sm lg:w-80
          bg-[#ebf4fa] dark:bg-slate-900 text-blue-950 dark:text-slate-100
          p-4 sm:p-5
          border-l border-blue-200/90 dark:border-slate-800
          flex flex-col gap-4 sm:gap-5
          z-[999] lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${rightSideBarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-blue-200/90 dark:border-slate-800">
          <h3 className="font-black text-blue-950 dark:text-white text-sm">{DraftMode ? 'Document Workspace' : 'Legal Intelligence Panel'}</h3>
          <button
            onClick={() => setRightSideBarOpen(false)}
            className="p-1.5 rounded-lg border border-blue-300 dark:border-slate-700 text-blue-900 hover:text-blue-950 dark:hover:text-white hover:bg-[#dcebf6] dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => setShowPrintPage(true)}
          className="bg-[#dcebf6] hover:bg-blue-800 hover:text-white dark:bg-slate-800 text-blue-950 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white font-bold p-3 rounded-xl border border-blue-300 dark:border-slate-700 shadow-sm transition-all text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <span>🖨️ Export / Print Document</span>
        </button>

        {DraftMode ? (
          isMobile ? (
            <div className="border border-slate-300 dark:border-slate-800 rounded-2xl p-4 overflow-y-auto bg-white dark:bg-slate-950 shadow-sm max-h-[400px] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {document && <DraftBotMsg msg={document} />}
            </div>
          ) : ( 
            <DraftChat />
          )
        ) : (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <Article />
            <Lawyers />
          </div>
        )}
      </aside>
    </>
  );
};

export default RightSidebar;