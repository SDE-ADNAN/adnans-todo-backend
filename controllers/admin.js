const Todo = require("../models/todo2");
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
  
    // Step 1: Find the parent todo document
    Todo.findById(parentId)
      .populate({
        path: 'todo',
      })
      .exec()
      .then((parentTodo) => {
        if (!parentTodo) {
          return res.status(404).json({ message: 'Parent todo not found.' });
        }
  
        // Step 2: Create a new sub-todo document
        const subTodo = new Todo({
          title: subTodoTitle,
          todo: [], // You can add sub-todos to this sub-todo if needed
          isCreated: true,
          showInput: false,
          isCompleted: false,
          showSubtodos: true,
        });
  
        // Step 3: Push the new sub-todo's ObjectId into the parent todo's todo array
        parentTodo.todo.push(subTodo);
  
        // Step 4: Save the parent todo document with the updated todo array
        return parentTodo.save();
      })
      .then((savedParentTodo) => {
        console.log('Sub-todo added to the parent todo:', savedParentTodo);
        return res.status(200).json(savedParentTodo);
      })
      .catch((err) => {
        console.error('Error adding sub-todo:', err);
        return res.status(500).json({ message: 'Failed to add sub-todo.' });
      });
  };
  
  