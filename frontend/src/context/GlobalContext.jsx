import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "../services/axios";
import { toast } from "react-toastify";

const AppContext = createContext()

const GlobalContext = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState([])
    const [history, setHistory] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [article, setArticle] = useState(null);
    const [lawyer, setLawyer] = useState([]);
    const [plan, setPlan] = useState(null)
    const [isPaid, setIsPaid] = useState(false)
    const [showPricingBox, setShowPricingBox] = useState(false);
    const [print , setPrint] = useState(null)
    const [showPrintPage , setShowPrintPage] = useState(false)
    const [ sidebarOpen, setSidebarOpen ] = useState(true)

    useEffect(() => {
        if (activeChat) {
            setHistory(activeChat.messages)
        }
    }, [activeChat])

    async function fetchUser() {
        try {
            let res = await axios.get('/me')
            if (res.status === 200) {
                if (res.data.status === 0) return toast.error('something went wrong')
                if (res.data.status === 2) return toast.error('Invalid User')
                if (res.data.status === 8) return toast.error('unauthorized access')
                if (res.data.status === 10) return toast.error('user not found')
                if (res.data.status === 1) {
                    toast.success("User fetched succesfully")
                    setUser(res.data.data)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error('server error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
       checkPlan()
    }, [user])

    function checkPlan() {
        if (!user) return false;

        const paidPlans = ["Basic", "Premium"];

        if (paidPlans.includes(user.plan)) {
            setPlan(user.plan);
            setIsPaid(true);
            return true;
        }

        return false;
    }

    useEffect(() => {
        const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint
        setSidebarOpen(!isMobile); // open on desktop, closed on mobile
        fetchUser()
    }, [])

    return (
        <AppContext.Provider value={{ user, setUser, fetchUser, loading, setLoading, chat, setChat, history, setHistory, activeChat, setActiveChat, article, setArticle, lawyer, setLawyer, checkPlan, plan, setPlan, isPaid, setIsPaid, showPricingBox, setShowPricingBox,print , setPrint, showPrintPage , setShowPrintPage, sidebarOpen, setSidebarOpen}} >{children} </AppContext.Provider>
    )
}

export { GlobalContext, AppContext }