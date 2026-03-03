import React, { useState } from "react";
import axios from "../services/axios";
import { toast } from "react-toastify";
import ConsultationModal from "./LawyerModal";

export default function LawyerCard({ lawyer }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🔹 Trim description to 120 characters
  const getShortDesc = (text, limit = 120) => {
    if (!text) return "Experienced legal professional ready to assist you.";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

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
        setShowMessageBox(false);
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
    <>
      {/* 🔹 Consultation Detail Modal */}
      {showModal && (
        <ConsultationModal
          lawyer={lawyer}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 🔹 CARD */}
      <div className="group bg-white border border-blue-100 rounded-3xl p-8 
                      shadow-md hover:shadow-2xl hover:-translate-y-2 
                      transition-all duration-300">

        {/* Header */}
        <div className="flex items-center gap-5 mb-6">
          <img
            src={lawyer.images}
            loading="lazy"
            alt={lawyer.name}
            className="w-20 h-20 rounded-2xl object-cover 
                       border-2 border-blue-100 shadow-md"
          />

          <div>
            <h3 className="text-xl font-bold text-blue-900 
                           group-hover:text-blue-700 transition">
              {lawyer.name}
            </h3>

            <div className="flex flex-wrap gap-2 mt-2">
              {lawyer.categories?.map((cat, index) => (
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

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {getShortDesc(lawyer.desc)}
        </p>

        {/* View More Button */}
        <button
          onClick={() => setShowModal(true)}
          className="text-blue-900 text-sm font-semibold 
                     hover:text-blue-700 transition 
                     mb-6 underline underline-offset-4"
        >
          View More →
        </button>

        {/* Consultation Button */}
        <button
          onClick={() => setShowMessageBox(true)}
          className="w-full py-4 bg-blue-900 text-white 
                     font-semibold rounded-2xl 
                     shadow-md hover:bg-blue-800 
                     hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-300"
        >
          Book Consultation
        </button>
      </div>

      {/* 🔹 Message Modal */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                        flex items-center justify-center 
                        z-50 p-4">

          <div className="bg-white rounded-3xl p-8 
                          w-full max-w-md shadow-2xl relative 
                          border border-blue-100">

            <button
              onClick={() => setShowMessageBox(false)}
              className="absolute top-4 right-4 
                         text-slate-400 hover:text-blue-900 
                         text-xl transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-blue-900">
              Consult {lawyer.name}
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              Send your legal query and get professional assistance.
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
              rows="4"
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
      )}
    </>
  );
}