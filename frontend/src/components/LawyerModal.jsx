import React, { useState } from "react";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";
import { X, ShieldCheck, Send } from "lucide-react";

export default function ConsultationModal({ lawyer, onClose }) {
    const { theme } = useStore();
    const isDark = theme === "dark";

    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        try {
            const res = await axios.post("/askLawyer", {
                query: message,
                email: lawyer.email,
            });

            if (res.status === 200 && res.data.status === 1) {
                toast.success("Inquiry sent successfully to Advocate");
                setMessage("");
                onClose();
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`rounded-3xl w-full max-w-4xl shadow-2xl relative border p-6 sm:p-8 transition-all ${
                isDark
                    ? "bg-slate-900 border-slate-800 text-white shadow-black/60"
                    : "bg-white border-slate-300 text-slate-900 shadow-slate-200/80"
            }`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

                    {/* LEFT SIDE → LAWYER PROFILE */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative shrink-0">
                                    <img
                                        src={lawyer?.images || "/logo.png"}
                                        alt={lawyer?.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700 shadow-md"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                        {lawyer?.name}
                                    </h2>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                        {lawyer?.speciality || "High Court & Civil Advocate"}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                                        {lawyer?.categories?.map((cat, index) => (
                                            <span
                                                key={index}
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                    isDark
                                                        ? "bg-slate-800 border-slate-700 text-indigo-300"
                                                        : "bg-slate-100 border-slate-300 text-indigo-950"
                                                }`}
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-2xl border ${
                                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200 shadow-xs"
                            }`}>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Professional Background
                                </h3>
                                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                                    {lawyer?.desc ||
                                        "Verified High Court and District Court advocate with extensive expertise in civil litigation, property disputes, and corporate contracts."}
                                </p>
                            </div>
                        </div>

                        {lawyer?.contact && (
                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                                <span>Verified Contact:</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{lawyer.contact}</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE → INQUIRY FORM */}
                    <div className="md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">
                                Send Direct Legal Inquiry
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 font-medium">
                                Provide summary details of your legal notice, agreement, or court matter.
                            </p>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your legal issue (dates, parties, notices, relief requested)..."
                                className={`w-full border-2 rounded-2xl p-3.5 mb-4 outline-none resize-none text-xs sm:text-sm font-medium transition ${
                                    isDark
                                        ? "bg-slate-950 border-slate-700 text-white focus:border-indigo-500"
                                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white shadow-xs"
                                }`}
                                rows="6"
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || isSending}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-md hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span>{isSending ? "Transmitting..." : "Send to Advocate"}</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}