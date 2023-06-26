const Todo = require("../models/todo");
const path = require("../utils/path");
// const chalk = require('chalk');
const colors = require('colors');
const logger = require('../logger/index')


exports.getAllTodos = (req, res, next) => {
    Todo.fetchAll((todos)=>{
        return res.json(todos)
    })
};
exports.getTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    Todo.findById(reqTodoId,(todo)=>{
        return res.json(todo)
    })
};
exports.putTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    const reqNewTitle = req.body.newTitle
    if(!reqTodoId){
        return res.json({errorMsg:"Please provide the Id  to PUT into a Todo ",fieldMissing:true,requiredField:"todoId"})
    }
    if(!reqNewTitle){
        return res.json({errorMsg:"Please provide the newTitle  to PUT into a Todo ",fieldMissing:true,requiredField:"newTitle"})
    }
    const changeObj = {newTitle:reqNewTitle}
    Todo.updateTodoById(reqTodoId,changeObj,(updatedTodo,updatedTodos)=>{
        return res.json({updatedTodo,updatedTodos})
    })
};
exports.deleteTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    if(!reqTodoId){
        return res.json({errorMsg:"Please provide the Id  to delete Todo ",fieldMissing:true,requiredField:"todoId"})
    }
    Todo.deleteTodoById(reqTodoId,(updatedTodos,deletedTodo)=>{
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
    return res.status(200).json(req.body)
  };