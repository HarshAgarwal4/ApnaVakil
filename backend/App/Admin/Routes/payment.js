import express from 'express'
import { getAllPayments } from '../controllers/payment.js'
const adminPaymentsRoutes = express.Router()

adminPaymentsRoutes.post('/getAllPayments' , getAllPayments)

export {adminPaymentsRoutes}