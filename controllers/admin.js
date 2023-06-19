const Todo = require("../models/todo");
const path = require("../utils/path");



exports.getJson = (req, res, next) => {
    const newTodo = new Todo("call Papa", [] , true , false , false  ,false)
    console.log(newTodo)
    newTodo.save("1687164765261_33137");
    Todo.fetchAll((todos)=>{
        res.json(todos)
    })
    // res.redirect('/')
    
  };