import React, { useState, useRef, useEffect, useContext } from "react";
import { PaperclipIcon, MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import DraftUserMsg from "./DraftUserMSg";
import DraftBotMsg from "./DraftBotMsg";

const Draftbot = ({ disc, showdisc }) => {
    const { showPrintPage, setShowPrintPage, setPrint, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, setUser, setIsPaid, setPlan, All_Histories, user, activeDraft, DraftMode, YourDrafts , DraftChatHistory , setActiveDraft} = useStore()
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [listening, setListening] = useState(false);
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const [wi, setWi] = useState('desktop');
    const navigate = useNavigate()

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setWi("mobile");
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleSendMessage()
        }
        // If Shift + Enter, allow default behavior (new line)
    };

    // Initialize Speech Recognition for English
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US"; // English only

        recognition.onresult = (event) => {
            let finalText = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                finalText += event.results[i][0].transcript;
            }
            setInput(finalText);
        };

        recognition.onend = () => setListening(false);
        recognition.onerror = (err) => {
            console.error("Speech recognition error:", err);
            setListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            recognitionRef.current.start();
            setListening(true);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [DraftChatHistory, isTyping]);

    const handleSendMessage = async () => {
        let plan = checkPlan();
        if (plan) {
            if ((!input.trim()) || isTyping) return;
            const userMessage = { role: "user", content: input};
            DraftChatHistory.push(userMessage)
            setInput("");
            setIsTyping(true);

            try {
                let id = activeDraft?._id || "not"
                const data = {
                    query: input,
                    history: JSON.stringify(DraftChatHistory),
                    chatId: id
                }

                const res = await axios.post("/DraftChat", data);
                let botMessage;

                if (res.status === 200) {
                    if (res.data.status === 1) {
                        const r = res.data.reply
                        console.log(r)
                        botMessage = { role: "assistant", content: r}
                        if (r) setPrint(r)
                        if (id === 'not') {
                            let all_hist = {
                                _id: res.data.HID,
                                userId: user._id,
                                title: res.data.title,
                                messages: [userMessage, botMessage]
                            }
                           YourDrafts.drafts.unshift(all_hist)
                        }
                    }
                    else if (res.data.status === 15) {
                        toast.error("Unauthorized access");
                        setUser(null)
                        navigate('/login')
                    }
                    else if (res.data.status === 16) {
                        toast.error("Unauthorized access");
                        setUser(null)
                        navigate('/login')
                    }
                    else if (res.data.status === 17) {
                        toast.error("Unauthorized access");
                        setUser(null)
                        navigate('/login')
                    }
                    else if (res.data.status === 18) {
                        toast.error("Only one device allowed");
                        setUser(null)
                        navigate('/login')
                    }
                    else if (res.data.status === 19) {
                        toast.error("please purchase a plan");
                        setIsPaid(false)
                        setPlan("free")
                        setShowPricingBox(true)
                        botMessage = { role: "assistant", content: "Error in generating response"};
                    }
                    else if (res.data.status === 20) {
                        toast.error("Your subscription is expired");
                        setIsPaid(false)
                        setPlan("free")
                        setShowPricingBox(true)
                        botMessage = { role: "assistant", content: "Error in generating response"};
                    }
                    else if (res.data.status === 21) {
                        setIsPaid(false)
                        setPlan("free")
                        toast.error("There was issue in your subscription plan please contact support");
                        botMessage = { role: "assistant", content: "Error in generating response"};
                    }
                    else {
                        botMessage = { role: "assistant", content: "Error in generating response"};
                    }
                }
                DraftChatHistory.push(botMessage)
                //setHistory(b);
                setIsTyping(false);
                if ((activeDraft?._id || "not") === "not" && res.data.HID) {
                    setActiveDraft({
                        _id: res.data.HID,
                        userId: user._id,
                        title: res.data.title,
                        messages: [userMessage, botMessage]
                    });
                }
            } catch (err) {
                console.log(err)
                toast.error("Server error");
                let botMessage = { role: "assistant", content: 'Error in generating response'};
                DraftChatHistory.push(botMessage)
                // setHistory(b);
                setIsTyping(false);
            } finally {
                //something
            }
        } else {
            setShowPricingBox(true);
        }
    };

    return (
        <div className="flex-1 relative flex flex-col  h-full">
            <div className="absolute inset-0 z flex items-center justify-center pointer-events-none select-none">
                <span className="text-6xl  md:text-7xl font-extrabold text-slate-400/20 tracking-widest">
                    Drafts Mode
                </span>
            </div>

            <div className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto">
                {DraftChatHistory.map((msg, i) =>
                    msg.role === "user" ? (
                        <DraftUserMsg key={i} msg={msg} />
                    ) : (
                        <DraftBotMsg key={i} msg={msg} />
                    )
                )}

                {isTyping && (
                    <div className="flex items-end gap-3">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
                            alt="Bot Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>


            
            {/* Input form */}
            <div className="px-6">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg p-2 focus-within:border-blue-500 transition-all duration-300 max-w-full">

                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={wi === 'mobile' ? "press Shift + enter to send" : "Ask me anything..."}
                        className="w-full px-4 py-2 bg-transparent focus:outline-none resize-none"
                        onKeyDown={handleKeyDown}
                        style={{ minHeight: "48px" }}
                    />

                    {/* Mic Button */}
                    <button
                        className={`p-2 ${listening ? "text-red-500" : "text-gray-500"} hover:text-blue-600`}
                        onClick={toggleListening}
                    >
                        <MicIcon />
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        className="p-2 ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={!input.trim() || isTyping}
                    >
                        <SendIcon />
                    </button>

                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-white border-t-1 mt-1 py-2">
                <div onClick={() => { showdisc(!disc) }} className="mx-auto max-w-3xl rounded-lg border hover:cursor-pointer border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    <p>
                        <strong>Apna Vakil</strong> provides general legal information only.
                        This is <strong>not legal advice</strong>. Consult a qualified advocate for legal matters.
                    </p>
                </div>
            </div>

        </div>
    );
};