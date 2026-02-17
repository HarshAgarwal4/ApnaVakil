import express from 'express'
import { getAllUsers } from '../controllers/user.js'
const adminUserRoutes = express.Router()

adminUserRoutes.post('/getUsers' , getAllUsers)

export {adminUserRoutes}