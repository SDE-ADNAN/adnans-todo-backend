const mongoose = require('mongoose');

const subTodoSchema = new mongoose.Schema({
    title:{
        type:String,required:true,
    },
})

module.exports = mongoose.model('SubTodo',subTodoSchema)