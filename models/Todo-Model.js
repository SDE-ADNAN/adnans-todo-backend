const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String, required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    todo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo',
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('Todo', todoSchema)