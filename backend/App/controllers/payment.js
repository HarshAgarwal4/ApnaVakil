import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import userModel from "../models/user.js";
import { paymentModel } from "../models/payment.js";
import { sendMail } from "../../services/mail.js";
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
            try {
                let user = await userModel.findOneAndUpdate({ _id: req.user.id }, { plan: 'Basic', expDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, { new: true });
                const subscriptionEmail = (name, orderId, paymentId, startDate, expiryDate, loginUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApnaVakil Subscription Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    .details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .details p {
      margin: 5px 0;
    }
    .button-container {
      text-align: center;
      margin-bottom: 20px;
    }
    .button {
      background-color: #2563eb;
      color: #ffffff;
      padding: 12px 25px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #888888;
      background-color: #f4f4f4;
    }
    @media screen and (max-width: 600px) {
      .container { width: 90%; }
      .header h1 { font-size: 20px; }
      .content h2 { font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ApnaVakil</h1>
    </div>

    <div class="content">
      <h2>Subscription Confirmation</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for subscribing to ApnaVakil! Your 1-month subscription is now active, and you can enjoy unlimited access to our AI-powered legal assistant services.</p>

      <div class="details">
        <p><strong>Subscription Plan:</strong> Basic</p>
        <p><strong>Duration:</strong> 1 Month</p>
        <p><strong>Amount Paid:</strong> ₹20</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>Expiry Date:</strong> ${expiryDate}</p>
      </div>

      <div class="button-container">
        <a href="${loginUrl}" class="button">Access Your Account</a>
      </div>

      <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@apnavakil.com">support@apnavakil.com</a>.</p>
      <p>We’re excited to help you with all your legal queries!</p>

      <p>Best regards,<br>ApnaVakil Team</p>
    </div>

    <div class="footer">
      &copy; 2025 ApnaVakil. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

                  const htmlContent = subscriptionEmail(
                    user.name,
                    razorpay_order_id,
                    razorpay_payment_id,
                    new Date(Date.now()).toLocaleDateString(),
                    user.expDate,
                    process.env.FRONTEND_URL + '/login'
                );
                let r = sendMail(req.user.email, "ApnaVakil: Your 1-Month Subscription is Confirmed ✅" , htmlContent)
            } catch (err) {
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

async function savePayment(req, res) {
    let userId = req.user.id;
    let email = req.user.email;
    let { plan, amount, paymentId, orderId, signature } = req.body;
    let expiryDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
    try {
        let payment = new paymentModel({ userId, email, plan, amount, paymentId, orderId, signature, expiryDate });
        await payment.save();
        res.send({ status: 1, message: "Payment saved successfully" });
    } catch (err) {
        console.log(err);
        res.send({ status: 0, message: "Error in saving payment" });
    }
}

async function getPayments(req, res) {
    let userId = req.user.id;
    console.log("hello")
    try {
        let payments = await paymentModel.find({ userId });
        console.log(payments);
        res.send({ status: 1, payments });
    } catch (err) {
        console.log(err);
        res.send({ status: 0, message: "Error in fetching payments" });
    }
}

export { createOrder, verifyPayment, savePayment, getPayments };