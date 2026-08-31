import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Mic,
  MicOff,
  Monitor,
  Phone,
  PhoneOff,
  ShieldCheck,
  User,
  Video,
  VideoOff,
} from "lucide-react";
import { useStore } from "../zustand/store";
import { getSocket } from "../services/socket";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

function getUserIdentity(user) {
  return {
    id: user?._id?.toString() || user?.id?.toString() || user?.email || "",
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "user",
  };
}

export default function CallModal({
  callState,
  currentUserName,
  currentUserRole,
  onClose,
}) {
  const { user, setActiveCall } = useStore();
  const identity = getUserIdentity(user);
  const currentId = identity.id;
  const currentEmail = identity.email.toLowerCase();
  const currentName = currentUserName || identity.name || (identity.role === "lawyer" ? "Advocate" : "Client");
  const currentRole = currentUserRole || identity.role || "user";

  const socketRef = useRef(null);
  const callStateRef = useRef(callState);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const mountIdRef = useRef(0);
  const initiateOnceRef = useRef(false);
  const joinedRoomRef = useRef(false);

  const [phase, setPhase] = useState(callState?.status || (callState?.type === "incoming" ? "ringing" : "dialing"));
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [localReady, setLocalReady] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isVideo = callState?.callType === "video";
  const conversationId = callState?.conversationId;
  const roomId = callState?.roomId || (conversationId ? `call:${conversationId}` : null);
  const isIncoming = callState?.type === "incoming";
  const otherParty = isIncoming ? callState?.caller || {} : callState?.receiver || {};
  const otherName = otherParty?.name || "Advocate / Client";
  const currentPartyMatchesCaller = Boolean(
    currentId &&
      (callState?.caller?.id?.toString() === currentId ||
        callState?.caller?.email?.toLowerCase() === currentEmail)
  );
  const currentPartyMatchesReceiver = Boolean(
    currentId &&
      (callState?.receiver?.id?.toString() === currentId ||
        callState?.receiver?.email?.toLowerCase() === currentEmail)
  );
  const isCaller = currentPartyMatchesCaller || (!isIncoming && !currentPartyMatchesReceiver);

  useEffect(() => {
    callStateRef.current = callState;
    setPhase(callState?.status || (callState?.type === "incoming" ? "ringing" : "dialing"));
  }, [callState]);

  useEffect(() => {
    const localVideo = localVideoRef.current;
    if (!localVideo || !localStreamRef.current || !localReady || !isVideo) return;

    localVideo.srcObject = localStreamRef.current;
  }, [localReady, cameraOff, isVideo]);

  useEffect(() => {
    if (!callState?.conversationId) return undefined;

    const socket = getSocket(currentId, currentRole, currentEmail);
    socketRef.current = socket;
    mountIdRef.current += 1;
    const mountId = mountIdRef.current;

    const emitWithAck = (eventName, payload) =>
      new Promise((resolve) => {
        socket.emit(eventName, payload, (response) => resolve(response || {}));
      });

    const attachLocalTracks = (peer, stream) => {
      const senderKinds = new Set(peer.getSenders().map((sender) => sender.track?.kind).filter(Boolean));
      stream.getTracks().forEach((track) => {
        if (!senderKinds.has(track.kind)) {
          peer.addTrack(track, stream);
        }
      });
    };

    const stopAndClearMedia = () => {
      if (peerRef.current) {
        try {
          peerRef.current.ontrack = null;
          peerRef.current.onicecandidate = null;
          peerRef.current.onconnectionstatechange = null;
          peerRef.current.close();
        } catch (err) {
          console.log("Peer cleanup error:", err);
        }
      }

      peerRef.current = null;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = null;
      setLocalReady(false);
      setRemoteReady(false);
      setIsMuted(false);
      setCameraOff(false);

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    };

    const attachRemoteStream = (stream) => {
      if (!stream) return;

      if (isVideo && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      if (!isVideo && remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
      }
    };

    const ensureLocalStream = async () => {
      if (localStreamRef.current) return localStreamRef.current;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo,
      });

      localStreamRef.current = stream;
      setLocalReady(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    };

    const createPeer = async () => {
      if (peerRef.current) return peerRef.current;

      const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) attachRemoteStream(remoteStream);
        setRemoteReady(Boolean(remoteStream));
      };
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            conversationId: callStateRef.current?.conversationId,
            candidate: event.candidate,
          });
        }
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "connected") {
          setPhase("connected");
        }
        if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
          setPhase((prev) => (prev === "ended" ? prev : peer.connectionState));
        }
      };

      peerRef.current = peer;

      if (localStreamRef.current) {
        attachLocalTracks(peer, localStreamRef.current);
      }

      return peer;
    };

    const addLocalTracksIfNeeded = async () => {
      const stream = await ensureLocalStream();
      const peer = await createPeer();
      attachLocalTracks(peer, stream);
      return { stream, peer };
    };

    const updateActiveCall = (patch) => {
      const base = callStateRef.current || {};
      setActiveCall({ ...base, ...patch });
    };

    const startOutgoingCall = async () => {
      if (isIncoming || initiateOnceRef.current || callStateRef.current?.sessionId) return;
      initiateOnceRef.current = true;

      const response = await emitWithAck("initiate_call", {
        conversationId: callStateRef.current?.conversationId,
        callType: callStateRef.current?.callType || "video",
        callerId: currentId,
        callerEmail: currentEmail,
        callerName: identity.name || currentName,
        callerRole: currentRole,
        receiverId: callStateRef.current?.receiver?.id,
        receiverEmail: callStateRef.current?.receiver?.email,
        receiverName: callStateRef.current?.receiver?.name,
        receiverRole: callStateRef.current?.receiver?.role || "user",
      });

      if (response?.status === 1 && response.session) {
        updateActiveCall({
          ...response.session,
          type: "outgoing",
        });
        setPhase("ringing");
      } else {
        setErrorMessage(response?.msg || "Unable to start call.");
      }
    };

    const joinRoom = async () => {
      if (!roomId || joinedRoomRef.current) return;
      joinedRoomRef.current = true;

      const response = await emitWithAck("join_call_room", {
        conversationId: callStateRef.current?.conversationId,
        sessionId: callStateRef.current?.sessionId,
      });

      if (response?.session) {
        updateActiveCall(response.session);
      }
    };

    const setupCallerOffer = async () => {
      const { peer } = await addLocalTracksIfNeeded();
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("webrtc_offer", {
        conversationId: callStateRef.current?.conversationId,
        offer,
      });
    };

    const handleCallAccepted = async (session) => {
      if (!session || session.conversationId !== callStateRef.current?.conversationId) return;
      updateActiveCall(session);
      setPhase("active");

      try {
        await addLocalTracksIfNeeded();
        if (isCaller) {
          await setupCallerOffer();
        }
      } catch (err) {
        console.error("Call setup error:", err);
        setErrorMessage("Camera and microphone access is required for this call.");
      }
    };

    const handleCallRejected = (session) => {
      if (session?.conversationId !== callStateRef.current?.conversationId) return;
      setPhase("rejected");
      stopAndClearMedia();
      onClose?.();
    };

    const handleCallEnded = (session) => {
      if (session?.conversationId !== callStateRef.current?.conversationId) return;
      setPhase("ended");
      stopAndClearMedia();
      onClose?.();
    };

    const handleOffer = async ({ conversationId: offerConversationId, offer }) => {
      if (offerConversationId !== callStateRef.current?.conversationId || !offer) return;
      try {
        const stream = await ensureLocalStream();
        const peer = await createPeer();
        attachLocalTracks(peer, stream);
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("webrtc_answer", {
          conversationId: offerConversationId,
          answer,
        });
      } catch (err) {
        console.error("Offer handling error:", err);
        setErrorMessage("Unable to connect the video stream.");
      }
    };

    const handleAnswer = async ({ conversationId: answerConversationId, answer }) => {
      if (answerConversationId !== callStateRef.current?.conversationId || !answer) return;
      try {
        const peer = await createPeer();
        await peer.setRemoteDescription(answer);
        setPhase("active");
      } catch (err) {
        console.error("Answer handling error:", err);
        setErrorMessage("Connection negotiation failed.");
      }
    };

    const handleCandidate = async ({ conversationId: candidateConversationId, candidate }) => {
      if (candidateConversationId !== callStateRef.current?.conversationId || !candidate) return;
      try {
        const peer = peerRef.current;
        if (!peer) return;
        await peer.addIceCandidate(candidate);
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    };

    const handleLocalInitiation = async () => {
      try {
        await joinRoom();
        await startOutgoingCall();
      } catch (err) {
        console.error("Outgoing call error:", err);
        setErrorMessage("Unable to access your camera or microphone.");
      }
    };

    const handleRemoteJoin = () => {
      setPhase((prev) => (prev === "connected" ? prev : "active"));
    };

    socket.on("call_accepted", handleCallAccepted);
    socket.on("call_rejected", handleCallRejected);
    socket.on("call_ended", handleCallEnded);
    socket.on("webrtc_offer", handleOffer);
    socket.on("webrtc_answer", handleAnswer);
    socket.on("webrtc_ice_candidate", handleCandidate);
    socket.on("call_joined", handleRemoteJoin);

    const init = async () => {
      await joinRoom();
      if (!isIncoming) {
        await handleLocalInitiation();
      }
    };

    init();

    return () => {
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_rejected", handleCallRejected);
      socket.off("call_ended", handleCallEnded);
      socket.off("webrtc_offer", handleOffer);
      socket.off("webrtc_answer", handleAnswer);
      socket.off("webrtc_ice_candidate", handleCandidate);
      socket.off("call_joined", handleRemoteJoin);

      if (mountIdRef.current === mountId) {
        stopAndClearMedia();
      }
    };
  }, [
    callState?.conversationId,
    callState?.type,
    callState?.callType,
    currentId,
    currentEmail,
    currentName,
    currentRole,
    isVideo,
    isIncoming,
    isCaller,
    onClose,
    setActiveCall,
  ]);

  const handleAccept = async () => {
    const socket = socketRef.current || getSocket(currentId, currentRole, currentEmail);

    try {
      const response = await new Promise((resolve) => {
        socket.emit(
          "accept_call",
          {
            conversationId,
            acceptedById: currentId,
            acceptedByEmail: currentEmail,
            acceptedByName: currentName,
          },
          (ack) => resolve(ack || {})
        );
      });

      if (response?.status === 1 && response.session) {
        setActiveCall({ ...callStateRef.current, ...response.session });
        setPhase("active");
      } else {
        setErrorMessage(response?.msg || "Unable to accept the call.");
      }
    } catch (err) {
      console.error("Accept call error:", err);
      setErrorMessage("Unable to accept the call.");
    }
  };

  const handleReject = async () => {
    const socket = socketRef.current || getSocket(currentId, currentRole, currentEmail);
    socket.emit("reject_call", {
      conversationId,
      rejectedById: currentId,
      rejectedByEmail: currentEmail,
      rejectedByName: currentName,
    });
    onClose?.();
  };

  const handleHangUp = async () => {
    const socket = socketRef.current || getSocket(currentId, currentRole, currentEmail);
    socket.emit("end_call", {
      conversationId,
      endedById: currentId,
      endedByEmail: currentEmail,
      reason: "ended",
    });
    onClose?.();
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextMuted = !isMuted;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextCameraOff = !cameraOff;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !nextCameraOff;
    });
    setCameraOff(nextCameraOff);
  };

  const isRinging = phase === "ringing" || callState?.status === "ringing";
  const isConnected = phase === "connected" || phase === "active" || callState?.status === "active";

  return (
    <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-5xl h-[88vh] max-h-[760px] bg-[#111b21] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative">
        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2 flex-wrap">
                <span>{otherName}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {isVideo ? "HD Video Consultation" : "Encrypted Voice"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {isRinging
                  ? isIncoming
                    ? `Incoming ${isVideo ? "video" : "voice"} consultation`
                    : `Calling ${otherName}...`
                  : isConnected
                  ? "Secure peer connection established"
                  : "Waiting for call state"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
              Advocate-Client Privileged
            </span>
          </div>
        </div>

        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0c1317]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_30%)]" />

          {isVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`absolute inset-0 w-full h-full object-cover bg-slate-950 transition-opacity duration-300 ${
                  remoteReady ? "opacity-100" : "opacity-0"
                }`}
              />
              <audio ref={remoteAudioRef} autoPlay />

              {!remoteReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-4 bg-[#111b21]/85">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 border-4 border-slate-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl relative">
                      {otherName ? otherName.charAt(0).toUpperCase() : "A"}
                      <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-[#111b21]" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h4 className="text-white font-bold text-xl">{otherName}</h4>
                    <p className="text-emerald-400 font-semibold text-sm">
                      {isRinging ? "Waiting for the other side to join" : "Connecting secure WebRTC stream"}
                    </p>
                    <p className="text-slate-400 text-xs">Direct peer-to-peer encrypted video</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 w-32 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 bg-slate-900">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    localReady && !cameraOff ? "opacity-100" : "opacity-0"
                  }`}
                />

                {(!localReady || cameraOff) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2 bg-slate-900/90">
                    <User size={22} />
                    <span className="text-xs font-bold">{currentName || "You"}</span>
                    <span className="text-[10px] text-slate-400">
                      {cameraOff ? "Camera paused" : currentRole === "lawyer" ? "Advocate preview" : "Client preview"}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white/90 drop-shadow-md bg-black/40 px-1.5 py-0.2 rounded-md">
                  You
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 z-10 p-6 h-full">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping duration-1000" />
                <span className="absolute -inset-6 rounded-full bg-emerald-500/15 animate-pulse duration-1500" />

                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 border-4 border-slate-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl relative">
                  {otherName ? otherName.charAt(0).toUpperCase() : "A"}
                  <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-[#111b21]" />
                </div>
              </div>

              <div className="text-center space-y-1.5 max-w-md">
                <h3 className="text-white text-2xl font-bold">{otherName}</h3>
                <p className="text-emerald-400 font-semibold text-base">
                  {isRinging ? "Call is ringing..." : phase === "active" ? "Secure consultation in progress" : "Connecting"}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>High-fidelity WebRTC voice call</span>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-[90%] sm:max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100 shadow-lg backdrop-blur-md flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-300" />
              <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 bg-[#202c33]/95 border-t border-slate-800/80 flex items-center justify-center gap-3 sm:gap-4 z-30 backdrop-blur-md">
          {isIncoming && isRinging ? (
            <>
              <button
                type="button"
                onClick={handleReject}
                className="px-5 sm:px-6 py-3.5 rounded-2xl bg-slate-800 text-white font-bold flex items-center gap-2 shadow-xl transition hover:opacity-95"
              >
                <PhoneOff size={18} />
                <span className="text-xs sm:text-sm">Reject</span>
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="px-5 sm:px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-xl transition cursor-pointer transform hover:scale-105"
              >
                <Phone size={18} />
                <span className="text-xs sm:text-sm">Accept</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMute}
                className={`p-3.5 sm:p-4 rounded-2xl text-white flex items-center gap-2 font-bold text-xs transition ${
                  isMuted ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="hidden sm:inline">{isMuted ? "Unmute" : "Mute"}</span>
              </button>

              {isVideo && (
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`p-3.5 sm:p-4 rounded-2xl text-white flex items-center gap-2 font-bold text-xs transition ${
                    cameraOff ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {cameraOff ? <VideoOff size={20} /> : <Video size={20} />}
                  <span className="hidden sm:inline">{cameraOff ? "Start Camera" : "Camera"}</span>
                </button>
              )}

              {isVideo && (
                <button
                  type="button"
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-800 text-white opacity-70 cursor-not-allowed flex items-center gap-2 font-bold text-xs"
                  disabled
                  title="Screen sharing can be added next"
                >
                  <Monitor size={20} />
                  <span className="hidden sm:inline">Share Screen</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleHangUp}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-xl transition cursor-pointer transform hover:scale-105"
              >
                <PhoneOff size={20} />
                <span className="text-xs sm:text-sm">{phase === "ended" ? "Close" : "Hang Up"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
