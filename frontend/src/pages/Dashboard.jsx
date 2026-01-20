import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/GlobalContext";
import axios from "../services/axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import RightSidebar from "../components/RightSidebar";
import Header from "../components/Header";
import PricingBox from "../components/payment";
import { useNavigate } from "react-router-dom";
import PrintDialog from "../components/print";
import Disclaimer from "../components/Disclaimer";

const Dashboard = () => {
    const { user, setUser, showPricingBox, setShowPricingBox,sidebarOpen, setSidebarOpen } = useContext(AppContext);
    const [disc , showdisc] = useState(false)
    const navigate = useNavigate()

    const logout = async () => {
        try {
            let res = await axios.post('/logout');
            if (res.status === 200) {
                if (res.data.status === 0) {
                    setUser(null);
                    return toast.error("something went wrong");
                }
                if (res.data.status === 1) {
                    toast.success("Logged out successfully");
                    setUser(null);
                }
            }
        } catch (err) {
            toast.error('server error');
            setUser(null);
        }
    };

    return (
        <div className="h-screen flex font-[Inter] bg-gray-100">
            {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            {showPricingBox && <PricingBox />}
            <PrintDialog />

            <div className="flex-1 flex flex-col">
                <Header user={user} logout={logout} />

                <main className="flex-1 flex overflow-hidden">
                    {disc ? <Disclaimer disc={disc} showdisc={showdisc} /> : <Chatbot disc={disc} showdisc={showdisc} />}
                    <RightSidebar />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;