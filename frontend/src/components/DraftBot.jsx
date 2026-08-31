import React, { useState, useRef, useEffect, useContext } from "react";
import { PaperclipIcon, MicIcon, SendIcon } from "./Icons";
import axios from "../services/axios";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import DraftUserMsg from "./DraftUserMSg";
import DraftBotMsg from "./DraftBotMsg";
import DraftChat from "./DraftChat";

const Draftbot = ({ disc, showdisc }) => {
    const { showPrintPage, setShowPrintPage, setPrint, document, print, setHistory, activeChat, setActiveChat, lawyer, setLawyer, article, setArticle, checkPlan, setShowPricingBox, setUser, setIsPaid, setPlan, All_Histories, user, activeDraft, DraftMode, YourDrafts, DraftChatHistory, setActiveDraft } = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!document) {
            setPrint("");
            return;
        }
        try {
            let joined = JSON.parse(document)
            if (Array.isArray(joined)) {
                joined = joined.join("\n");
                setPrint(joined)
            } else {
                setPrint(document)
            }
        } catch (err) {
            console.log(err)
        }
    }, [document]);

    // useEffect(() => {
    //     document.title = "Apna vakil | Drafts"
    // }, [])

    return (
        <div className="flex-1 relative flex flex-col h-full bg-[#eaf2f8] dark:bg-slate-950 text-blue-950 dark:text-slate-100 transition-colors">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-blue-900/5 dark:text-slate-400/20 tracking-widest text-center px-4">
                    Drafts Mode
                </span>
            </div>

            <div className="flex-1 space-y-6 p-4 md:p-6 overflow-y-auto">
                <div className="hidden md:block">
                    {document && <DraftBotMsg msg={document} />}
                </div>
                <div className="block md:hidden h-[100%]">
                    <DraftChat />
                </div>
            </div>
            {/* Desktop Full Statutory Disclaimer */}
            <div className="hidden md:block bg-[#e2edf7] dark:bg-slate-950 border-t border-blue-200/90 dark:border-slate-800 py-2.5 px-4">
                <div onClick={() => { showdisc(!disc) }} className="mx-auto max-w-4xl rounded-xl border hover:cursor-pointer border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-950 flex items-start gap-2 shadow-xs transition hover:bg-amber-100/90 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300">
                    <span className="text-amber-500 shrink-0">⚖️</span>
                    <p className="leading-relaxed">
                        <strong>Statutory Notice:</strong> ApnaVakil provides legal document templates & AI drafting assistance. Review all drafted clauses with a qualified advocate before formal execution.
                    </p>
                </div>
            </div>

            {/* Mobile Compact Disclaimer */}
            <div className="block md:hidden bg-[#e2edf7] dark:bg-slate-950 border-t border-blue-200/90 dark:border-slate-800 py-1.5 px-3 text-center">
                <div
                    onClick={() => showdisc(!disc)}
                    className="inline-flex items-center justify-center gap-1.5 text-[10px] text-amber-800 dark:text-amber-300 hover:underline cursor-pointer font-semibold"
                >
                    <span>⚖️</span>
                    <span>
                        <strong>Statutory Disclaimer:</strong> AI draft templates • Verify clauses before execution • <u>Read Notice</u>
                    </span>
                </div>
            </div>

        </div>
    );
};

export default Draftbot;