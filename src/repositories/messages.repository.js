import Message from '../models/Message.js';

const createMessage = async (messageData) => {
    return await Message.create(messageData);
};

const findAllMessages = async (filters = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
        Message.find(filters).populate('user', 'name email').populate('product', 'name').skip(skip).limit(limit),
        Message.countDocuments(filters)
    ]);
    return { messages, total };
};

const findMessagesByUser = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
        Message.find({ user: userId }).populate('product', 'name').skip(skip).limit(limit),
        Message.countDocuments({ user: userId })
    ]);
    return { messages, total };
};

const findMessageById = async (id) => {
    return await Message.findById(id).populate('user', 'name email').populate('product', 'name');
};

const updateMessageResponse = async (id, response) => {
    return await Message.findByIdAndUpdate(id, { response }, { new: true });
};

const markAsRead = async (id) => {
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
};

export default {
    createMessage,
    findAllMessages,
    findMessagesByUser,
    findMessageById,
    updateMessageResponse,
    markAsRead
};
