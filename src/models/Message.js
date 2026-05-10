import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
        sentDate: { type: Date, default: Date.now },
        response: {
            content: { type: String },
            date: { type: Date }
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
