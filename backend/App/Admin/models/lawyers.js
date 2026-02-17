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
        default: '/profile.png'
    },
    categories: [
        {
            type: String,
        }
    ]
},
    { timestamps: true }
)

const lawyerModel = mongoose.model("lawyer" , lawyerSchema);

export default lawyerModel