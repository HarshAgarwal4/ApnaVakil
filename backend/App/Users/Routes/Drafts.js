import express from 'express'
import { fetchDrafts } from '../controllers/Drafts.js'
import { DraftChat , selectionEdit } from '../controllers/draft1.js'
let draftRoutes = express.Router()

draftRoutes.post('/DraftChat' , DraftChat)
draftRoutes.post('/fetchDrafts' , fetchDrafts)
draftRoutes.post('/editDraft' , selectionEdit)

export {draftRoutes}
