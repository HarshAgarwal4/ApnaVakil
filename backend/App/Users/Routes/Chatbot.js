import express from 'express'
import { chat, fetchHistory } from '../controllers/Chatbot.js'
import { uploadFile } from '../../../services/cloudinary.js'
import { uploadTemp } from '../../../services/TempUpload.js'
const chatRouter = express.Router()

chatRouter.post('/chat' , uploadTemp.single("file") ,chat)
chatRouter.get('/fetchHistory' , fetchHistory)

export {chatRouter}