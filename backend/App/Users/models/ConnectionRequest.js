import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    lawyerEmail: {
      type: String,
      required: true,
      index: true,
    },
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lawyer",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      default: "",
    },
    caseType: {
      type: String,
      default: "General Legal Matter",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "accepted", "completed"],
      default: "pending",
    },
    responseMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default ConnectionRequest;
