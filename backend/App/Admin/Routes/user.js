import express from 'express'
import { getAllUsers } from '../controllers/user'
const adminUserRoutes = express.Router()

adminUserRoutes.get('/getUsers' , getAllUsers)

export {adminUserRoutes}