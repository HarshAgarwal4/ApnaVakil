import React, { useEffect, useState, useContext } from 'react';
import { MenuIcon, PlusIcon } from './Icons';
import { toast } from 'react-toastify';
import axios from '../services/axios';
import { AppContext } from '../context/GlobalContext';

const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
    const [History, setHistory1] = useState([]);
    const { chat, setChat, setActiveChat, setHistory } = useContext(AppContext);

    async function fetchHistory() {
        try {
            let res = await axios.get('/fetchHistory');
            if (res.status === 200 && res.data.status === 1) {
                const historyData = res.data.data;
                setHistory1(Array.isArray(historyData) && historyData.length > 0 ? historyData.reverse() : []);
            }
        } catch (err) {
            console.log(err);
            toast.error('Error in fetching history');
        }
    }

    const clear = () => {
        setActiveChat(null);
        setHistory([]);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <aside
            className={`
                bg-gray-800 text-gray-200 flex flex-col
                transition-all duration-300 ease-in-out
                fixed sm:relative h-full z-50
                ${sidebarOpen 
                    ? "w-[60vw] sm:w-[20vw] opacity-100" 
                    : "w-0 sm:w-[20vw] opacity-0 overflow-hidden"
                }
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h1 className={`font-bold transition-all duration-300 ${!sidebarOpen && "opacity-0 text-xs sm:text-base"} text-base sm:text-xl`}>
                    Apna Vakil
                </h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md hover:bg-gray-700"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* New Chat */}
            <div className="p-4">
                <button
                    onClick={clear}
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
                >
                    <PlusIcon />
                    <span className={`ml-2 transition-opacity duration-300 ${!sidebarOpen && "opacity-0"}`}>New Chat</span>
                </button>
            </div>

            {/* History */}
            <nav className="flex flex-col px-4 pb-4 space-y-2 overflow-y-auto transition-opacity duration-300">
                <p className={`px-2 w-full text-xs sm:text-sm font-semibold text-gray-400 uppercase transition-opacity duration-300 ${!sidebarOpen && "opacity-0 text-center"}`}>
                    History
                </p>
                {History.map((item, i) => (
                    <button
                        onClick={() => setActiveChat(item)}
                        key={i}
                        className="flex w-full items-center p-2 text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                        <span className="flex-shrink-0">📄</span>
                        <span className={`ml-3 transition-opacity duration-300 ${!sidebarOpen && "opacity-0"}`}>
                            {item.messages[0].parts[0].text.slice(0, 15) + '...'}
                        </span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
