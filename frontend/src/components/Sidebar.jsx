import React, { useEffect, useState } from 'react';
import { MenuIcon, PlusIcon } from './Icons';
import { toast } from 'react-toastify'
import axios from '../services/axios';
import { useContext } from 'react';
import { AppContext } from '../context/GlobalContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const [History, setHistory1] = useState([])
    const { chat, setChat, setActiveChat, setHistory } = useContext(AppContext)

    async function fetchHistory() {
        try {
            let res = await axios.get('/fetchHistory')
            if (res.status === 200) {
                if (res.data.status === 1) {
                    const historyData = res.data.data;

                    if (Array.isArray(historyData) && historyData.length > 0) {
                        setHistory1(historyData.reverse());
                    } else {
                        setHistory1([]);
                    }
                }
            }
        } catch (err) {
            console.log(err)
            toast.error('Error in fetching history')
        }
    }

    const clear = () => {
        setActiveChat(null)
        setHistory([])
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    return (
        <aside className={`bg-gray-800 text-gray-200 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-[20vw]" : "w-20"}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>Apna Vakil</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-700">
                    <MenuIcon />
                </button>
            </div>
            <div className="p-4">
                <button className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                    <PlusIcon />
                    <span onClick={clear} className={`ml-2 ${!sidebarOpen && "hidden"}`}>New Chat</span>
                </button>
            </div>
            <nav className="flex flex-col px-4 pb-4 space-y-2 overflow-y-auto">
                <p className={`px-2 w-[100%] text-xs font-semibold text-gray-400 uppercase ${!sidebarOpen && "text-center"}`}>History</p>
                {History.map((item, i) => (
                    <button
                        onClick={() => setActiveChat(item)}
                        key={i}
                        className="flex w-[100%] items-center p-2 text-sm rounded-lg hover:bg-gray-700"
                    >
                        <span className="flex-shrink-0">📄</span>
                        <span className={`ml-3 ${!sidebarOpen && "hidden"}`}>{item.messages[0].parts[0].text.slice(0, 15) + '...'}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;