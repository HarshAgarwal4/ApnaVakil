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
    const { history, showPrintPage, setShowPrintPage, setPrint, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, activeDraft, DraftMode, setUser, setIsPaid, setPlan, All_Histories, user } = useStore()
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

    return (
        <div className="flex-1 relative flex flex-col  h-full">

            <div className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto">

                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center mt-16 space-y-6">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
                            className="w-16 h-16"
                            alt="bot"
                        />

                        <div>
                            <h2 className="text-2xl font-semibold text-blue-900">
                                Hello {user?.name || "there"} 👋
                            </h2>
                            <p className="text-gray-600 mt-2">
                                How can your legal assistant help today?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl w-full">

                            <button
                                onClick={() => setInput("What should I do if I receive a legal notice?")}
                                className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 text-sm"
                            >
                                📄 What should I do if I receive a legal notice?
                            </button>

                            <button
                                onClick={() => setInput("How can I file a consumer complaint in India?")}
                                className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 text-sm"
                            >
                                ⚖️ How can I file a consumer complaint?
                            </button>

                            <button
                                onClick={() => setInput("Explain FIR and how to file it")}
                                className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 text-sm"
                            >
                                🚔 Explain FIR and how to file it
                            </button>

                            <button
                                onClick={() => setInput("What are my rights during police questioning?")}
                                className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 text-sm"
                            >
                                🛡️ Rights during police questioning
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


            {filePreview && (
                <div className="h-[10vh] bg-blue-50 rounded-lg">
                    {file.type.startsWith("image/") ? (
                        <div className="flex items-center gap-4 p-2 h-[100%]">
                            <img src={filePreview} alt="preview" className="h-[100%] aspect-square rounded-lg border border-gray-300" />
                            <p className="text-sm text-gray-700">📎 {file.name} ({Math.round(file.size / 1024)} KB)</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-700">📎 {file.name} ({Math.round(file.size / 1024)} KB)</p>
                    )}
                </div>
            )}

            <div className="px-6">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg p-2 focus-within:border-blue-500 transition-all duration-300 **max-w-full**">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={wi === 'mobile' ? "press Shift + enter to send" : 'Ask me anything...'}
                        className="w-full px-4 py-2 bg-transparent focus:outline-none resize-none"
                        onKeyDown={handleKeyDown}
                        style={{ minHeight: '48px' }}
                    />
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    <button className="p-2 text-gray-500 hover:text-blue-600" onClick={() => fileInputRef.current.click()}><PaperclipIcon /></button>
                    <button className={`p-2 ${listening ? "text-red-500" : "text-gray-500"} hover:text-blue-600`} onClick={toggleListening}><MicIcon /></button>
                    <button onClick={handleSendMessage} className="p-2 ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300" disabled={(!input.trim() && !file) || isTyping}><SendIcon /></button>
                </div>
            </div>

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

export default Chatbot;