import React, { useEffect } from "react";
import { useStore } from "../zustand/store";
import CallModal from "./CallModal";
import { getSocket } from "../services/socket";

export default function GlobalCallManager() {
  const { user, activeCall, setActiveCall } = useStore();
  const currentUserName =
    user?.name || (user?.role === "lawyer" ? "Advocate" : "Client");
  const currentUserId = user?._id?.toString() || user?.id?.toString() || user?.email || "";
  const currentUserEmail = user?.email || "";
  const currentUserRole = user?.role || "user";

  useEffect(() => {
    if (!currentUserId) return undefined;

    const socket = getSocket(currentUserId, currentUserRole, currentUserEmail);

    const handleIncomingCall = (session) => {
      if (!session?.conversationId) return;
      if (!activeCall) {
        setActiveCall({ ...session, type: "incoming", status: "ringing" });
      }
    };

    socket.on("incoming_call", handleIncomingCall);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
    };
  }, [activeCall, currentUserId, currentUserEmail, currentUserRole, setActiveCall]);

  if (!activeCall) return null;

  return (
    <CallModal
      callState={activeCall}
      currentUserName={currentUserName}
      currentUserRole={currentUserRole}
      onClose={() => setActiveCall(null)}
    />
  );
}
