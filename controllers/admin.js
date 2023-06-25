const Todo = require("../models/todo");
const path = require("../utils/path");
// const chalk = require('chalk');
const colors = require('colors');
const logger = require('../logger/index')


exports.getAllTodos = (req, res, next) => {
    console.log("///////////newTodo////////////////".yellow)
    Todo.fetchAll((todos)=>{
        res.json(todos)
    })
};
exports.getTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    Todo.findById(reqTodoId,(todo)=>{
        res.json(todo)
    })
};
exports.putTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    Todo.findById(reqTodoId,(todo)=>{
        res.json(todo)
    })
};
exports.deleteTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    if(!reqTodoId){
        logger.error("inside if")
        return res.json({errorMsg:"Please provide the Id  to delete Todo ",fieldMissing:true,requiredField:"todoId"})
    }
    Todo.deleteTodoById(reqTodoId,(updatedTodos,deletedTodo)=>{
        logger.error("inside deleteTodoById")
        let responseObj = {
            updatedTodos,
            deletedTodo,
            todoDeleted:true,

        }
        if(deletedTodo === undefined || deletedTodo === null){
            return res.json({error : true , errorMsg: ` No todo to delete with ID : ${reqTodoId}`})
        }
        return res.json(responseObj)
    })
};


exports.postTodo = (req, res, next) => {
    const {parentId,title} = req.body
    const newTodo = new Todo(title, [] , true , false,false,true)
    console.log("///////////newTodo////////////////".yellow)
    console.log(colors.red.underline(newTodo))
    newTodo.save(parentId?parentId:"");
    console.log("///////////REQ.BODY////////////////")
    console.log(JSON.stringify(req.body))
    res.status(200).json(req.body)
  };