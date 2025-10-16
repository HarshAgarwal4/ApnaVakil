import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import userModel from "../models/user.js";
import { paymentModel } from "../models/payment.js";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
    try {
        const { amount, currency } = req.body;
        const options = {
            amount: amount * 100, // amount in paise
            currency: currency || "INR",
            receipt: `receipt_${req.user.email}_${Math.floor(Math.random() * 1000)}`,
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create order" });
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            try{
                let user = await userModel.findOneAndUpdate({_id: req.user.id} , {plan: 'Basic' , expDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },{new: true});
            }catch(err){
                console.log(err);
                return res.status(400).json({ success: false, message: "Invalid signature" })
            }
            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
}

async function savePayment(req,res) {
    let userId = req.user.id;
    let email = req.user.email;
    let { plan , amount ,paymentId, orderId, signature } = req.body;
    let expiryDate = Date.now() + 30*24*60*60*1000;
    try {
        let payment = new paymentModel({ userId , email , plan , amount , paymentId, orderId, signature , expiryDate });
        await payment.save();
        res.send({status: 1 , message: "Payment saved successfully"});
    }catch(err){
        console.log(err);
        res.send({status: 0 , message: "Error in saving payment"});
    }
}

async function getPayments(req,res) {
    let userId = req.user.id;
    console.log("hello")
    try {
        let payments = await paymentModel.find({userId});
        console.log(payments);
        res.send({status: 1 , payments});
    }catch(err){
        console.log(err);
        res.send({status: 0 , message: "Error in fetching payments"});
    }
}

export { createOrder, verifyPayment , savePayment , getPayments};