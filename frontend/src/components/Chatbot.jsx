import React, { useState, useRef, useEffect, useContext } from "react";
import { PaperclipIcon, MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/GlobalContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const { history, showPrintPage, setShowPrintPage, setPrint, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, setUser, setIsPaid, setPlan } = useContext(AppContext);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [listening, setListening] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

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

    const handleSend = async () => {
        let plan = checkPlan();
        if (plan) {
            if ((!input.trim() && !file) || isTyping) return;

            const userMessage = { role: "user", parts: [] };
            if (input.trim()) userMessage.parts.push({ text: input });
            if (file) userMessage.parts.push({ text: "", file: filePreview, fileName: file.name, fileType: file.type });
            
            setHistory((prev) => [...prev, userMessage]);
            setInput("");
            setIsTyping(true);

            try {
                const formData = new FormData();
                formData.append("query", input);
                formData.append("history", JSON.stringify(history));
                formData.append("chatId", activeChat?._id || "not");
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
                            if (r.answer) botMessage = { role: "model", parts: [{ text: r}] };
                        } else {
                            botMessage = { role: "model", parts: [{ text: res.data.reply }] };
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
                        botMessage = { role: "model", parts: [{ text: "Error in generating response" }] };
                    }
                    else if (res.data.status === 20) {
                        toast.error("Your subscription is expired");
                        setIsPaid(false)
                        setPlan("free")
                        setShowPricingBox(true)
                        botMessage = { role: "model", parts: [{ text: "Error in generating response" }] };
                    }
                    else if (res.data.status === 21) {
                        setIsPaid(false)
                        setPlan("free")
                        toast.error("There was issue in your subscription plan please contact support");
                        botMessage = { role: "model", parts: [{ text: "Error in generating response" }] };
                    }
                    else {
                        botMessage = { role: "model", parts: [{ text: "Error in generating response" }] };
                    }
                }

                setHistory((prev) => [...prev, botMessage]);
                setIsTyping(false);

                if ((activeChat?._id || "not") === "not" && res.data.HID) {
                    setActiveChat({ _id: res.data.HID, messages: [userMessage, botMessage] });
                }
            } catch (err) {
                console.log(err);
                toast.error("Server error");
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
        <div className="flex-1 flex flex-col p-4 md:p-6 h-full w-[50vw]">
            <div className="flex-1 space-y-6 overflow-y-auto p-1">
                {history.map((msg, i) => {
                    let parsedMsg;
                    if (msg.role === "model") {
                        parsedMsg = {
                            ...msg,
                            parts: msg.parts.map((part, index) => {
                                if (index === 0 && typeof part.text === "string") {
                                    try {
                                        return { ...part, text: JSON.parse(part.text) };
                                    } catch (err) {
                                        return part; 
                                    }
                                }
                                return part;
                            }),
                        };
                    } else {
                        parsedMsg = msg;
                    }

                    return (
                        <div
                            key={i}
                            className={`flex px-2 overflow-auto ${parsedMsg?.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div className="flex max-w-[85%] items-end gap-2">
                                {parsedMsg.role === "model" && (
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
                                        alt="Bot Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}

                                <div
                                    className={`px-4 py-3 rounded-2xl break-words ${parsedMsg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    <div className="prose prose-lg break-words">
                                        {parsedMsg.parts.map((p, idx) => (
                                            <div key={idx} className="mb-3 flex flex-col gap-2">
                                                {p.text && (
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ inline, className, children, ...props }) {
                                                                const match = /language-(\w+)/.exec(className || "");
                                                                return !inline && match ? (
                                                                    <SyntaxHighlighter
                                                                        style={vscDarkPlus}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        className="rounded-lg shadow-lg my-4 overflow-x-auto"
                                                                        {...props}
                                                                    >
                                                                        {String(children).replace(/\n$/, "")}
                                                                    </SyntaxHighlighter>
                                                                ) : (
                                                                    <code
                                                                        className="bg-gray-200 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm"
                                                                        {...props}
                                                                    >
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {p.text?.answer || p.text}
                                                    </ReactMarkdown>
                                                )}

                                                {p.file && (
                                                    <div className="w-full mt-2">
                                                        {p.fileType?.startsWith("image/") ? (
                                                            <img
                                                                src={p.file}
                                                                alt={p.fileName}
                                                                className="w-full max-h-[25vh] object-contain rounded-lg shadow-md"
                                                            />
                                                        ) : (
                                                            <a
                                                                href={p.file}
                                                                download={p.fileName}
                                                                className="block w-full text-center text-blue-600 underline py-2 rounded-lg bg-gray-50 shadow-sm"
                                                            >
                                                                📎 {p.fileName}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

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

            <div>
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg p-2 focus-within:border-blue-500 transition-all duration-300">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about law..." className="w-full px-4 py-2 bg-transparent focus:outline-none" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    <button className="p-2 text-gray-500 hover:text-blue-600" onClick={() => fileInputRef.current.click()}><PaperclipIcon /></button>
                    <button className={`p-2 ${listening ? "text-red-500" : "text-gray-500"} hover:text-blue-600`} onClick={toggleListening}><MicIcon /></button>
                    <button onClick={handleSend} className="p-2 ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300" disabled={(!input.trim() && !file) || isTyping}><SendIcon /></button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
