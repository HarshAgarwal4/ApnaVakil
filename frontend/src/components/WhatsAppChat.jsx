import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  ShieldCheck,
  MoreVertical,
  Phone,
  Video,
  FileText,
  Clock,
  Check,
  CheckCheck,
  Lock,
  Smile,
  X,
  User,
  ArrowLeft,
  Download,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Eye,
  Circle
} from "lucide-react";
import { useStore } from "../zustand/store";
import axios from "../services/axios";
import { getSocket } from "../services/socket";
import CallModal from "./CallModal";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Max

export default function WhatsAppChat({
  isModal = false,
  onClose = null,
  preselectedConvId = null,
}) {
  const { theme, user } = useStore();
  const isDark = theme === "dark";

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [selectedFileAttachment, setSelectedFileAttachment] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [activeCallSession, setActiveCallSession] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUserId = user?._id?.toString() || user?.id?.toString() || user?.email;
  const currentUserEmail = user?.email || "";
  const currentRole = user?.role || "user";

  // Helper to check online status from Redis list
  const isPartyOnline = (other, list) => {
    if (!other || !list) return false;
    return Boolean(
      (other.id && list.includes(other.id.toString())) ||
      (other.email && list.includes(other.email.toString()))
    );
  };

  // 1. Initialize Socket Connection & Real-Time Presence Tracking
  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket(currentUserId, currentRole, currentUserEmail);

    socket.on("connect", () => {
      console.log("Connected to WhatsApp Socket");
      // Query online users from Redis
      socket.emit("get_online_status", {}, (res) => {
        if (res?.status === 1 && res.onlineUsers) {
          const onlineList = res.onlineUsers;
          setConversations((prev) =>
            prev.map((c) => ({
              ...c,
              otherParty: {
                ...c.otherParty,
                online: isPartyOnline(c.otherParty, onlineList),
              },
            }))
          );
          setActiveConv((prev) =>
            prev
              ? {
                  ...prev,
                  otherParty: {
                    ...prev.otherParty,
                    online: isPartyOnline(prev.otherParty, onlineList),
                  },
                }
              : prev
          );
        }
      });
    });

    socket.on("receive_message", (newMsg) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((m) => m._id === newMsg._id)) return prev;

        // If replacing optimistic temp message
        const tempIdx = prev.findIndex(
          (m) =>
            m._id?.toString().startsWith("temp_") &&
            m.text === newMsg.text &&
            m.senderId === newMsg.senderId
        );
        if (tempIdx !== -1) {
          const nextMsgs = [...prev];
          nextMsgs[tempIdx] = newMsg;
          return nextMsgs;
        }

        return [...prev, newMsg];
      });

      // If active conversation is currently open, mark read immediately
      if (activeConv?.conversationId === newMsg.conversationId) {
        socket.emit("mark_messages_read", {
          conversationId: activeConv.conversationId,
          readerId: currentUserId,
        });
      }

      // Update conversations list with latest message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.conversationId === newMsg.conversationId) {
            return {
              ...c,
              lastMessage: {
                text: newMsg.text,
                attachment: newMsg.attachment,
                senderId: newMsg.senderId,
                status: newMsg.status,
                createdAt: newMsg.createdAt,
              },
            };
          }
          return c;
        })
      );
    });

    socket.on("user_typing", ({ conversationId, senderId }) => {
      if (activeConv?.conversationId === conversationId && senderId !== currentUserId) {
        setOtherTyping(true);
      }
    });

    socket.on("user_stop_typing", ({ conversationId, senderId }) => {
      if (activeConv?.conversationId === conversationId && senderId !== currentUserId) {
        setOtherTyping(false);
      }
    });

    // Real-time Double Blue Tick handler (Read Status Live Update)
    socket.on("messages_read_update", ({ conversationId, readerId }) => {
      if (readerId !== currentUserId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.conversationId === conversationId ? { ...m, status: "read" } : m
          )
        );
        setConversations((prev) =>
          prev.map((c) => {
            if (c.conversationId === conversationId && c.lastMessage) {
              return {
                ...c,
                lastMessage: { ...c.lastMessage, status: "read" },
              };
            }
            return c;
          })
        );
      }
    });

    // Real-time Double Grey Tick handler (Delivered Status Live Update)
    socket.on("messages_delivered_update", ({ conversationId, receiverId }) => {
      if (receiverId !== currentUserId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.conversationId === conversationId && m.status === "sent"
              ? { ...m, status: "delivered" }
              : m
          )
        );
        setConversations((prev) =>
          prev.map((c) => {
            if (
              c.conversationId === conversationId &&
              c.lastMessage &&
              c.lastMessage.status === "sent"
            ) {
              return {
                ...c,
                lastMessage: { ...c.lastMessage, status: "delivered" },
              };
            }
            return c;
          })
        );
      }
    });

    // Live Online / Offline Presence handler
    socket.on("user_status_change", ({ userId: uId, email: uEmail, isOnline }) => {
      const matchParty = (p) => {
        if (!p) return false;
        return Boolean(
          (uId && p.id?.toString() === uId?.toString()) ||
          (uEmail && p.email?.toLowerCase() === uEmail?.toLowerCase()) ||
          (uEmail && p.id?.toLowerCase() === uEmail?.toLowerCase()) ||
          (uId && p.email?.toLowerCase() === uId?.toLowerCase())
        );
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (matchParty(c.otherParty)) {
            return {
              ...c,
              otherParty: { ...c.otherParty, online: isOnline },
            };
          }
          return c;
        })
      );

      setActiveConv((prev) => {
        if (prev && matchParty(prev.otherParty)) {
          return {
            ...prev,
            otherParty: { ...prev.otherParty, online: isOnline },
          };
        }
        return prev;
      });
    });

    // Incoming WebRTC Video / Audio Call Handler
    socket.on("incoming_call", (callData) => {
      setActiveCallSession({
        type: "incoming",
        callType: callData.callType,
        conversationId: callData.conversationId,
        caller: {
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar,
          role: callData.callerRole,
        },
        offer: callData.offer,
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("messages_read_update");
      socket.off("messages_delivered_update");
      socket.off("user_status_change");
      socket.off("incoming_call");
    };
  }, [currentUserId, currentRole, activeConv]);

  // 2. Fetch Conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoadingConvs(true);
      const res = await axios.get("/direct-chat/conversations");
      if (res.data?.status === 1) {
        const convList = res.data.conversations || [];
        setConversations(convList);

        if (preselectedConvId) {
          const match = convList.find((c) => c.conversationId === preselectedConvId);
          if (match) setActiveConv(match);
          else if (convList.length > 0) setActiveConv(convList[0]);
        } else if (convList.length > 0 && !activeConv) {
          setActiveConv(convList[0]);
        }
      }
    } catch (err) {
      console.log("Error loading conversations:", err);
    } finally {
      setIsLoadingConvs(false);
    }
  };

  // 3. Load Messages when Active Conversation changes
  useEffect(() => {
    if (!activeConv?.conversationId) return;

    const socket = getSocket(currentUserId, currentRole);
    socket.emit("join_conversation", { conversationId: activeConv.conversationId });

    // Mark unread messages as read (triggers Double Blue Ticks)
    socket.emit("mark_messages_read", {
      conversationId: activeConv.conversationId,
      readerId: currentUserId,
    });

    fetchMessages(activeConv.conversationId);

    return () => {
      socket.emit("leave_conversation", {
        conversationId: activeConv.conversationId,
      });
    };
  }, [activeConv?.conversationId]);

  const fetchMessages = async (convId) => {
    try {
      setIsLoadingMsgs(true);
      const res = await axios.get(`/direct-chat/messages/${convId}`);
      if (res.data?.status === 1) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.log("Error loading messages:", err);
    } finally {
      setIsLoadingMsgs(false);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTyping]);

  // Handle Typing indicator
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (!activeConv) return;

    const socket = getSocket(currentUserId, currentRole);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: activeConv.conversationId,
        senderId: currentUserId,
        senderName: user?.name || "User",
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing", {
        conversationId: activeConv.conversationId,
        senderId: currentUserId,
      });
    }, 1500);
  };

  // Handle Send Message (with optional attachment)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = inputMessage.trim();
    const fileToSend = selectedFileAttachment;

    if (!textToSend && !fileToSend) return;
    if (!activeConv) return;

    const tempId = `temp_${Date.now()}`;
    const payload = {
      conversationId: activeConv.conversationId,
      connectionId: activeConv.connectionId,
      senderId: currentUserId,
      senderName: user?.name || (currentRole === "lawyer" ? "Advocate" : "Client"),
      senderRole: currentRole,
      receiverId: activeConv.otherParty.id,
      receiverName: activeConv.otherParty.name,
      text: textToSend,
      attachment: fileToSend || null,
      status: activeConv.otherParty.online ? "delivered" : "sent",
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic UI update so user sees message instantly
    const optimisticMsg = { ...payload, _id: tempId };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputMessage("");
    setSelectedFileAttachment(null);

    // Update conversation last message preview
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId === activeConv.conversationId) {
          return {
            ...c,
            lastMessage: {
              text: textToSend || (fileToSend?.name ? `📎 ${fileToSend.name}` : "Attachment"),
              createdAt: new Date().toISOString(),
              senderId: currentUserId,
              status: activeConv.otherParty.online ? "delivered" : "sent",
            },
          };
        }
        return c;
      })
    );

    // 2. Transmit via Socket if connected, otherwise fallback to HTTP
    const socket = getSocket(currentUserId, currentRole);
    if (socket && socket.connected) {
      socket.emit("send_message", payload, (response) => {
        if (response?.status === 1 && response.message) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? response.message : m))
          );
        }
      });
    } else {
      // Fallback to HTTP only when socket is not connected
      try {
        const res = await axios.post("/direct-chat/messages", payload);
        if (res.data?.status === 1 && res.data.message) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? res.data.message : m))
          );
        }
      } catch (err) {
        console.log("HTTP Message dispatch error:", err);
      }
    }

    setIsTyping(false);
    if (socket && socket.connected) {
      socket.emit("stop_typing", {
        conversationId: activeConv.conversationId,
        senderId: currentUserId,
      });
    }
  };

  // Upload file / image directly to Cloudinary (Max 5 MB)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5 MB Limit Verification
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5 MB limit. Please select a smaller file.`
      );
      e.target.value = null;
      return;
    }

    setIsUploadingFile(true);
    const toastId = toast.loading(`Uploading ${file.name} (${(file.size / 1024).toFixed(0)} KB) to Cloudinary...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/direct-chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status === 1 && res.data.file) {
        toast.update(toastId, {
          render: "Uploaded to Cloudinary successfully! ☁️",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });

        setSelectedFileAttachment(res.data.file);
      } else {
        toast.update(toastId, {
          render: res.data?.msg || "Failed to upload file",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.log("Upload error:", err);
      toast.update(toastId, {
        render: "Upload error. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUploadingFile(false);
      e.target.value = null;
    }
  };

  // Authentic WhatsApp message status icons (Single Tick, Double Tick, Double Blue Tick)
  const renderWhatsAppTick = (status, isSender) => {
    if (!isSender) return null;

    if (status === "read") {
      // WhatsApp Double Blue Tick (Cyan/Blue #53bdeb)
      return (
        <span title="Read / Seen" className="inline-flex items-center text-[#53bdeb] ml-1 shrink-0">
          <svg viewBox="0 0 16 15" width="16" height="15" className="fill-[#53bdeb]">
            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879 2.034 7.24a.368.368 0 0 0-.52 0l-.455.455a.368.368 0 0 0 0 .52l3.1 3.1a.367.367 0 0 0 .518-.005l5.859-7.484a.365.365 0 0 0-.063-.51z" />
          </svg>
        </span>
      );
    }

    if (status === "delivered") {
      // WhatsApp Double Grey Tick (Delivered)
      return (
        <span title="Delivered" className="inline-flex items-center text-[#8696a0] dark:text-[#8696a0] ml-1 shrink-0">
          <svg viewBox="0 0 16 15" width="16" height="15" className="fill-current">
            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879 2.034 7.24a.368.368 0 0 0-.52 0l-.455.455a.368.368 0 0 0 0 .52l3.1 3.1a.367.367 0 0 0 .518-.005l5.859-7.484a.365.365 0 0 0-.063-.51z" />
          </svg>
        </span>
      );
    }

    if (status === "sent") {
      // WhatsApp Single Grey Tick (Sent)
      return (
        <span title="Sent" className="inline-flex items-center text-[#8696a0] dark:text-[#8696a0] ml-1 shrink-0">
          <svg viewBox="0 0 16 15" width="16" height="15" className="fill-current">
            <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879 2.034 7.24a.368.368 0 0 0-.52 0l-.455.455a.368.368 0 0 0 0 .52l3.1 3.1a.367.367 0 0 0 .518-.005l5.859-7.484a.365.365 0 0 0-.063-.51z" />
          </svg>
        </span>
      );
    }

    // Clock Icon (Sending...)
    return (
      <span title="Sending..." className="inline-flex items-center text-[#8696a0] ml-1 shrink-0">
        <svg viewBox="0 0 16 15" width="12" height="12" className="fill-current animate-spin">
          <path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1zm0 12.6A5.6 5.6 0 1 1 13.6 8 5.606 5.606 0 0 1 8 13.6zm.7-9.1H7.35v4.2l3.68 2.2.67-1.1-3-1.78z" />
        </svg>
      </span>
    );
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`w-full flex overflow-hidden font-sans transition-all duration-300 ${
        isModal
          ? "fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          : "h-[calc(100vh-140px)] min-h-[580px] rounded-3xl border shadow-xl"
      }`}
    >
      <div
        className={`w-full flex overflow-hidden transition-all ${
          isModal
            ? `max-w-5xl h-[92vh] max-h-[750px] rounded-3xl border shadow-2xl ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-[#f0f6fc] border-blue-300"
              }`
            : isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-[#f0f6fc] border-blue-200/90 text-blue-950"
        }`}
      >
        {/* LEFT COLUMN: CONVERSATION CONTACTS LIST (WhatsApp Sidebar) */}
        <div
          className={`w-full sm:w-80 md:w-96 flex flex-col border-r shrink-0 ${
            activeConv ? "hidden sm:flex" : "flex"
          } ${
            isDark
              ? "bg-slate-950 border-slate-800 text-slate-100"
              : "bg-[#ebf4fa] border-blue-200/90 text-blue-950"
          }`}
        >
          {/* Header Bar */}
          <div className="p-4 border-b border-blue-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h3 className="text-sm font-black text-blue-950 dark:text-white truncate">
                  {user?.name || "Consultations"}
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>WhatsApp Realtime</span>
                </span>
              </div>
            </div>

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-blue-200/60 dark:border-slate-800/80">
            <div
              className={`flex items-center px-3 py-2 rounded-xl border text-xs font-semibold ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-[#f4f9fd] border-blue-300 text-blue-950"
              }`}
            >
              <Search size={14} className="text-blue-700 dark:text-indigo-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats or legal matters..."
                className="bg-transparent outline-none w-full placeholder:text-blue-900/40 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-blue-200/40 dark:divide-slate-800/60">
            {isLoadingConvs ? (
              <div className="py-12 text-center text-xs font-bold text-blue-900/50 dark:text-slate-400">
                Loading connected chats...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <ShieldCheck size={32} className="mx-auto opacity-30 text-blue-700" />
                <h4 className="text-xs font-bold text-blue-950 dark:text-white">
                  No Active Conversations
                </h4>
                <p className="text-[11px] text-blue-900/60 dark:text-slate-400">
                  Accepted inquiries appear here for direct WhatsApp-style consultation.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.conversationId === conv.conversationId;
                const other = conv.otherParty;
                const isLastMsgMine = conv.lastMessage?.senderId === currentUserId;

                return (
                  <button
                    key={conv.conversationId}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? "bg-slate-850 border-l-4 border-indigo-500"
                          : "bg-[#dcebf6] border-l-4 border-blue-700"
                        : isDark
                        ? "hover:bg-slate-900"
                        : "hover:bg-[#e4eff8]"
                    }`}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={other.avatar || "/profile.png"}
                        alt={other.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-blue-200 dark:border-slate-700"
                      />
                      {other.online ? (
                        <span
                          title="Online"
                          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs"
                        />
                      ) : (
                        <span
                          title="Offline"
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold truncate text-blue-950 dark:text-white">
                          {other.name}
                        </h4>
                        <span className="text-[10px] text-blue-900/50 dark:text-slate-400 shrink-0 font-medium">
                          {conv.lastMessage?.createdAt
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="text-[10px] font-extrabold text-blue-700 dark:text-indigo-400 truncate">
                          ⚖️ {conv.caseType}
                        </span>
                        {other.online && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                            Online
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 truncate text-xs text-blue-900/70 dark:text-slate-400 max-w-[180px] font-medium">
                          {isLastMsgMine && renderWhatsAppTick(conv.lastMessage?.status, true)}
                          <span className="truncate">
                            {conv.lastMessage?.text || "Started consultation..."}
                          </span>
                        </div>

                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-600 text-white shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WHATSAPP CHAT CANVAS */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a] relative">
            {/* Top Chat Header */}
            <div
              className={`p-3.5 sm:p-4 border-b flex items-center justify-between transition-colors z-10 ${
                isDark ? "bg-[#202c33] border-[#222d34]" : "bg-[#f0f2f5] border-[#d1d7db]"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConv(null)}
                  className="sm:hidden p-1.5 rounded-lg text-blue-950 dark:text-white font-bold text-xs"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="relative">
                  <img
                    src={activeConv.otherParty.avatar || "/profile.png"}
                    alt={activeConv.otherParty.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                  {activeConv.otherParty.online ? (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#e9edef] flex items-center gap-1.5">
                    <span>{activeConv.otherParty.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {activeConv.otherParty.role === "lawyer" ? "Verified Advocate" : "Active Client"}
                    </span>
                  </h4>
                  <p className="text-[11px] font-semibold truncate flex items-center gap-1">
                    {otherTyping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                        typing...
                      </span>
                    ) : activeConv.otherParty.online ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        <span>Online</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Offline • Matter: {activeConv.caseType}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Call Actions, Security & Close */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Audio Call Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveCallSession({
                      type: "outgoing",
                      callType: "audio",
                      conversationId: activeConv.conversationId,
                      receiver: activeConv.otherParty,
                    })
                  }
                  className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                  title="Start Encrypted Voice Call"
                >
                  <Phone size={16} />
                  <span className="hidden md:inline">Voice Call</span>
                </button>

                {/* Video Call Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveCallSession({
                      type: "outgoing",
                      callType: "video",
                      conversationId: activeConv.conversationId,
                      receiver: activeConv.otherParty,
                    })
                  }
                  className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-indigo-400 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                  title="Start HD Video Consultation"
                >
                  <Video size={16} />
                  <span className="hidden md:inline">Video Call</span>
                </button>

                <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                  <Lock size={12} />
                  <span>Privileged</span>
                </div>

                {isModal && onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Stream Container (Authentic WhatsApp wallpaper pattern) */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5"
              style={{
                backgroundImage: isDark
                  ? "radial-gradient(#1e293b 1px, transparent 1px)"
                  : "radial-gradient(#d1d7db 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {/* Security Banner */}
              <div className="text-center my-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-[10px] font-bold bg-[#ffeecd] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] border border-[#f5dfb8] dark:border-[#222d34] shadow-xs">
                  <Lock size={11} className="text-amber-600" />
                  <span>Messages & file attachments are protected under client-advocate confidentiality</span>
                </span>
              </div>

              {isLoadingMsgs ? (
                <div className="py-12 text-center text-xs font-bold text-slate-500">
                  Loading chat history...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    This is the beginning of your direct consultation chat regarding{" "}
                    <strong>{activeConv.caseType}</strong>.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSender = msg.senderId === currentUserId;
                  const isImage = msg.attachment?.type?.startsWith("image/");

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-normal leading-relaxed shadow-sm relative ${
                          isSender
                            ? isDark
                              ? "bg-[#005c4b] text-[#e9edef] border border-[#005c4b] rounded-tr-none"
                              : "bg-[#d9fdd3] text-[#111b21] border border-[#c1f7b8] rounded-tr-none shadow-xs"
                            : isDark
                            ? "bg-[#202c33] text-[#e9edef] border border-[#202c33] rounded-tl-none"
                            : "bg-[#ffffff] text-[#111b21] border border-slate-200 rounded-tl-none shadow-xs"
                        }`}
                      >
                        {/* File Attachment Card (Uploaded to Cloudinary) */}
                        {msg.attachment && (
                          <div className="mb-2">
                            {isImage && msg.attachment.url ? (
                              <div
                                onClick={() => setPreviewImageModal(msg.attachment)}
                                className="rounded-xl overflow-hidden mb-1.5 border border-black/10 cursor-pointer group relative bg-black/5"
                              >
                                <img
                                  src={msg.attachment.url}
                                  alt={msg.attachment.name}
                                  className="max-h-64 w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs gap-1.5">
                                  <Eye size={16} />
                                  <span>View Image</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs font-bold ${
                                  isSender
                                    ? isDark
                                      ? "bg-[#025142] text-[#e9edef]"
                                      : "bg-[#c2f6bb] text-[#111b21]"
                                    : isDark
                                    ? "bg-[#182229] text-[#e9edef] border border-[#222d34]"
                                    : "bg-slate-100 text-[#111b21] border border-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <div className="p-2 rounded-lg bg-red-500/20 text-red-500 shrink-0">
                                    <FileText size={18} />
                                  </div>
                                  <div className="truncate">
                                    <p className="truncate font-bold text-xs">{msg.attachment.name}</p>
                                    <p className="text-[10px] opacity-75 font-semibold">
                                      {msg.attachment.size || "Document (≤ 5MB)"} • Cloudinary
                                    </p>
                                  </div>
                                </div>
                                {msg.attachment.url && (
                                  <a
                                    href={msg.attachment.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    download={msg.attachment.name}
                                    className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-current transition shrink-0 cursor-pointer"
                                    title="Open / Download Document"
                                  >
                                    <Download size={15} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Text */}
                        {msg.text && <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>}

                        {/* Message Footer: Timestamp & WhatsApp Double Blue Tick */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#667781] dark:text-[#8696a0] font-normal">
                          <span>
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {renderWhatsAppTick(msg.status, isSender)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Other User Typing Bubble */}
              {otherTyping && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 p-2.5 bg-white/90 dark:bg-[#202c33] rounded-2xl w-fit border border-slate-200 dark:border-[#222d34] shadow-xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>{activeConv.otherParty.name} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Selected File Preview Banner before sending */}
            {selectedFileAttachment && (
              <div className="px-4 py-2.5 bg-[#d9fdd3] dark:bg-[#005c4b] border-t border-[#c1f7b8] dark:border-[#025142] flex items-center justify-between gap-3 text-xs font-bold text-[#111b21] dark:text-white animate-in fade-in">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={16} className="text-emerald-700 dark:text-emerald-300 shrink-0" />
                  <span className="truncate">Attached from Cloudinary: {selectedFileAttachment.name} ({selectedFileAttachment.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFileAttachment(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-red-600 transition cursor-pointer"
                  title="Remove attachment"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Bottom Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className={`p-3 sm:p-4 border-t flex items-center gap-2 z-10 ${
                isDark ? "bg-[#202c33] border-[#222d34]" : "bg-[#f0f2f5] border-[#d1d7db]"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
              />

              <button
                type="button"
                disabled={isUploadingFile}
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                title="Attach Document / Court Annexure (Max 5 MB - Uploads to Cloudinary)"
              >
                {isUploadingFile ? <Loader2 size={18} className="animate-spin text-emerald-600" /> : <Paperclip size={18} />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={selectedFileAttachment ? "Add a caption..." : `Type message to ${activeConv.otherParty.name}...`}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-normal outline-none transition ${
                  isDark
                    ? "bg-[#2a3942] border-[#2a3942] focus:border-emerald-500 text-[#e9edef] placeholder:text-[#8696a0]"
                    : "bg-white border-white focus:border-emerald-600 text-[#111b21] placeholder:text-[#667781] shadow-xs"
                }`}
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() && !selectedFileAttachment}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition disabled:opacity-40 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-blue-900/60 dark:text-slate-400">
            <ShieldCheck size={52} className="mb-3 opacity-40 text-emerald-600" />
            <h4 className="text-base font-bold text-blue-950 dark:text-white">
              WhatsApp-Style Direct Consultation
            </h4>
            <p className="text-xs max-w-sm mt-1">
              Select an active conversation to chat directly with verified advocates in real-time.
            </p>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <img
              src={previewImageModal.url}
              alt={previewImageModal.name}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-3 flex items-center justify-between w-full text-white text-xs font-bold px-2">
              <span>{previewImageModal.name}</span>
              <a
                href={previewImageModal.url}
                target="_blank"
                rel="noreferrer"
                download={previewImageModal.name}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white flex items-center gap-1.5 transition"
              >
                <Download size={13} />
                <span>Download Full Size</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WebRTC Video & Audio Calling Modal (Redis & Socket Powered) */}
      {activeCallSession && (
        <CallModal
          callState={activeCallSession}
          currentUserId={currentUserId}
          currentUserEmail={currentUserEmail}
          currentUserName={user?.name || (currentRole === "lawyer" ? "Advocate" : "Client")}
          currentUserRole={currentRole}
          onClose={() => setActiveCallSession(null)}
        />
      )}
    </div>
  );
}
