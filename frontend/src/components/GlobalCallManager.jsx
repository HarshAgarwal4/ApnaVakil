import React, { useEffect } from "react";
import { useStore } from "../zustand/store";
import { getSocket } from "../services/socket";
import CallModal from "./CallModal";

export default function GlobalCallManager() {
  const { user, activeCall, setActiveCall } = useStore();

  const currentUserId = user?._id?.toString() || user?.id?.toString() || user?.email;
  const currentUserEmail = user?.email || "";
  const currentRole = user?.role || "user";

  useEffect(() => {
    if (!currentUserId && !currentUserEmail) return;

    // Connect socket globally on login
    const socket = getSocket(currentUserId, currentRole, currentUserEmail);

    // Global Incoming Call Listener
    const handleIncomingCall = (callData) => {
      console.log("🔔 Global Incoming Call Received:", callData);
      setActiveCall({
        type: "incoming",
        callType: callData.callType || "video",
        conversationId: callData.conversationId,
        caller: {
          id: callData.callerId,
          email: callData.callerEmail || "",
          name: callData.callerName || "Advocate / Client",
          avatar: callData.callerAvatar || "/profile.png",
          role: callData.callerRole || "user",
        },
        offer: callData.offer,
      });
    };

    socket.on("incoming_call", handleIncomingCall);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
    };
  }, [currentUserId, currentUserEmail, currentRole]);

  if (!activeCall) return null;

  return (
    <CallModal
      callState={activeCall}
      currentUserId={currentUserId}
      currentUserEmail={currentUserEmail}
      currentUserName={user?.name || (currentRole === "lawyer" ? "Advocate" : "Client")}
      currentUserRole={currentRole}
      onClose={() => setActiveCall(null)}
    />
  );
}
