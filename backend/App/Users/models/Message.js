import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectionRequest",
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "lawyer", "admin"],
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
    },
    text: {
      type: String,
      default: "",
    },
    attachment: {
      name: { type: String },
      url: { type: String },
      type: { type: String },
      size: { type: String },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", messageSchema);
