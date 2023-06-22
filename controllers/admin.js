const Todo = require("../models/todo");
const path = require("../utils/path");



exports.getAllTodos = (req, res, next) => {
    Todo.fetchAll((todos)=>{
        res.json(todos)
    })
  };


exports.postTodo = (req, res, next) => {
    const {parentId,title} = req.body
    const newTodo = new Todo(title, [] , true , false,false,true)
    console.log("///////////newTodo////////////////")
    console.log(newTodo)
    newTodo.save(parentId?parentId:"");
    console.log("///////////REQ.BODY////////////////")
    console.log(JSON.stringify(req.body))
    res.status(200).json(req.body)
  };