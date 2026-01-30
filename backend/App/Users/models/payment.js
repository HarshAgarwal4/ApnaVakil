import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    plan: { type: String, enum: ['Free', 'Basic', 'Premium'], default: 'Free' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    expiryDate: { type: String, required: true },
}, {
    timestamps: true
})

const paymentModel = mongoose.model("payment" , paymentSchema);

export {paymentModel}