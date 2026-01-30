import express from 'express'
import { getContacts } from '../controllers/contact'
const adminContactsRoutes = express.Router()

adminContactsRoutes.get('/getAllContact' , getContacts)

export {getContacts}