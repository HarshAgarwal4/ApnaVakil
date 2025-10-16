import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/GlobalContext';

const Header = ({ user, logout }) => {
    const navigate = useNavigate();
    const {showPricingBox, setShowPricingBox } = useContext(AppContext)
    return (
        <header className="flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">{user?.name || 'User'}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-xl">
                    <li><button onClick={logout}>Logout</button></li>
                    <li><button onClick={() => {setShowPricingBox(!showPricingBox)}}>Subscription</button></li>
                </ul>
            </div>
        </header>
    );
};

export default Header;