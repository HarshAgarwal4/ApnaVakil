import React, { useEffect, useRef, useState } from "react";
import { MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import DraftUserMsg from "./DraftUserMSg";
import DraftBotSidebarMsg from "./DraftBotSidebarMSg";

const DraftChat = () => {
  const {
    DraftChatHistory,
    checkPlan,
    setShowPricingBox,
    user,
    activeDraft,
    setActiveDraft,
    setPrint,
    setUser,
    setIsPaid,
    setPlan,
    YourDrafts,
    setDocument,
    document,
  } = useStore();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  /* Speech Recognition */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setInput(text);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    listening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
    setListening(!listening);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [DraftChatHistory, isTyping]);

  /* Send Message */
  const sendMessage = async () => {
    if (!checkPlan()) {
      setShowPricingBox(true);
      return;
    }

    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    DraftChatHistory.push(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      let id = activeDraft?._id || "not";
      let d = null, s = null, mode = "normal";

      if (document && document !== "null") {
        d = document;
        mode = "document";
      }

      const res = await axios.post("/DraftChat", {
        query: userMsg.content,
        history: JSON.stringify(DraftChatHistory),
        chatId: id,
        document1: d,
        mode: mode,
        select: s
      });

      if (res.data.status === 1) {
        const botMsg = { role: "assistant", content: res.data.reply };
        DraftChatHistory.push(botMsg);

        if (res.data.document) setDocument(res.data.document);

        if (id === "not") {
          let a = {
            _id: res.data.HID,
            userId: user._id,
            title: res.data.title,
            messages: [userMsg, botMsg],
            document: res.data.document
          };

          YourDrafts.drafts.unshift(a);

          setActiveDraft({
            _id: res.data.HID,
            userId: user._id,
            title: res.data.title,
            messages: [userMsg, botMsg],
            document: res.data.document
          });
        }

      } else {
        handleAuthErrors(res.data.status);
      }

    } catch (err) {
      console.log(err);
      DraftChatHistory.push({
        role: "assistant",
        content: "Error in generating response",
      });
      toast.error("Server error");
    } finally {
      setIsTyping(false);
    }
  };

  const handleAuthErrors = (status) => {
    if ([15, 16, 17, 18].includes(status)) {
      toast.error("Unauthorized access");
      setUser(null);
      navigate("/login");
    }

    if ([19, 20, 21].includes(status)) {
      toast.error("Please purchase a plan");
      setIsPaid(false);
      setPlan("free");
      setShowPricingBox(true);
    }
  };

    const { theme } = useStore();
    const isDark = theme === "dark";

    return (
    <div className={`flex flex-col h-full w-full min-h-0 rounded-2xl border transition-colors shadow-xs overflow-hidden ${
      isDark
        ? "bg-slate-900 border-slate-800 text-slate-100"
        : "bg-[#ebf4fa] border-blue-200/90 text-blue-950"
    }`}>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3 scrollbar-thin">

        {DraftChatHistory.length === 0 && (
          <div className="text-center py-8 px-3 space-y-2">
            <p className="text-xs font-black text-blue-950 dark:text-slate-400">
              Legal Drafting Assistant
            </p>
            <p className="text-[11px] text-blue-900/60 dark:text-slate-400 font-medium">
              Give instructions to generate clauses, modify terms, or format legal documents.
            </p>
          </div>
        )}

        {DraftChatHistory.map((msg, i) =>
          msg.role === "user" ? (
            <DraftUserMsg key={i} msg={msg} />
          ) : (
            <DraftBotSidebarMsg key={i} msg={msg} />
          )
        )}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-indigo-400 px-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
            <span className="ml-1">AI Drafter is drafting…</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-2 md:p-3 transition-colors ${
        isDark ? "border-slate-800 bg-slate-950/60" : "border-blue-200/90 bg-[#dcebf6]"
      }`}>
        <div className={`flex items-end gap-2 rounded-xl px-3 py-2 border transition-all ${
          isDark
            ? "bg-slate-900 border-slate-700 focus-within:border-indigo-500"
            : "bg-[#f4f9fd] border-blue-300 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs"
        }`}>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Instruct AI Drafter (e.g. 'Add termination clause with 30-day notice')..."
            className="flex-1 resize-none bg-transparent px-1 py-1 focus:outline-none text-xs sm:text-sm max-h-32 text-blue-950 dark:text-white placeholder:text-blue-900/40 font-semibold"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg transition ${
              listening
                ? "bg-red-500 text-white"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-blue-900/70 hover:text-blue-950 hover:bg-[#e2edf7]"
            }`}
          >
            <MicIcon />
          </button>

          <button
            type="button"
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white hover:opacity-95 disabled:opacity-40 shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
          >
            <SendIcon />
          </button>

        </div>
      </div>

    </div>
  );
};

export default DraftChat;