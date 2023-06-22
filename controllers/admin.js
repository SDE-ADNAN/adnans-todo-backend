const Todo = require("../models/todo");
const path = require("../utils/path");



exports.getAllTodos = (req, res, next) => {
    // const newTodo = new Todo("call Papa", [] , true , false , false  ,false)
    // console.log(newTodo)
    // newTodo.save("1687164765261_33137");
    Todo.fetchAll((todos)=>{
        res.json(todos)
    })
  };


exports.postTodo = (req, res, next) => {
    const {parentId,title,isCreated,showInput,isCompleted,showSubtodos} = req.body
    const newTodo = new Todo(title, [] , isCreated==="true" , showInput==="true" , isCompleted==="true"  ,showSubtodos==="true")
    console.log("///////////newTodo////////////////")
    console.log(newTodo)
    newTodo.save(parentId?parentId:"");
    // Todo.fetchAll((todos)=>{
    //     res.json(todos)
    // })
    console.log("///////////REQ.BODY////////////////")
    console.log(JSON.stringify(req.body))
    res.status(200).json(req.body)
  };