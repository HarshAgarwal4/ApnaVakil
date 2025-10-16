import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            _id: false,
            role: { type: String, enum: ['user', 'model'], required: true },
            parts: [
                {
                    text: { type: String, required: true },
                    file: { type: String , required: false },
                    fileType: { type: String ,required: false},
                    fileName: { type: String , required: false }
                }
            ]
        }
    ]
})

const History = mongoose.model('History', historySchema);

export default History;