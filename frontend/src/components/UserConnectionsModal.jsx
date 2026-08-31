import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Lock,
  Sparkles
} from "lucide-react";
import { useStore } from "../zustand/store";
import WhatsAppChat from "./WhatsAppChat";

export default function UserConnectionsModal({ isOpen, onClose }) {
  const { theme, user } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatConv, setSelectedChatConv] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchConnections();
    }
  }, [isOpen]);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/user-connections");
      if (res.data?.status === 1) {
        setConnections(res.data.connections || []);
      }
    } catch (err) {
      console.log("Error fetching connections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    if (status === "active" || status === "accepted") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active Connection</span>
        </span>
      );
    }
    if (status === "rejected" || status === "declined") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
          <XCircle size={12} />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
        <Clock size={12} />
        <span>Pending Advocate Review</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-[#f0f6fc] border-blue-300 text-blue-950"
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-blue-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-700 text-white shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white">
                My Advocate Connections
              </h2>
              <p className="text-xs text-blue-900/60 dark:text-slate-400 font-medium">
                Track status of your direct legal consultation requests with verified advocates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchConnections}
              className="p-2 rounded-xl text-blue-900/60 hover:text-blue-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Connections List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-blue-900/60 dark:text-slate-400">
              Loading your advocate connections...
            </div>
          ) : connections.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <MessageSquare size={36} className="mx-auto opacity-40 text-blue-700 dark:text-indigo-400" />
              <h4 className="text-base font-bold text-blue-950 dark:text-white">
                No Connections Yet
              </h4>
              <p className="text-xs text-blue-900/60 dark:text-slate-400 max-w-sm mx-auto font-medium">
                You haven't requested any advocate consultations yet. Browse verified advocates to connect for legal advisory.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/lawyers");
                }}
                className="mt-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Browse Verified Advocates
              </button>
            </div>
          ) : (
            connections.map((conn) => {
              const lawyer = conn.lawyer || {};
              const isActive = conn.status === "active" || conn.status === "accepted";
              const isRejected = conn.status === "rejected" || conn.status === "declined";

              return (
                <div
                  key={conn._id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isActive
                      ? isDark
                        ? "bg-slate-950 border-emerald-500/40 shadow-sm"
                        : "bg-emerald-50/40 border-emerald-300 shadow-xs"
                      : isRejected
                      ? isDark
                        ? "bg-slate-950 border-red-500/30"
                        : "bg-red-50/30 border-red-200"
                      : isDark
                      ? "bg-slate-950 border-slate-800"
                      : "bg-[#f4f9fd] border-blue-200/90 shadow-xs"
                  }`}
                >
                  {/* Top Bar: Advocate & Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={lawyer.images || "/profile.png"}
                        alt={lawyer.name}
                        className="w-12 h-12 rounded-xl object-cover border border-blue-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white">
                            {lawyer.name || "Advocate"}
                          </h4>
                          {lawyer.barNumber && (
                            <span className="text-[10px] text-blue-900/60 dark:text-slate-400 font-semibold hidden sm:inline">
                              (Bar ID: {lawyer.barNumber})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-900/60 dark:text-slate-400 font-medium">
                          {lawyer.speciality || "Verified Legal Practitioner"} • 🛡️ Platform Protected Channel
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto">
                      {getStatusBadge(conn.status)}
                    </div>
                  </div>

                  {/* Your Query */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-900/60 dark:text-slate-400 uppercase tracking-wider mb-1">
                      <span>Case Topic: {conn.caseType || "General Legal Matter"}</span>
                      <span className="font-semibold text-[10px] normal-case">
                        {new Date(conn.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-blue-950 dark:text-slate-200 line-clamp-2 bg-white/50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-200/60 dark:border-slate-800">
                      "{conn.message}"
                    </p>
                  </div>

                  {/* Active Connection Direct Actions */}
                  {isActive && (
                    <div className="mt-3.5 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle size={14} />
                        <span>Advocate accepted your inquiry. Consultation is active.</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedChatConv(`conv_${conn._id}`);
                            setShowChat(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp Chat</span>
                        </button>

                        {lawyer._id && (
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/lawyer/${lawyer._id}`);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                          >
                            <span>Profile</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejected Note */}
                  {isRejected && (
                    <div className="mt-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
                      Advocate was unable to take up this inquiry. You may connect with other verified advocates in the directory.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {showChat && (
        <WhatsAppChat
          isModal={true}
          onClose={() => setShowChat(false)}
          preselectedConvId={selectedChatConv}
        />
      )}
    </div>
  );
}
