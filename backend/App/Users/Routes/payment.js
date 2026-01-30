import express from "express";
import { createOrder, verifyPayment, savePayment, getPayments } from "../controllers/payment.js";
import e from "express";
let PaymentRouter = express.Router();

PaymentRouter.post('/payment' , createOrder)
PaymentRouter.post('/verifyPayment' , verifyPayment)
PaymentRouter.post('/savePayment' , savePayment)
PaymentRouter.get('/getPayments' , getPayments)

export {PaymentRouter}