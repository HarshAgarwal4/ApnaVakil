import React, { useState } from "react";
import axios from "../services/axios";
import { toast } from "react-toastify";

export default function ConsultationModal({ lawyer, onClose }) {
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
                toast.success("Message sent successfully to Lawyer");
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center 
                    z-50 p-4 overflow-y-auto">

            <div className="bg-white rounded-3xl 
                      w-full max-w-5xl shadow-2xl relative 
                      border border-blue-100 p-8">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 
                     text-slate-400 hover:text-blue-900 
                     text-xl transition"
                >
                    ✕
                </button>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* LEFT SIDE → MESSAGE BOX */}
                    <div className="border-t md:border-t-0 md:border-l border-blue-100 md:pl-8">

                        <div className="flex items-center gap-6 mb-6">
                            <img
                                src={lawyer?.images}
                                alt={lawyer?.name}
                                className="w-24 h-24 rounded-2xl object-cover 
                           border-2 border-blue-100 shadow-md"
                            />

                            <div>
                                <h2 className="text-2xl font-bold text-blue-900">
                                    {lawyer?.name}
                                </h2>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {lawyer?.categories?.map((cat, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-800 
                                 text-xs font-medium px-3 py-1 
                                 rounded-full border border-blue-200"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">
                                About Lawyer
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {lawyer?.desc ||
                                    "Experienced legal professional ready to assist you with your legal concerns."}
                            </p>
                        </div>

                    </div>


                    {/* RIGHT SIDE → LAWYER DETAILS */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-900 mb-3">
                            Send Your Query
                        </h2>

                        <p className="text-slate-500 text-sm mb-6">
                            Describe your legal issue clearly to get the best assistance.
                        </p>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your legal issue..."
                            className="w-full border border-blue-200 
                         rounded-2xl p-4 mb-6 outline-none 
                         focus:ring-2 focus:ring-blue-900 
                         focus:border-blue-900 transition 
                         resize-none text-sm"
                            rows="7"
                        />

                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || isSending}
                            className="w-full py-4 bg-blue-900 text-white
                         font-semibold rounded-2xl 
                         hover:bg-blue-800 hover:shadow-lg 
                         hover:scale-[1.02] 
                         disabled:bg-blue-400
                         transition-all duration-300"
                        >
                            {isSending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="loading"></span>
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}