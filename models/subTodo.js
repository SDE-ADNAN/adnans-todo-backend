const mongoose = require('mongoose');

const subTodoSchema = new mongoose.Schema({
    title:{
        type:String,required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
},{ timestamps: true })

module.exports = mongoose.model('SubTodo',subTodoSchema)