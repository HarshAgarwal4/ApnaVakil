import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  Check,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Search,
  Send,
  X,
  Lock,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Users
} from "lucide-react";
import { useStore } from "../zustand/store";

export default function LawyerRequestsTab({
  requests,
  handleUpdateRequestStatus,
  initialFilter = "pending"
}) {
  const { theme } = useStore();
  const isDark = theme === "dark";

  const [filter, setFilter] = useState(initialFilter); // default 'pending'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  const filteredRequests = requests.filter((r) => {
    // Normalize accepted -> active
    const st = r.status === "accepted" ? "active" : r.status;
    if (filter !== "all" && st !== filter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.clientName?.toLowerCase().includes(q);
      const matchEmail = r.clientEmail?.toLowerCase().includes(q);
      const matchMsg = r.message?.toLowerCase().includes(q);
      const matchCase = r.caseType?.toLowerCase().includes(q);
      return matchName || matchEmail || matchMsg || matchCase;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "active" || status === "accepted") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active Connection</span>
        </span>
      );
    }
    if (status === "rejected" || status === "declined") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
          <XCircle size={10} />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
        <Clock size={10} />
        <span>Pending Review</span>
      </span>
    );
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const activeCount = requests.filter((r) => r.status === "active" || r.status === "accepted").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected" || r.status === "declined").length;

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white flex items-center gap-2">
            <span>{filter === "active" ? "Active Client Connections" : "Incoming Client Inquiries"}</span>
            {filter === "pending" && pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {pendingCount} New
              </span>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-blue-900/60 dark:text-slate-400 font-medium mt-0.5">
            {filter === "active"
              ? "Clients whose consultation inquiries have been accepted as active connections."
              : "Review and accept incoming inquiries. Once accepted, they move to Active Connections."}
          </p>
        </div>

        {/* Search Bar */}
        <div className={`flex items-center rounded-2xl px-3.5 py-2 border w-full sm:w-72 shadow-xs ${
          isDark
            ? "bg-slate-900 border-slate-800 focus-within:border-indigo-500"
            : "bg-[#f4f9fd] border-blue-300 focus-within:border-blue-700"
        }`}>
          <Search size={16} className="text-blue-700 dark:text-indigo-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client or keywords..."
            className="bg-transparent outline-none text-xs sm:text-sm w-full font-semibold text-blue-950 dark:text-white placeholder:text-blue-900/40 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "pending", label: "Incoming Inquiries", count: pendingCount, icon: Clock },
          { id: "active", label: "Active Connections", count: activeCount, icon: Users },
          { id: "rejected", label: "Rejected Requests", count: rejectedCount, icon: XCircle },
          { id: "all", label: "All Requests Archive", count: requests.length, icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-2 ${
                isSelected
                  ? "bg-blue-700 text-white shadow-sm"
                  : isDark
                  ? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                  : "bg-[#f0f6fc] text-blue-950 border border-blue-200 hover:bg-[#e2edf7]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                isSelected ? "bg-white/20 text-white" : "bg-blue-100 dark:bg-slate-800 text-blue-900 dark:text-slate-300"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inquiries Cards Grid */}
      {filteredRequests.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-400"
              : "bg-[#f0f6fc] border-blue-200/90 text-blue-900/70"
          }`}
        >
          <MessageSquare size={36} className="mx-auto mb-3 opacity-40" />
          <h4 className="text-base font-bold text-blue-950 dark:text-white">
            {filter === "pending"
              ? "No Pending Inquiries"
              : filter === "active"
              ? "No Active Client Connections"
              : "No Requests Found"}
          </h4>
          <p className="text-xs mt-1 font-medium max-w-md mx-auto">
            {searchTerm
              ? `No records matching "${searchTerm}".`
              : filter === "pending"
              ? "All client inquiries have been processed. New inquiries will appear here."
              : filter === "active"
              ? "Accept incoming inquiries to connect with clients as active connections."
              : `No requests currently marked as ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => {
            const isReqActive = req.status === "active" || req.status === "accepted";
            const isReqRejected = req.status === "rejected" || req.status === "declined";

            return (
              <div
                key={req._id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isReqActive
                    ? isDark
                      ? "bg-slate-900 border-emerald-500/30 text-white"
                      : "bg-[#f0f6fc] border-emerald-300 text-blue-950 shadow-xs"
                    : isDark
                    ? "bg-slate-900 border-slate-800 text-white"
                    : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
                }`}
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-blue-950 dark:text-white">
                        {req.clientName}
                      </h4>
                      {getStatusBadge(req.status)}
                      {req.caseType && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 dark:bg-slate-800 text-blue-900 dark:text-slate-300">
                          {req.caseType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                      <Lock size={11} />
                      <span>{isReqActive ? "Active In-App Client Connection" : "Confidential Client Inquiry"}</span>
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-blue-900/50 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={13} />
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Message Content */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400">
                    Client Case Description / Query:
                  </span>
                  <p
                    className={`mt-1 text-xs sm:text-sm p-3.5 rounded-2xl border font-medium leading-relaxed ${
                      isDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-[#f4f9fd] border-blue-200"
                    }`}
                  >
                    {req.message}
                  </p>
                </div>

                {/* Status Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Accept (Active) Button */}
                    {!isReqActive && (
                      <button
                        onClick={() =>
                          handleUpdateRequestStatus(req._id, "active")
                        }
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Check size={14} />
                        <span>Accept & Set Active Connection</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {!isReqRejected && (
                      <button
                        onClick={() =>
                          handleUpdateRequestStatus(req._id, "rejected")
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <XCircle size={14} />
                        <span>Reject Request</span>
                      </button>
                    )}

                    {/* Reset to Pending if processed */}
                    {(isReqActive || isReqRejected) && (
                      <button
                        onClick={() =>
                          handleUpdateRequestStatus(req._id, "pending")
                        }
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          isDark
                            ? "border-slate-700 text-slate-400 hover:text-white"
                            : "border-blue-300 text-blue-900/70 hover:text-blue-950"
                        }`}
                      >
                        <span>Move Back to Pending</span>
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-blue-900/60 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Protected Confidential Channel</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
