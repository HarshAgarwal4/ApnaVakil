import { Server } from "socket.io";
import { MessageModel } from "../App/Users/models/Message.js";
import lawyerModel from "../App/Admin/models/lawyers.js";
import {
  addToRedisSet,
  removeFromRedisSet,
  getRedisSet,
  setInRedis,
  getFromRedis,
  deleteFromRedis,
  pushToRedisList,
  getRedisList,
} from "./redis.js";

let io = null;

export const initSocket = (httpServer, corsOptions) => {
  io = new Server(httpServer, {
    cors: corsOptions || {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.role || "user";
    const userEmail = socket.handshake.query.email || "";

    const userIdentifiers = [userId, userEmail].filter(Boolean);

    // If connected party is a lawyer or has lawyer profile, also join lawyer profile ID
    if (userEmail || userId) {
      try {
        const queryOr = [];
        if (userEmail) queryOr.push({ email: userEmail });
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) queryOr.push({ userId: userId });

        if (queryOr.length > 0) {
          const matchedLawyer = await lawyerModel.findOne({ $or: queryOr }).lean();
          if (matchedLawyer && matchedLawyer._id) {
            userIdentifiers.push(matchedLawyer._id.toString());
          }
        }
      } catch (err) {
        console.log("Lawyer profile lookup error on socket connect:", err);
      }
    }

    if (userIdentifiers.length > 0) {
      for (const id of [...new Set(userIdentifiers)]) {
        socket.join(id);
        try {
          await addToRedisSet("online_users", id);
        } catch (e) {
          console.log("Redis online_users add error:", e);
        }
      }

      // 2. Broadcast online status to all connected users
      io.emit("user_status_change", {
        userId,
        email: userEmail,
        isOnline: true,
      });

      // 3. Mark undelivered messages for this user as 'delivered' (Double Grey Tick)
      try {
        const undeliveredMsgs = await MessageModel.find({
          receiverId: { $in: userIdentifiers },
          status: "sent",
        }).lean();

        if (undeliveredMsgs.length > 0) {
          await MessageModel.updateMany(
            { receiverId: { $in: userIdentifiers }, status: "sent" },
            { $set: { status: "delivered" } }
          );

          const convIds = [...new Set(undeliveredMsgs.map((m) => m.conversationId))];
          convIds.forEach((cId) => {
            io.to(cId).emit("messages_delivered_update", {
              conversationId: cId,
              receiverId: userId || userEmail,
            });
          });
        }
      } catch (delivErr) {
        console.error("Error updating delivered messages on connect:", delivErr);
      }
    }

    // Query Online Status of Users from Redis
    socket.on("get_online_status", async (data, callback) => {
      try {
        const onlineSet = await getRedisSet("online_users");
        if (callback) {
          callback({ status: 1, onlineUsers: onlineSet || [] });
        }
      } catch (e) {
        if (callback) callback({ status: 0, onlineUsers: [] });
      }
    });

    // Join a specific conversation room
    socket.on("join_conversation", async ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    // Leave a specific conversation room
    socket.on("leave_conversation", ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    // Typing indicators
    socket.on("typing", ({ conversationId, senderId, senderName }) => {
      socket.to(conversationId).emit("user_typing", {
        conversationId,
        senderId,
        senderName,
      });
    });

    socket.on("stop_typing", ({ conversationId, senderId }) => {
      socket.to(conversationId).emit("user_stop_typing", {
        conversationId,
        senderId,
      });
    });

    // Send Message Event (Live Status via Redis + DB)
    socket.on("send_message", async (data, callback) => {
      try {
        const {
          conversationId,
          connectionId,
          senderId,
          senderName,
          senderRole,
          receiverId,
          receiverName,
          text,
          attachment,
        } = data;

        if (!conversationId || (!text && !attachment)) {
          if (callback) callback({ status: 0, msg: "Invalid payload" });
          return;
        }

        // Determine Initial Status using Redis online users
        let initialStatus = "sent";
        try {
          const onlineSet = await getRedisSet("online_users");
          const isReceiverOnline =
            onlineSet &&
            (onlineSet.includes(receiverId) ||
              (data.receiverEmail && onlineSet.includes(data.receiverEmail)));

          if (isReceiverOnline) {
            initialStatus = "delivered";
          }
        } catch (e) {
          console.log("Status determination error:", e);
        }

        // 1. Save to MongoDB
        const newMessage = new MessageModel({
          conversationId,
          connectionId,
          senderId,
          senderName,
          senderRole,
          receiverId,
          receiverName,
          text: text || "",
          attachment: attachment || null,
          status: initialStatus,
        });

        const savedMsg = await newMessage.save();

        // 2. Cache in Redis
        try {
          await pushToRedisList(
            `chat:${conversationId}:msgs`,
            JSON.stringify(savedMsg)
          );
          await setInRedis(`chat:${conversationId}:last_msg`, savedMsg, 86400 * 7);
        } catch (redisErr) {
          console.log("Redis cache error on send_message:", redisErr);
        }

        // 3. Emit message to conversation room and to receiver's private room
        socket.to(conversationId).emit("receive_message", savedMsg);
        io.to(receiverId).emit("new_message_notification", savedMsg);

        if (callback) {
          callback({ status: 1, message: savedMsg });
        }
      } catch (err) {
        console.error("Error in socket send_message:", err);
        if (callback) callback({ status: 0, msg: "Message delivery failed" });
      }
    });

    // Mark Messages as Read Event (Double Blue Ticks Live Transition)
    socket.on("mark_messages_read", async ({ conversationId, readerId }) => {
      try {
        if (!conversationId || !readerId) return;

        // 1. Update in MongoDB
        await MessageModel.updateMany(
          {
            conversationId,
            senderId: { $ne: readerId },
            status: { $ne: "read" },
          },
          { $set: { status: "read" } }
        );

        // 2. Update cached last message in Redis
        try {
          const lastMsg = await getFromRedis(`chat:${conversationId}:last_msg`);
          if (lastMsg && lastMsg.senderId !== readerId) {
            lastMsg.status = "read";
            await setInRedis(`chat:${conversationId}:last_msg`, lastMsg, 86400 * 7);
          }
        } catch (redisReadErr) {
          console.log("Redis update read status error:", redisReadErr);
        }

        // 3. Broadcast Double Blue Ticks live to conversation room & reader
        io.to(conversationId).emit("messages_read_update", {
          conversationId,
          readerId,
        });
      } catch (err) {
        console.error("Error in mark_messages_read:", err);
      }
    });

    // ==========================================
    // 🎥 WEBRTC 1-ON-1 AUDIO & VIDEO CALLING (REDIS ONLY - NO DB)
    // ==========================================

    // 1. Call Initiation
    socket.on("call_user", async (data, callback) => {
      try {
        const {
          conversationId,
          callerId,
          callerEmail,
          callerName,
          callerAvatar,
          callerRole,
          receiverId,
          receiverEmail,
          callType, // 'video' | 'audio'
          offer,
        } = data;

        if (!receiverId || !offer) {
          if (callback) callback({ status: 0, msg: "Missing call parameters" });
          return;
        }

        // Check if receiver is in another active call via Redis
        const isReceiverBusy =
          (await getFromRedis(`active_call:${receiverId}`)) ||
          (receiverEmail && (await getFromRedis(`active_call:${receiverEmail}`)));

        if (isReceiverBusy) {
          if (callback) callback({ status: 0, msg: "User is currently busy on another call" });
          return;
        }

        const callSession = {
          conversationId,
          callerId,
          callerEmail,
          callerName,
          callerAvatar,
          callerRole,
          receiverId,
          receiverEmail,
          callType,
          status: "ringing",
          createdAt: Date.now(),
        };

        // Cache call in Redis with 2-minute ringing TTL (No DB storage!)
        await setInRedis(`active_call:${callerId}`, callSession, 120);
        await setInRedis(`active_call:${receiverId}`, callSession, 120);
        if (receiverEmail) await setInRedis(`active_call:${receiverEmail}`, callSession, 120);

        // Send incoming call signal to receiver across all associated socket rooms
        const targets = [...new Set([receiverId, receiverEmail].filter(Boolean))];
        targets.forEach((target) => {
          io.to(target).emit("incoming_call", {
            conversationId,
            callerId,
            callerEmail,
            callerName,
            callerAvatar,
            callerRole,
            callType,
            offer,
          });
        });

        if (callback) callback({ status: 1, msg: "Ringing..." });
      } catch (callErr) {
        console.error("Error in call_user:", callErr);
        if (callback) callback({ status: 0, msg: "Failed to initiate call" });
      }
    });

    // 2. Answer Incoming Call
    socket.on("answer_call", async (data) => {
      try {
        const { callerId, callerEmail, receiverId, answer, callType } = data;

        // Update active call status in Redis to 'connected' with 2-hour TTL
        const connectedSession = {
          callerId,
          callerEmail,
          receiverId,
          callType,
          status: "connected",
          connectedAt: Date.now(),
        };
        await setInRedis(`active_call:${callerId}`, connectedSession, 7200);
        await setInRedis(`active_call:${receiverId || userId}`, connectedSession, 7200);

        // Notify caller across all caller socket rooms that call was accepted
        const callerTargets = [...new Set([callerId, callerEmail].filter(Boolean))];
        callerTargets.forEach((cId) => {
          io.to(cId).emit("call_accepted", {
            answer,
            callType,
            receiverId: receiverId || userId,
          });
        });
      } catch (ansErr) {
        console.error("Error in answer_call:", ansErr);
      }
    });

    // 3. ICE Candidate Exchange
    socket.on("ice_candidate", ({ targetId, targetEmail, candidate }) => {
      if (candidate) {
        const candTargets = [...new Set([targetId, targetEmail].filter(Boolean))];
        candTargets.forEach((tId) => {
          io.to(tId).emit("ice_candidate", {
            candidate,
            senderId: userId,
          });
        });
      }
    });

    // 4. End Call (Hang up)
    socket.on("end_call", async ({ targetId, targetEmail, conversationId }) => {
      try {
        // Clean up from Redis
        if (userId) await deleteFromRedis(`active_call:${userId}`);
        if (targetId) await deleteFromRedis(`active_call:${targetId}`);
        if (targetEmail) await deleteFromRedis(`active_call:${targetEmail}`);

        const endTargets = [...new Set([targetId, targetEmail].filter(Boolean))];
        endTargets.forEach((tId) => {
          io.to(tId).emit("call_ended", { senderId: userId });
        });

        if (conversationId) {
          io.to(conversationId).emit("call_ended", { senderId: userId });
        }
      } catch (endErr) {
        console.error("Error in end_call:", endErr);
      }
    });

    // 5. Reject Call (Decline)
    socket.on("reject_call", async ({ callerId, callerEmail }) => {
      try {
        if (userId) await deleteFromRedis(`active_call:${userId}`);
        if (callerId) await deleteFromRedis(`active_call:${callerId}`);
        if (callerEmail) await deleteFromRedis(`active_call:${callerEmail}`);

        const rejTargets = [...new Set([callerId, callerEmail].filter(Boolean))];
        rejTargets.forEach((cId) => {
          io.to(cId).emit("call_rejected", {
            receiverId: userId,
            msg: "Call declined",
          });
        });
      } catch (rejErr) {
        console.error("Error in reject_call:", rejErr);
      }
    });

    // 6. Media Toggle Sync (Mute / Camera Toggle)
    socket.on("toggle_media", ({ targetId, type, enabled }) => {
      if (targetId) {
        io.to(targetId).emit("peer_media_toggle", {
          senderId: userId,
          type,
          enabled,
        });
      }
    });

    // Disconnect Handler
    socket.on("disconnect", async () => {
      for (const id of userIdentifiers) {
        try {
          await removeFromRedisSet("online_users", id);
          // Check and clean any active calls in Redis
          const activeCall = await getFromRedis(`active_call:${id}`);
          if (activeCall) {
            const peerId = activeCall.callerId === id ? activeCall.receiverId : activeCall.callerId;
            if (peerId) {
              io.to(peerId).emit("call_ended", { senderId: id });
              await deleteFromRedis(`active_call:${peerId}`);
            }
            await deleteFromRedis(`active_call:${id}`);
          }
        } catch (e) {
          console.log("Redis online_users remove error:", e);
        }
      }

      io.emit("user_status_change", {
        userId,
        email: userEmail,
        isOnline: false,
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
