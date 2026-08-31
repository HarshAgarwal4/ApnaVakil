import express from "express";
import {
  getConversations,
  getConversationMessages,
  sendMessageHTTP,
  uploadChatAttachment,
} from "../controllers/directChat.js";
import { uploadTemp } from "../../../services/TempUpload.js";

const directChatRouter = express.Router();

directChatRouter.get("/direct-chat/conversations", getConversations);
directChatRouter.get("/direct-chat/messages/:conversationId", getConversationMessages);
directChatRouter.post("/direct-chat/messages", sendMessageHTTP);
directChatRouter.post(
  "/direct-chat/upload",
  uploadTemp.single("file"),
  uploadChatAttachment
);

export default directChatRouter;
