import express from 'express'
import { getContacts } from '../controllers/contact.js'
const adminContactsRoutes = express.Router()

adminContactsRoutes.post('/getAllContact' , getContacts)

export {adminContactsRoutes}