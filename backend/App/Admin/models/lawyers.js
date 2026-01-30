import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    images: {
        type: String,
        default: '/logo.png'
    },
    categories: [
        {
            type: String,
        }
    ]
},
    { timestamps: true }
)

export {lawyerSchema}