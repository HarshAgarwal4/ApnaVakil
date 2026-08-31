import { MessageModel } from "../models/Message.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import lawyerModel from "../../Admin/models/lawyers.js";
import { userModel } from "../models/user.js";
import {
  getFromRedis,
  setInRedis,
  getRedisList,
  pushToRedisList,
  getRedisSet,
} from "../../../services/redis.js";

// Fetch all active direct chat conversations for logged-in user or advocate
export async function getConversations(req, res) {
  try {
    if (!req.user) {
      return res.send({ status: 0, msg: "Authentication required" });
    }

    const currentUserId = req.user._id.toString();
    const currentUserEmail = req.user.email;
    const isLawyer = req.user.role === "lawyer";

    let connections = [];

    if (isLawyer) {
      // Find all active requests received by this lawyer
      connections = await ConnectionRequest.find({
        lawyerEmail: currentUserEmail,
        status: { $in: ["active", "accepted"] },
      })
        .sort({ updatedAt: -1 })
        .lean();
    } else {
      // Find all active requests submitted by this client
      connections = await ConnectionRequest.find({
        $or: [{ userId: req.user._id }, { clientEmail: currentUserEmail }],
        status: { $in: ["active", "accepted"] },
      })
        .sort({ updatedAt: -1 })
        .lean();
    }

    // Get online users from Redis
    let onlineUsers = [];
    try {
      onlineUsers = await getRedisSet("online_users");
    } catch (e) {
      console.log("Redis get online users error:", e);
    }

    // Fetch lawyer models for avatars/names
    const lawyerEmails = [...new Set(connections.map((c) => c.lawyerEmail))];
    const lawyers = await lawyerModel.find({ email: { $in: lawyerEmails } }).lean();
    const lawyerMap = {};
    lawyers.forEach((l) => {
      lawyerMap[l.email] = l;
    });

    const conversationList = await Promise.all(
      connections.map(async (conn) => {
        const convId = `conv_${conn._id}`;
        const lawyerInfo = lawyerMap[conn.lawyerEmail] || {};

        // Fetch last message from Redis or Mongo
        let lastMsg = null;
        try {
          lastMsg = await getFromRedis(`chat:${convId}:last_msg`);
        } catch (e) {}

        if (!lastMsg) {
          lastMsg = await MessageModel.findOne({ conversationId: convId })
            .sort({ createdAt: -1 })
            .lean();
        }

        // Count unread messages
        const unreadCount = await MessageModel.countDocuments({
          conversationId: convId,
          receiverId: currentUserId,
          status: { $ne: "read" },
        });

        const otherPartyEmail = isLawyer ? conn.clientEmail : conn.lawyerEmail;
        const otherPartyId = isLawyer
          ? conn.userId ? conn.userId.toString() : conn.clientEmail
          : lawyerInfo._id ? lawyerInfo._id.toString() : conn.lawyerEmail;

        const otherPartyName = isLawyer
          ? conn.clientName || "Client"
          : lawyerInfo.name || "Advocate";

        const otherPartyAvatar = isLawyer
          ? "/profile.png"
          : lawyerInfo.images || "/profile.png";

        const isOtherPartyOnline =
          onlineUsers.includes(otherPartyId) ||
          onlineUsers.includes(otherPartyEmail) ||
          (lawyerInfo._id && onlineUsers.includes(lawyerInfo._id.toString()));

        return {
          conversationId: convId,
          connectionId: conn._id,
          caseType: conn.caseType || "Legal Consultation",
          initialMessage: conn.message,
          otherParty: {
            id: otherPartyId,
            email: otherPartyEmail,
            name: otherPartyName,
            role: isLawyer ? "user" : "lawyer",
            avatar: otherPartyAvatar,
            speciality: lawyerInfo.speciality || "Advocate",
            online: Boolean(isOtherPartyOnline),
          },
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                attachment: lastMsg.attachment,
                senderId: lastMsg.senderId,
                status: lastMsg.status,
                createdAt: lastMsg.createdAt,
              }
            : {
                text: conn.message,
                createdAt: conn.createdAt,
              },
          unreadCount,
          createdAt: conn.createdAt,
          updatedAt: conn.updatedAt,
        };
      })
    );

    return res.send({ status: 1, conversations: conversationList });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return res.send({ status: 0, msg: "Failed to fetch conversations" });
  }
}

// Send message via HTTP API with Socket.io broadcast + Redis caching
export async function sendMessageHTTP(req, res) {
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
    } = req.body;

    if (!conversationId || (!text && !attachment)) {
      return res.send({ status: 0, msg: "Invalid message payload" });
    }

    const currentUserId = req.user?._id?.toString() || senderId;
    const currentUserName = req.user?.name || senderName || "User";
    const currentUserRole = req.user?.role || senderRole || "user";

    const newMessage = new MessageModel({
      conversationId,
      connectionId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId: receiverId || "",
      receiverName: receiverName || "",
      text: text || "",
      attachment: attachment || null,
      status: "sent",
    });

    const savedMsg = await newMessage.save();

    // Cache in Redis
    try {
      await pushToRedisList(
        `chat:${conversationId}:msgs`,
        JSON.stringify(savedMsg)
      );
      await setInRedis(`chat:${conversationId}:last_msg`, savedMsg, 86400 * 7);
    } catch (redisErr) {
      console.log("Redis cache error on sendMessageHTTP:", redisErr);
    }

    return res.send({ status: 1, message: savedMsg });
  } catch (err) {
    console.error("Error sending message via HTTP:", err);
    return res.send({ status: 0, msg: "Failed to send message" });
  }
}

// Fetch historical messages for a conversation
export async function getConversationMessages(req, res) {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.send({ status: 0, msg: "Conversation ID required" });
    }

    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return res.send({ status: 1, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.send({ status: 0, msg: "Failed to fetch messages" });
  }
}

// Upload document / image attachment for chat (Max 5 MB)
export async function uploadChatAttachment(req, res) {
  try {
    if (!req.file) {
      return res.send({ status: 0, msg: "No file provided" });
    }

    // 5 MB limit check: 5 * 1024 * 1024 bytes
    const MAX_SIZE = 5 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      return res.send({
        status: 0,
        msg: "File size exceeds the 5 MB limit. Please upload a smaller file.",
      });
    }

    const fileSizeFormatted =
      req.file.size > 1024 * 1024
        ? (req.file.size / (1024 * 1024)).toFixed(1) + " MB"
        : (req.file.size / 1024).toFixed(1) + " KB";

    let fileUrl = "";

    // Try Cloudinary upload if configured, else serve locally
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && req.file.path) {
        const { uploadFileToCloud } = await import("../../../services/cloudinary.js");
        const cloudResult = await uploadFileToCloud(req.file.path);
        fileUrl = cloudResult.secure_url;
      }
    } catch (cloudErr) {
      console.log("Cloudinary upload failed, falling back:", cloudErr);
    }

    if (!fileUrl && req.file.filename) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    return res.send({
      status: 1,
      file: {
        name: req.file.originalname || "Document",
        url: fileUrl,
        size: fileSizeFormatted,
        type: req.file.mimetype || "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("Error in uploadChatAttachment:", err);
    return res.send({ status: 0, msg: "Failed to upload file attachment" });
  }
}
