import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema({
    title: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            _id: false,
            role: {
                type: String,
                enum: ['user', 'system' , 'assistant'],
                required: true
            },
            content: {
                type: String
            }
        }
    ],
    document:{
        type: String
    }
},
    {
        timestamps: true
    }
)

const DraftModel = mongoose.model("Draft", DraftSchema)

export { DraftModel }