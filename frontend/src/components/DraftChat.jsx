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
      let id = activeDraft?._id || "not"
      let d = null ,s=null,mode='normal'
      if(document && document !== 'null'){
        d=document
        mode = 'document'
      }
      else {
        mode = 'normal'
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
        if (res.data.document) setDocument(res.data.document)

        if (id == 'not'){
          let a = {
            _id: res.data.HID,
            userId: user._id,
            title: res.data.title,
            messages: [userMsg, botMsg],
            document: res.data.document
          }
          YourDrafts.drafts.unshift(a)
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
    } catch (err){
      console.log(err)
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

  return (
  <div className="flex flex-col h-full rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm overflow-hidden">

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {DraftChatHistory.map((msg, i) =>
        msg.role === "user" ? (
          <DraftUserMsg key={i} msg={msg} />
        ) : (
          <DraftBotSidebarMsg key={i} msg={msg} />
        )
      )}

      {isTyping && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          <span className="ml-2">Vakil Sahab is typing…</span>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>

    {/* Input */}
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-end gap-2 bg-gray-50 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Ask Vakil Sahab…"
          className="flex-1 resize-none bg-transparent px-2 py-1 focus:outline-none text-sm"
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && sendMessage()
          }
        />

        <button
          onClick={toggleListening}
          className={`p-2 rounded-lg transition ${
            listening
              ? "bg-red-100 text-red-500"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          <MicIcon />
        </button>

        <button
          onClick={sendMessage}
          disabled={isTyping}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <SendIcon />
        </button>

      </div>
    </div>

  </div>
);

};

export default DraftChat;