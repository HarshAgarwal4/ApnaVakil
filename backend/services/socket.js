import { Server } from "socket.io";
import { randomUUID } from "crypto";
import { MessageModel } from "../App/Users/models/Message.js";
import lawyerModel from "../App/Admin/models/lawyers.js";
import userModel from "../App/Users/models/user.js";
import {
  addToRedisSet,
  removeFromRedisSet,
  getRedisSet,
  setInRedis,
  getFromRedis,
  deleteFromRedis,
  pushToRedisList,
} from "./redis.js";

let io = null;
const CALL_SESSION_TTL_SECONDS = 60 * 60;

const parseMaybeJson = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const getCallRoomId = (conversationId) => {
  if (!conversationId) return null;
  return `call:${conversationId}`;
};

const getCallSessionKey = (conversationId) => {
  if (!conversationId) return null;
  return `call_session:${conversationId}`;
};

const persistCallSession = async (conversationId, session, ttl = CALL_SESSION_TTL_SECONDS) => {
  const key = getCallSessionKey(conversationId);
  if (!key) return null;
  const payload = JSON.stringify(session);
  await setInRedis(key, payload, ttl);
  return session;
};

const readCallSession = async (conversationId) => {
  const key = getCallSessionKey(conversationId);
  if (!key) return null;
  const value = await getFromRedis(key);
  return parseMaybeJson(value);
};

const endCallSession = async (conversationId) => {
  const key = getCallSessionKey(conversationId);
  if (!key) return;
  await deleteFromRedis(key);
};

