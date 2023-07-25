const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title:{
        type:String,required:true,
    },
    todo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Todo',
        }
    ],
    isCreated: {
        type: Boolean,
        default: false
    },
    showInput: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    showSubtodos: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Todo',todoSchema)