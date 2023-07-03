const Todo = require("../models/todo");
const path = require("../utils/path");
// const chalk = require('chalk');
const colors = require('colors');
const logger = require('../logger/index')

// title
// todo
// isCreated
// showInput
// isCompleted
// showSubtodos

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

/**
 * @param {object} `{ title , todo , isCreated , showInput , isCompleted , showSubtodos }`
**/
exports.putTodo = (req, res, next) => {
    const { todoId, showSubtodos } = req.body;
    console.log(req.body)
    if(!todoId){
        return res.json({errorMsg:"Please provide the Id  to PUT into a Todo ",fieldMissing:true,requiredField:"todoId"})
    }
    if(!showSubtodos){
        return res.json({errorMsg:"Please provide the showSubtodos  to PUT into a Todo ",fieldMissing:true,requiredField:"showSubtodos"})
    }
    let editedTodo = { showSubtodos : showSubtodos === "true" ? true : false }
    Todo.updateTodoById(todoId,editedTodo,(updatedTodo,updatedTodos)=>{
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
    logger.info("///////////newTodo////////////////".yellow)
    logger.warn(colors.red.underline(newTodo))
    newTodo.save(parentId?parentId:"");
    logger.info("///////////REQ.BODY////////////////")
    logger.warn(JSON.stringify(req.body))
    return res.status(200).json(newTodo)
  };