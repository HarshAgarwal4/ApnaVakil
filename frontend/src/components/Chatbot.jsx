import React, { useState, useRef, useEffect, useContext } from "react";
import { PaperclipIcon, MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate } from "react-router-dom";
import BotMsg from "./BotMsg";
import UserMsg from "./UserMsg";
import { useStore } from "../zustand/store";

const Chatbot = ({ disc, showdisc }) => {
    const { history, showPrintPage, setShowPrintPage, setPrint, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, activeDraft, DraftMode, setUser, setIsPaid, setPlan, All_Histories, user, theme } = useStore();
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [listening, setListening] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const [wi, setWi] = useState('desktop');

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setWi("mobile");
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleSendMessage();
        }
        // If Shift + Enter, allow default behavior (new line)
    };

    const navigate = useNavigate()

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
    }, [history, isTyping]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setFilePreview(URL.createObjectURL(selected));
        }
    };

    function extractJSON(text) {
        try {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
        } catch (err) {
            console.error("Invalid JSON:", err);
        }
        return null;
    }

    const handleSendMessage = async () => {
        let plan = checkPlan();
        if (plan) {
            if ((!input.trim() && !file) || isTyping) return;
            const userMessage = { role: "user", parts: [] };
            if (input.trim()) userMessage.parts.push({ text: input });
            if (file) userMessage.parts.push({ text: "", file: filePreview, fileName: file.name, fileType: file.type });
            history.push(userMessage)
            // setHistory(a);
            setInput("");
            setIsTyping(true);

            try {
                let id = activeChat?._id || "not"
                const formData = new FormData();
                formData.append("query", input);
                formData.append("history", JSON.stringify(history));
                formData.append("chatId", id);
                if (file) formData.append("file", file);

                const res = await axios.post("/chat", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                let botMessage;

                if (res.status === 200) {
                    if (res.data.status === 1) {
                        const r = res.data.reply
                        if (r) {
                            if (r.law) setArticle(r.law);
                            if (r.lawyers) setLawyer(r.lawyers);
                            if (r.print) setPrint(r.print)
                            if (r.answer) botMessage = { role: "model", parts: [{ text: JSON.stringify(r) }] };
                        } else {
                            botMessage = { role: "model", parts: [{ text: res.data.reply }] };
                        }
                        if (id === 'not') {
                            let all_hist = {
                                _id: res.data.HID,
                                userId: user._id,
                                title: res.data.title,
                                messages: [userMessage, botMessage]
                            }
                            All_Histories.all_h.unshift(all_hist)
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
                        botMessage = { role: "model", parts: [{ text: JSON.stringify({ answer: 'Error in generating response' }) }] };
                    }
                    else if (res.data.status === 20) {
                        toast.error("Your subscription is expired");
                        setIsPaid(false)
                        setPlan("free")
                        setShowPricingBox(true)
                        botMessage = { role: "model", parts: [{ text: JSON.stringify({ answer: 'Error in generating response' }) }] };
                    }
                    else if (res.data.status === 21) {
                        setIsPaid(false)
                        setPlan("free")
                        toast.error("There was issue in your subscription plan please contact support");
                        botMessage = { role: "model", parts: [{ text: JSON.stringify({ answer: 'Error in generating response' }) }] };
                    }
                    else {
                        botMessage = { role: "model", parts: [{ text: JSON.stringify({ answer: 'Error in generating response' }) }] };
                    }
                }
                history.push(botMessage)
                //setHistory(b);
                setIsTyping(false);
                if ((activeChat?._id || "not") === "not" && res.data.HID) {
                    setActiveChat({
                        _id: res.data.HID,
                        userId: user._id,
                        title: res.data.title,
                        messages: [userMessage, botMessage]
                    });
                }
            } catch (err) {
                console.log(err)
                toast.error("Server error");
                let botMessage = { role: "model", parts: [{ text: JSON.stringify({ answer: 'Error in generating response' }) }] };
                history.push(botMessage)
                // setHistory(b);
                setIsTyping(false);
            } finally {
                setFile(null);
                setFilePreview(null);
            }
        } else {
            setShowPricingBox(true);
        }
    };

    const isDark = theme === "dark";

    return (
        <div className={`flex-1 relative flex flex-col h-full transition-colors duration-300 ${
            isDark ? "bg-slate-950 text-slate-100" : "bg-[#eaf2f8] text-blue-950"
        }`}>

            <div className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto">

                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center mt-12 sm:mt-16 space-y-6 max-w-2xl mx-auto">

                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 p-0.5 shadow-lg shadow-blue-900/10 flex items-center justify-center">
                            <div className="w-full h-full bg-[#f0f6fc] dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    className="w-10 h-10 object-contain"
                                    alt="bot"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white tracking-tight">
                                Hello, {user?.name || "there"} 👋
                            </h2>
                            <p className="text-blue-900/70 dark:text-slate-400 mt-2 text-sm sm:text-base font-semibold">
                                How can your AI legal assistant help you today?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">

                            <button
                                onClick={() => setInput("What should I do if I receive a legal notice for cheque bounce?")}
                                className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs ${
                                    isDark
                                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-800/80"
                                        : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:border-blue-500 hover:bg-[#dcebf6]"
                                }`}
                            >
                                📄 Notice for cheque bounce (Sec 138)
                            </button>

                            <button
                                onClick={() => setInput("How can I file a consumer complaint under Consumer Protection Act 2019?")}
                                className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs ${
                                    isDark
                                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-800/80"
                                        : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:border-blue-500 hover:bg-[#dcebf6]"
                                }`}
                            >
                                ⚖️ Filing a consumer complaint
                            </button>

                            <button
                                onClick={() => setInput("Explain FIR procedures and zero FIR under Bharatiya Nagarik Suraksha Sanhita (BNSS)")}
                                className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs ${
                                    isDark
                                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-800/80"
                                        : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:border-blue-500 hover:bg-[#dcebf6]"
                                }`}
                            >
                                🚔 Explain Zero FIR & BNSS 2023
                            </button>

                            <button
                                onClick={() => setInput("What are statutory tenant protections under Rent Control Acts?")}
                                className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs ${
                                    isDark
                                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-800/80"
                                        : "bg-[#f0f6fc] border-blue-300 text-blue-950 hover:border-blue-500 hover:bg-[#dcebf6]"
                                }`}
                            >
                                🛡️ Tenant eviction defense rules
                            </button>

                        </div>

                    </div>
                )}

                {history.map((msg, i) =>
                    msg.role === "user" ? (
                        <UserMsg key={i} msg={msg} />
                    ) : (
                        <BotMsg key={i} msg={msg} />
                    )
                )}

                {isTyping && (
                    <div className="flex items-center py-2 px-2 sm:px-4">
                        <div className="flex items-center space-x-2 py-1">
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                            <span className="text-xs font-semibold text-blue-900/60 dark:text-slate-400 ml-1">AI Assistant is researching…</span>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {filePreview && (
                <div className={`mx-3 sm:mx-6 mb-2 p-2 rounded-xl border flex items-center gap-3 ${
                    isDark ? "bg-slate-900 border-slate-800" : "bg-[#f0f6fc] border-blue-300 shadow-sm"
                }`}>
                    {file.type.startsWith("image/") ? (
                        <img src={filePreview} alt="preview" className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg border border-blue-300 dark:border-slate-700" />
                    ) : null}
                    <p className="text-xs font-bold text-blue-950 dark:text-slate-300 truncate">
                        📎 {file.name} ({Math.round(file.size / 1024)} KB)
                    </p>
                    <button
                        onClick={() => { setFile(null); setFilePreview(null); }}
                        className="ml-auto text-xs text-red-500 font-bold hover:underline px-2 cursor-pointer"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Input Bar */}
            <div className="px-2.5 sm:px-6 pb-2">
                <div className={`flex items-center rounded-2xl p-1.5 sm:p-2 border-2 transition-all duration-200 shadow-lg ${
                    isDark
                        ? "bg-slate-900 border-slate-700 focus-within:border-indigo-500 shadow-black/40"
                        : "bg-[#f4f9fd] border-blue-300 hover:border-blue-400 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 shadow-blue-900/5"
                }`}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={wi === 'mobile' ? "Type legal query..." : "Ask any legal question under BNS, IPC, or Civil law..."}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent focus:outline-none resize-none text-xs sm:text-sm ${
                            isDark ? "text-white placeholder-slate-500" : "text-blue-950 placeholder:text-blue-900/40 font-semibold"
                        }`}
                        onKeyDown={handleKeyDown}
                        style={{ minHeight: '40px' }}
                    />
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    
                    <button
                        type="button"
                        className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer ${
                            isDark
                                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                                : "text-blue-900/70 hover:text-blue-950 hover:bg-[#e2edf7]"
                        }`}
                        onClick={() => fileInputRef.current.click()}
                        title="Attach Document/Image"
                    >
                        <PaperclipIcon />
                    </button>

                    <button
                        type="button"
                        className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer ${
                            listening
                                ? "text-red-500 bg-red-50 dark:bg-red-950/40 animate-pulse"
                                : isDark
                                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                                : "text-blue-900/70 hover:text-blue-950 hover:bg-[#e2edf7]"
                        }`}
                        onClick={toggleListening}
                        title="Voice Input"
                    >
                        <MicIcon />
                    </button>

                    <button
                        type="button"
                        onClick={handleSendMessage}
                        className="p-2 sm:p-2.5 ml-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-xl hover:opacity-95 shadow-md shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0 cursor-pointer"
                        disabled={(!input.trim() && !file) || isTyping}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>

            {/* Desktop Full Statutory Disclaimer Banner */}
            <div className={`hidden md:block px-4 sm:px-6 py-2 border-t transition-colors ${
                isDark ? "bg-slate-950 border-slate-800/80" : "bg-[#e2edf7] border-blue-200/90"
            }`}>
                <div
                    onClick={() => showdisc(!disc)}
                    className={`mx-auto max-w-4xl rounded-xl border p-2.5 text-xs flex items-start gap-2 cursor-pointer transition ${
                        isDark
                            ? "border-amber-800/60 bg-amber-950/30 text-amber-300 hover:bg-amber-950/50"
                            : "border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100/90 shadow-xs"
                    }`}
                >
                    <span className="text-amber-500 shrink-0">⚖️</span>
                    <p className="leading-relaxed">
                        <strong>Statutory Notice:</strong> ApnaVakil provides legal information & AI-assisted research only under BCI Rule 36. This is <strong>not formal legal counsel</strong>. Consult verified advocates for active courtroom litigation.
                    </p>
                </div>
            </div>

            {/* Mobile Compact Disclaimer Banner */}
            <div className={`block md:hidden px-3 py-1.5 border-t transition-colors text-center ${
                isDark ? "bg-slate-950 border-slate-800/80" : "bg-[#e2edf7] border-blue-200/90"
            }`}>
                <div
                    onClick={() => showdisc(!disc)}
                    className="inline-flex items-center justify-center gap-1.5 text-[10px] text-amber-800 dark:text-amber-300 hover:underline cursor-pointer font-semibold"
                >
                    <span>⚖️</span>
                    <span>
                        <strong>Statutory Disclaimer:</strong> AI research only under BCI Rule 36 • Not formal counsel • <u>Read Notice</u>
                    </span>
                </div>
            </div>

        </div>
    );
};

export default Chatbot;