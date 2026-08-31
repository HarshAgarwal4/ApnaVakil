import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ShieldCheck,
  User,
  AlertCircle
} from "lucide-react";
import { getSocket } from "../services/socket";

// High-Availability Multi-Provider STUN Servers
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
  iceCandidatePoolSize: 10,
};

// Web Audio API Ringtone / Dial Tone Engine
class SoundFx {
  constructor() {
    this.ctx = null;
    this.interval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playOutgoingTone() {
    this.init();
    if (!this.ctx) return;
    this.stop();

    const beep = () => {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      } catch (e) {}
    };

    beep();
    this.interval = setInterval(beep, 3000);
  }

  playIncomingRingtone() {
    this.init();
    if (!this.ctx) return;
    this.stop();

    const chime = () => {
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.12);
          osc.stop(this.ctx.currentTime + i * 0.12 + 0.35);
        });
      } catch (e) {}
    };

    chime();
    this.interval = setInterval(chime, 2500);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

const soundFx = new SoundFx();

export default function CallModal({
  callState, // { type: 'incoming' | 'outgoing' | 'connected', callType: 'video' | 'audio', caller, receiver, offer, conversationId }
  currentUserId,
  currentUserEmail = "",
  currentUserName,
  currentUserRole,
  onClose,
}) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatusText, setCallStatusText] = useState("Connecting...");
  const [peerMediaState, setPeerMediaState] = useState({ audio: true, video: true });
  const [isConnected, setIsConnected] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const iceCandidatesQueueRef = useRef([]);
  const timerRef = useRef(null);
  const screenTrackRef = useRef(null);

  const socket = getSocket(currentUserId, currentUserRole, currentUserEmail);

  const isVideo = callState?.callType === "video";
  const otherParty =
    callState?.type === "incoming" ? callState.caller : callState?.receiver;
  const targetId = otherParty?.id || otherParty?._id || otherParty?.email;
  const targetEmail = otherParty?.email || "";

  // Reactive binding for remote stream
  useEffect(() => {
    if (remoteStream) {
      remoteStreamRef.current = remoteStream;
      if (remoteVideoRef.current && isVideo) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(() => {});
      }
    }
  }, [remoteStream, isVideo]);

  // Reactive binding for local stream
  useEffect(() => {
    if (localStream && localVideoRef.current && isVideo && !isScreenSharing) {
      localStreamRef.current = localStream;
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream, isVideo, isScreenSharing]);

  // Complete hardware cleanup function
  const cleanup = () => {
    soundFx.stop();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop all local camera and microphone hardware tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {}
      });
      localStreamRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {}
      });
    }

    // Stop remote stream tracks
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      remoteStreamRef.current = null;
    }

    // Stop screen share track
    if (screenTrackRef.current) {
      try {
        screenTrackRef.current.stop();
        screenTrackRef.current.enabled = false;
      } catch (e) {}
      screenTrackRef.current = null;
    }

    // Detach video elements to release hardware lights
    if (localVideoRef.current) {
      try {
        localVideoRef.current.pause();
        localVideoRef.current.srcObject = null;
      } catch (e) {}
    }
    if (remoteVideoRef.current) {
      try {
        remoteVideoRef.current.pause();
        remoteVideoRef.current.srcObject = null;
      } catch (e) {}
    }
    if (remoteAudioRef.current) {
      try {
        remoteAudioRef.current.pause();
        remoteAudioRef.current.srcObject = null;
      } catch (e) {}
    }

    // Close WebRTC PeerConnection
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.ontrack = null;
        peerConnectionRef.current.onicecandidate = null;
        peerConnectionRef.current.onconnectionstatechange = null;
        peerConnectionRef.current.close();
      } catch (e) {}
      peerConnectionRef.current = null;
    }
  };

  // 1. Initialize Outgoing Call or Setup Incoming Ringing
  useEffect(() => {
    let active = true;

    if (callState?.type === "incoming") {
      soundFx.playIncomingRingtone();
      setCallStatusText(isVideo ? "Incoming Video Consultation..." : "Incoming Voice Consultation...");
    } else if (callState?.type === "outgoing") {
      soundFx.playOutgoingTone();
      setCallStatusText("Calling & Ringing...");
      startOutgoingCall();
    }

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  // 2. Outgoing Call WebRTC Setup
  const startOutgoingCall = async () => {
    try {
      const constraints = {
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current && isVideo) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      // Add local media tracks to PeerConnection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle Remote Media Stream
      pc.ontrack = (event) => {
        const [remoteMediaStream] = event.streams;
        if (remoteMediaStream) {
          remoteStreamRef.current = remoteMediaStream;
          setRemoteStream(remoteMediaStream);
        }
      };

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && targetId) {
          socket.emit("ice_candidate", {
            targetId,
            targetEmail,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          soundFx.stop();
          setIsConnected(true);
          setCallStatusText("Connected • End-to-End Privileged");
          startTimer();
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          handleEndCall();
        }
      };

      // Create SDP Offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideo,
      });
      await pc.setLocalDescription(offer);

      socket.emit(
        "call_user",
        {
          conversationId: callState.conversationId,
          callerId: currentUserId,
          callerEmail: currentUserEmail,
          callerName: currentUserName,
          callerAvatar: "/profile.png",
          callerRole: currentUserRole,
          receiverId: targetId,
          receiverEmail: targetEmail,
          callType: callState.callType,
          offer,
        },
        (res) => {
          if (res?.status === 0) {
            cleanup();
            setCallStatusText(res.msg || "User Unavailable");
            setTimeout(onClose, 2000);
          }
        }
      );
    } catch (err) {
      console.error("WebRTC getUserMedia Init error:", err);
      cleanup();
      setCallStatusText("Please allow Microphone and Camera permissions in your browser.");
      setTimeout(onClose, 3000);
    }
  };

  // 3. WebRTC Signaling Listeners via Socket
  useEffect(() => {
    if (!socket) return;

    // Caller receives SDP Answer from Receiver
    socket.on("call_accepted", async ({ answer }) => {
      try {
        soundFx.stop();
        const pc = peerConnectionRef.current;
        if (pc && answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Process any queued ICE candidates
          while (iceCandidatesQueueRef.current.length > 0) {
            const cand = iceCandidatesQueueRef.current.shift();
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          }

          setIsConnected(true);
          setCallStatusText("Connected • End-to-End Privileged");
          startTimer();
        }
      } catch (err) {
        console.error("Error setting remote description on call_accepted:", err);
      }
    });

    // Remote ICE Candidate Received
    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        const pc = peerConnectionRef.current;
        if (pc && candidate) {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceCandidatesQueueRef.current.push(candidate);
          }
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // Remote Peer Hangs Up
    socket.on("call_ended", () => {
      cleanup();
      setCallStatusText("Call Ended");
      setTimeout(onClose, 600);
    });

    // Remote Peer Declines Call
    socket.on("call_rejected", ({ msg }) => {
      cleanup();
      setCallStatusText(msg || "Call Declined");
      setTimeout(onClose, 1200);
    });

    // Remote Peer Toggles Mic / Camera
    socket.on("peer_media_toggle", ({ type, enabled }) => {
      setPeerMediaState((prev) => ({ ...prev, [type]: enabled }));
    });

    return () => {
      socket.off("call_accepted");
      socket.off("ice_candidate");
      socket.off("call_ended");
      socket.off("call_rejected");
      socket.off("peer_media_toggle");
    };
  }, [socket, targetId]);

  // 4. Answer Incoming Call (Receiver Flow)
  const handleAnswerCall = async () => {
    try {
      soundFx.stop();
      setCallStatusText("Connecting camera & audio...");

      const constraints = {
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current && isVideo) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      // Add local media tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote media track
      pc.ontrack = (event) => {
        const [remoteMediaStream] = event.streams;
        if (remoteMediaStream) {
          remoteStreamRef.current = remoteMediaStream;
          setRemoteStream(remoteMediaStream);
        }
      };

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && targetId) {
          socket.emit("ice_candidate", {
            targetId,
            targetEmail,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setIsConnected(true);
          setCallStatusText("Connected • End-to-End Privileged");
          startTimer();
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          handleEndCall();
        }
      };

      // Set Remote Offer
      await pc.setRemoteDescription(new RTCSessionDescription(callState.offer));

      // Flush Queued ICE Candidates
      while (iceCandidatesQueueRef.current.length > 0) {
        const cand = iceCandidatesQueueRef.current.shift();
        await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      // Create Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer_call", {
        callerId: callState.caller?.id,
        callerEmail: callState.caller?.email || "",
        receiverId: currentUserId,
        answer,
        callType: callState.callType,
      });

      setIsConnected(true);
      setCallStatusText("Connected • End-to-End Privileged");
      startTimer();
    } catch (err) {
      console.error("Error answering incoming call:", err);
      handleEndCall();
    }
  };

  // Decline Incoming Call
  const handleRejectCall = () => {
    socket.emit("reject_call", {
      callerId: callState.caller?.id,
      callerEmail: callState.caller?.email || "",
    });
    cleanup();
    onClose();
  };

  // End Active Call
  const handleEndCall = () => {
    socket.emit("end_call", {
      targetId,
      targetEmail,
      conversationId: callState?.conversationId,
    });
    cleanup();
    onClose();
  };

  // Toggle Microphone Mute
  const handleToggleMute = () => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      const audioTrack = activeStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        socket.emit("toggle_media", {
          targetId,
          type: "audio",
          enabled: audioTrack.enabled,
        });
      }
    }
  };

  // Toggle Video Camera
  const handleToggleVideo = () => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream && isVideo) {
      const videoTrack = activeStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        socket.emit("toggle_media", {
          targetId,
          type: "video",
          enabled: videoTrack.enabled,
        });
      }
    }
  };

  // Screen Share Toggle
  const handleToggleScreenShare = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
          localVideoRef.current.play().catch(() => {});
        }

        screenTrack.onended = () => {
          handleStopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
      }
    } else {
      handleStopScreenShare();
    }
  };

  const handleStopScreenShare = () => {
    const pc = peerConnectionRef.current;
    if (screenTrackRef.current) {
      try {
        screenTrackRef.current.stop();
      } catch (e) {}
      screenTrackRef.current = null;
    }
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      const videoTrack = activeStream.getVideoTracks()[0];
      const sender = pc?.getSenders().find((s) => s.track && s.track.kind === "video");
      if (sender && videoTrack) sender.replaceTrack(videoTrack);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = activeStream;
        localVideoRef.current.play().catch(() => {});
      }
    }
    setIsScreenSharing(false);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isIncomingRinging = callState?.type === "incoming" && !isConnected;

  return (
    <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 font-sans">
      {/* Remote Audio Track (Hidden) */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      <div className="w-full max-w-4xl h-[88vh] max-h-[720px] bg-[#111b21] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between relative">
        {/* Top Floating Bar */}
        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{otherParty?.name || "Advocate / Client"}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {isVideo ? "HD Video Consultation" : "Encrypted Voice"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {callDuration > 0 ? (
                  <span className="text-emerald-400 font-bold">{formatTime(callDuration)}</span>
                ) : (
                  callStatusText
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
              ⚖️ Advocate-Client Privileged
            </span>
          </div>
        </div>

        {/* Video / Voice Canvas */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden bg-[#0c1317]">
          {isVideo ? (
            <>
              {/* Remote Video Stream (Full Width & Height) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Placeholder when remote camera is off or not connected yet */}
              {(!remoteStream || !peerMediaState.video || isIncomingRinging) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111b21]/95 z-10 space-y-4">
                  <div className="relative">
                    {isIncomingRinging && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping duration-1000" />
                        <span className="absolute -inset-4 rounded-full bg-emerald-500/15 animate-pulse duration-1500" />
                      </>
                    )}
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 border-4 border-slate-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl relative">
                      {otherParty?.name ? otherParty.name.charAt(0).toUpperCase() : "A"}
                      <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-[#111b21]" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h4 className="text-white font-bold text-xl">{otherParty?.name}</h4>
                    <p className="text-emerald-400 font-semibold text-sm">
                      {callDuration > 0 ? "Camera is turned off" : callStatusText}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Direct WebRTC Peer-to-Peer Encrypted Video
                    </p>
                  </div>
                </div>
              )}

              {/* Picture-in-Picture Local Video Preview (Mirror mode) */}
              <div
                className={`absolute bottom-24 right-4 sm:right-6 w-32 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 bg-slate-900 group ${
                  isIncomingRinging ? "hidden" : ""
                }`}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover -scale-x-100 ${isVideoOff ? "hidden" : ""}`}
                />
                {isVideoOff && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-1">
                    <VideoOff size={18} />
                    <span>Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white/90 drop-shadow-md bg-black/40 px-1.5 py-0.2 rounded-md">
                  You
                </div>
              </div>
            </>
          ) : (
            /* Voice Call Canvas with Acoustic Pulse Animations */
            <div className="flex flex-col items-center justify-center space-y-6 z-10 p-6">
              <div className="relative">
                {/* Acoustic Sound Ripples */}
                {callDuration > 0 ? (
                  <>
                    <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping duration-1000" />
                    <span className="absolute -inset-6 rounded-full bg-emerald-500/15 animate-pulse duration-1500" />
                  </>
                ) : (
                  <>
                    <span className="absolute inset-0 rounded-full bg-blue-500/25 animate-ping duration-1000" />
                    <span className="absolute -inset-4 rounded-full bg-blue-500/10 animate-pulse duration-1500" />
                  </>
                )}

                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 border-4 border-slate-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl relative">
                  {otherParty?.name ? otherParty.name.charAt(0).toUpperCase() : "A"}
                  <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-[#111b21]" />
                </div>
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-white text-2xl font-bold">{otherParty?.name}</h3>
                <p className="text-emerald-400 font-semibold text-base">
                  {callDuration > 0 ? formatTime(callDuration) : callStatusText}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>High-Fidelity WebRTC Voice Call • Privileged</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Call Controls Bar */}
        <div className="p-4 sm:p-6 bg-[#202c33]/95 border-t border-slate-800/80 flex items-center justify-center gap-4 sm:gap-6 z-30 backdrop-blur-md">
          {isIncomingRinging ? (
            /* Incoming Call Action Buttons */
            <div className="flex items-center gap-8">
              <button
                onClick={handleRejectCall}
                className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white transition group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-105">
                  <PhoneOff size={24} />
                </div>
                <span className="text-xs font-bold">Decline</span>
              </button>

              <button
                onClick={handleAnswerCall}
                className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-white transition group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-105 animate-bounce">
                  {isVideo ? <Video size={24} /> : <Phone size={24} />}
                </div>
                <span className="text-xs font-bold">{isVideo ? "Accept Video" : "Accept Voice"}</span>
              </button>
            </div>
          ) : (
            /* Active Call Controls */
            <>
              {/* Mic Toggle */}
              <button
                onClick={handleToggleMute}
                className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex items-center gap-2 font-bold text-xs ${
                  isMuted
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="hidden sm:inline">{isMuted ? "Muted" : "Mute"}</span>
              </button>

              {/* Video Camera Toggle (Video Call Only) */}
              {isVideo && (
                <button
                  onClick={handleToggleVideo}
                  className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex items-center gap-2 font-bold text-xs ${
                    isVideoOff
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                  title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  <span className="hidden sm:inline">{isVideoOff ? "Camera Off" : "Camera"}</span>
                </button>
              )}

              {/* Screen Share (Video Call Only) */}
              {isVideo && (
                <button
                  onClick={handleToggleScreenShare}
                  className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex items-center gap-2 font-bold text-xs ${
                    isScreenSharing
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                  title={isScreenSharing ? "Stop Sharing Screen" : "Share Legal Documents / Screen"}
                >
                  <Monitor size={20} />
                  <span className="hidden sm:inline">{isScreenSharing ? "Sharing" : "Share Screen"}</span>
                </button>
              )}

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-xl transition cursor-pointer transform hover:scale-105"
                title="End Consultation Call"
              >
                <PhoneOff size={20} />
                <span className="text-xs sm:text-sm">End Call</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
