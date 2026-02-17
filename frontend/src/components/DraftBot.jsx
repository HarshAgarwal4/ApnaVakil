import React, { useState, useRef, useEffect, useContext } from "react";
import { PaperclipIcon, MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import DraftUserMsg from "./DraftUserMSg";
import DraftBotMsg from "./DraftBotMsg";

const Draftbot = ({ disc, showdisc }) => {
    const { showPrintPage, setShowPrintPage, setPrint,document, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, setUser, setIsPaid, setPlan, All_Histories, user, activeDraft, DraftMode, YourDrafts, DraftChatHistory, setActiveDraft } = useStore()
    const navigate = useNavigate()

    return (
        <div className="flex-1 relative flex flex-col  h-full">
            <div className="absolute inset-0 z flex items-center justify-center pointer-events-none select-none">
                <span className="text-6xl  md:text-7xl font-extrabold text-slate-400/20 tracking-widest">
                    Drafts Mode
                </span>
            </div>

            <div className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto">
                {document && <DraftBotMsg msg={document} />}
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

export default Draftbot;