// Helper to resolve all associated room identifiers (userId, lawyer profile _id, case-insensitive emails)
async function resolveUserAndLawyerTargets(identifierOrEmail) {
  if (!identifierOrEmail) return [];
  const targets = new Set();
  const idStr = identifierOrEmail.toString().trim();
  targets.add(idStr);
  if (idStr.includes("@")) {
    targets.add(idStr.toLowerCase());
  }

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idStr);
    const query = [];
    if (isObjectId) {
      query.push({ _id: idStr });
      query.push({ userId: idStr });
    }
    if (idStr.includes("@")) {
      query.push({ email: { $regex: new RegExp(`^${idStr}$`, "i") } });
    }

    if (query.length > 0) {
      const [lawyer, user] = await Promise.all([
        lawyerModel.findOne({ $or: query }).lean().catch(() => null),
        userModel.findOne({
          $or: isObjectId
            ? [{ _id: idStr }, ...(idStr.includes("@") ? [{ email: { $regex: new RegExp(`^${idStr}$`, "i") } }] : [])]
            : [{ email: { $regex: new RegExp(`^${idStr}$`, "i") } }],
        }).lean().catch(() => null),
      ]);

      if (lawyer) {
        if (lawyer._id) targets.add(lawyer._id.toString());
        if (lawyer.userId) targets.add(lawyer.userId.toString());
        if (lawyer.email) {
          targets.add(lawyer.email);
          targets.add(lawyer.email.toLowerCase());
        }
      }

      if (user) {
        if (user._id) targets.add(user._id.toString());
        if (user.email) {
          targets.add(user.email);
          targets.add(user.email.toLowerCase());
        }
      }
    }
  } catch (err) {
    console.log("Error resolving targets:", err);
  }

  return [...targets];
}

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
    const activeCallRooms = new Set();

    const joinUserRooms = async (uId, uEmail) => {
      const roomsToJoin = new Set();
      if (uId) roomsToJoin.add(uId.toString().trim());
      if (uEmail) {
        roomsToJoin.add(uEmail.toString().trim());
        roomsToJoin.add(uEmail.toString().trim().toLowerCase());
      }

      if (uId) {
        const resolvedId = await resolveUserAndLawyerTargets(uId);
        resolvedId.forEach((r) => roomsToJoin.add(r));
      }
      if (uEmail) {
        const resolvedEmail = await resolveUserAndLawyerTargets(uEmail);
        resolvedEmail.forEach((r) => roomsToJoin.add(r));
      }

      for (const room of roomsToJoin) {
        socket.join(room);
        try {
          await addToRedisSet("online_users", room);
        } catch (e) {
          console.log("Redis online_users add error:", e);
        }
      }

      return [...roomsToJoin];
    };

    const userIdentifiers = await joinUserRooms(userId, userEmail);

    if (userIdentifiers.length > 0) {
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

    // Explicit User Registration from Client
    socket.on("register_user", async ({ userId: regUserId, email: regEmail }) => {
      if (regUserId || regEmail) {
        await joinUserRooms(regUserId, regEmail);
      }
    });

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

    socket.on("join_call_room", async ({ conversationId, sessionId } = {}, callback) => {
      const roomId = getCallRoomId(conversationId);
      if (!roomId) {
        if (callback) callback({ status: 0, msg: "Missing call room" });
        return;
      }

      socket.join(roomId);
      activeCallRooms.add(roomId);

      let session = null;
      if (sessionId || conversationId) {
        session = await readCallSession(conversationId);
      }

      if (callback) {
        callback({ status: 1, roomId, session });
      }
    });

    socket.on("initiate_call", async (payload = {}, callback) => {
      try {
        const {
          conversationId,
          callType = "video",
          callerId,
          callerEmail,
          callerName,
          callerRole = userRole,
          receiverId,
          receiverEmail,
          receiverName,
          receiverRole,
        } = payload;

        if (!conversationId || (!receiverId && !receiverEmail)) {
          if (callback) callback({ status: 0, msg: "Invalid call payload" });
          return;
        }

        const roomId = getCallRoomId(conversationId);
        const existing = await readCallSession(conversationId);
        if (existing && ["ringing", "active"].includes(existing.status)) {
          if (callback) callback({ status: 0, msg: "A call is already active" });
          return;
        }

        const session = {
          conversationId,
          roomId,
          callType,
          status: "ringing",
          sessionId: randomUUID(),
          caller: {
            id: callerId || userId || null,
            email: callerEmail || userEmail || "",
            name: callerName || "Caller",
            role: callerRole || "user",
          },
          receiver: {
            id: receiverId || null,
            email: receiverEmail || "",
            name: receiverName || "Recipient",
            role: receiverRole || "user",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await persistCallSession(conversationId, session);
        socket.join(roomId);
        activeCallRooms.add(roomId);

        const receiverRoom = receiverId || receiverEmail?.toLowerCase();
        if (receiverRoom) {
          io.to(receiverRoom).emit("incoming_call", session);
        }

        if (callback) callback({ status: 1, session });
      } catch (error) {
        console.error("Error in initiate_call:", error);
        if (callback) callback({ status: 0, msg: "Unable to start call" });
      }
    });

    socket.on("accept_call", async (payload = {}, callback) => {
      try {
        const { conversationId, acceptedById, acceptedByEmail, acceptedByName } = payload;
        if (!conversationId) {
          if (callback) callback({ status: 0, msg: "Missing conversationId" });
          return;
        }

        const existing = await readCallSession(conversationId);
        if (!existing) {
          if (callback) callback({ status: 0, msg: "Call session not found" });
          return;
        }

        const roomId = getCallRoomId(conversationId);
        const updated = {
          ...existing,
          status: "active",
          updatedAt: new Date().toISOString(),
          acceptedBy: {
            id: acceptedById || userId || null,
            email: acceptedByEmail || userEmail || "",
            name: acceptedByName || "Participant",
          },
        };

        await persistCallSession(conversationId, updated);
        socket.join(roomId);
        activeCallRooms.add(roomId);

        io.to(roomId).emit("call_accepted", updated);
        if (callback) callback({ status: 1, session: updated });
      } catch (error) {
        console.error("Error in accept_call:", error);
        if (callback) callback({ status: 0, msg: "Unable to accept call" });
      }
    });

    socket.on("reject_call", async (payload = {}, callback) => {
      try {
        const { conversationId, rejectedById, rejectedByEmail, rejectedByName } = payload;
        if (!conversationId) {
          if (callback) callback({ status: 0, msg: "Missing conversationId" });
          return;
        }

        const existing = await readCallSession(conversationId);
        if (existing) {
          const updated = {
            ...existing,
            status: "rejected",
            updatedAt: new Date().toISOString(),
            rejectedBy: {
              id: rejectedById || userId || null,
              email: rejectedByEmail || userEmail || "",
              name: rejectedByName || "Participant",
            },
          };
          await persistCallSession(conversationId, updated, 60);
          const callerRoom = existing.caller?.id || existing.caller?.email?.toLowerCase();
          if (callerRoom) {
            io.to(callerRoom).emit("call_rejected", updated);
          }
        }

        if (callback) callback({ status: 1 });
      } catch (error) {
        console.error("Error in reject_call:", error);
        if (callback) callback({ status: 0, msg: "Unable to reject call" });
      }
    });

    socket.on("end_call", async (payload = {}, callback) => {
      try {
        const { conversationId, endedById, endedByEmail, reason = "ended" } = payload;
        if (!conversationId) {
          if (callback) callback({ status: 0, msg: "Missing conversationId" });
          return;
        }

        const existing = await readCallSession(conversationId);
        const roomId = getCallRoomId(conversationId);
        const endedSession = existing
          ? {
              ...existing,
              status: "ended",
              reason,
              updatedAt: new Date().toISOString(),
              endedBy: {
                id: endedById || userId || null,
                email: endedByEmail || userEmail || "",
              },
            }
          : {
              conversationId,
              roomId,
              status: "ended",
              reason,
              updatedAt: new Date().toISOString(),
            };

        if (existing) {
          await endCallSession(conversationId);
        }

        if (roomId) {
          io.to(roomId).emit("call_ended", endedSession);
        }

        if (callback) callback({ status: 1 });
      } catch (error) {
        console.error("Error in end_call:", error);
        if (callback) callback({ status: 0, msg: "Unable to end call" });
      }
    });

    socket.on("webrtc_offer", ({ conversationId, offer }) => {
      const roomId = getCallRoomId(conversationId);
      if (roomId && offer) {
        socket.to(roomId).emit("webrtc_offer", {
          conversationId,
          offer,
          from: userId || userEmail || null,
        });
      }
    });

    socket.on("webrtc_answer", ({ conversationId, answer }) => {
      const roomId = getCallRoomId(conversationId);
      if (roomId && answer) {
        socket.to(roomId).emit("webrtc_answer", {
          conversationId,
          answer,
          from: userId || userEmail || null,
        });
      }
    });

    socket.on("webrtc_ice_candidate", ({ conversationId, candidate }) => {
      const roomId = getCallRoomId(conversationId);
      if (roomId && candidate) {
        socket.to(roomId).emit("webrtc_ice_candidate", {
          conversationId,
          candidate,
          from: userId || userEmail || null,
        });
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

    // Disconnect Handler
    socket.on("disconnect", async () => {
      for (const roomId of activeCallRooms) {
        socket.leave(roomId);
      }

      for (const id of userIdentifiers) {
        try {
          await removeFromRedisSet("online_users", id);
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
