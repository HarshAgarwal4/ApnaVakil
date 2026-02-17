import express from 'express'
import { fetchDrafts } from '../controllers/Drafts.js'
import { DraftChat } from '../controllers/draft1.js'
let draftRoutes = express.Router()

draftRoutes.post('/DraftChat' , DraftChat)
draftRoutes.post('/fetchDrafts' , fetchDrafts)

export {draftRoutes}
