const Todo = require("../models/todo2");
const subTodo = require("../models/subTodo");
const path = require("../utils/path");
// const chalk = require('chalk');
const colors = require('colors');
const logger = require('../logger/index')


exports.getAllTodos = (req, res, next) => {
    Todo.find()
    .populate('todo')
    .exec()
    .then(Todos => {
        console.log(Todos);
        return res.json(Todos)
      })
    .catch(err => console.log(err));
};

exports.getTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    Todo.findById(reqTodoId)
    .then(todo=>{
        if(todo)
        return res.json(todo)
        else res.json({message:"no todo found "})
    })
    .catch(err=>{
        console.log(err)
    })
};

exports.getSubTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    subTodo.findById(reqTodoId)
    .then(todo=>{
        return res.json(todo)
    })
    .catch(err=>{
        console.log(err)
    })
};

/**
 * @param {object} `{ title , todo , isCreated , showInput , isCompleted , showSubtodos }`
**/
exports.putTodo = (req, res, next) => {
    console.log(req.body)
    const { todoId, changeObj } = req.body;

    Todo.findByIdAndUpdate(
      todoId,
      { ...changeObj},
    //   { new: true } // Return the updated document after the update
    ).then(updatedTodo=>{
        if(!updatedTodo){
            return res.status(404).json({ message: 'Todo not found.' });
        }
        return res.status(200).json(updatedTodo);
    })
    .catch(err=>{
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Failed to update todo.' });
    })
  }
exports.deleteTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    if(!reqTodoId){
        return res.json({errorMsg:"Please provide the Id  to delete Todo ",fieldMissing:true,requiredField:"todoId"})
    }
    Todo.findByIdAndDelete(reqTodoId)
    .then(deletedTodo=>{
        if(deletedTodo){
            return res.status(200).json(deletedTodo)
        }else{
            return res.status(500).json("something went wrong")
        }
    })
    .catch(err=>console.log(err))
};


exports.postTodo = (req, res, next) => {
    const {parentId,title} = req.body
    const newTodo = new Todo({title:title, todo:[] , isCreated:true , showInput:false,isCompleted:false,showSubTodo:true})
    newTodo.save()
    .then((newTodo)=>{
        logger.warn(colors.red.underline(newTodo))
        return res.status(200).json(newTodo)
    })
    .catch(err=>console.log(err))
  };


exports.postSubTodo = (req, res, next) => {
const { parentId, subTodoTitle } = req.body;

    Todo.findById(parentId)
        .then((parentTodo) => {
        if (!parentTodo) {
            return res.status(404).json({ message: 'Parent todo not found.' });
        }
        const newSubTodo = new subTodo({
            title: subTodoTitle,
        });
        return newSubTodo.save();
    })
        .then((savedSubTodo) => {
        return Todo.findByIdAndUpdate(parentId, { $push: { todo: savedSubTodo._id }})
    })
        .then((updatedParentTodo) => {
        console.log('Sub-todo added to the parent todo:', updatedParentTodo);
        return res.status(200).json(updatedParentTodo);
    })
        .catch((err) => {
        console.error('Error adding sub-todo:', err);
        return res.status(500).json({ message: 'Failed to add sub-todo.' });
    });
};