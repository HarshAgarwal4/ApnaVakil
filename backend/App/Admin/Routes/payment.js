import express from 'express'
import { getAllPayments } from '../controllers/payment'
const adminPaymentsRoutes = express.Router()

adminPaymentsRoutes.get('/getAllPayments' , getAllPayments)

export {adminPaymentsRoutes}