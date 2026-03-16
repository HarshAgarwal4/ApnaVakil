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
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setRightSideBarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 right-0
          h-full
          w-[85vw] max-w-sm lg:w-80
          bg-white
          p-6
          border-l
          flex flex-col gap-6
          z-50
          transform transition-transform duration-300
          ${rightSideBarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-blue-900">{DraftMode ? 'Draft Panel' : 'Panel'}</h3>
          <button
            onClick={() => setRightSideBarOpen(false)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => setShowPrintPage(true)}
          className="bg-gray-50 p-4 overflow-auto rounded-lg hover:bg-blue-500 hover:text-white"
        >
          Print
        </button>

        {DraftMode ? (
          isMobile ? (
            <div className="border border-gray-200 rounded-xl p-4 overflow-y-auto bg-gray-50 shadow-sm max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
  {document && <DraftBotMsg msg={document} />}
</div>
          ) : ( 
            <DraftChat />
          )
        ) : (
          <>
            <Article />
            <Lawyers />
          </>
        )}
      </aside>
    </>
  );
};

export default RightSidebar;