import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';

const Header = ({ user, logout }) => {
    const navigate = useNavigate();
    const { showPricingBox, setShowPricingBox, sidebarOpen, setSidebarOpen , DraftMode , setDraft} = useStore()
    function toggleDraft() {
        console.log(!DraftMode)
        setDraft(!DraftMode)
    }
    return (
        <header className="flex justify-between items-center px-4  bg-white border-b">
            <div className='flex justify-center items-center'>
                <img onClick={() => { setSidebarOpen(!sidebarOpen) }} className='cursor-pointer w-15 md:w-20 p-0' src="/logo.png" alt="logo" />
                <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
            </div>
            <div className='flex gap-5'>
                <button onClick={toggleDraft} className='btn m-1'>
                    {DraftMode?"ChatBot" :"Drafts"}
                </button>
                <button onClick={() => navigate('/lawyers')} className='btn m-1'>
                    Lawyers
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn m-1">{user?.name || 'User'}</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-xl">
                        <li><button onClick={logout}>Logout</button></li>
                        <li><button onClick={() => { setShowPricingBox(!showPricingBox) }}>Subscription</button></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;