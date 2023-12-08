import mongoose from 'mongoose';

const subTodoSchema = new mongoose.Schema({
    title: {
        type: String, required: true,
    },
    description: {
        type: String, required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true })

export default mongoose.model('SubTodo', subTodoSchema)