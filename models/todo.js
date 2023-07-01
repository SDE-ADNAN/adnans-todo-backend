const fs = require('fs');
const path = require('path');
const logger = require('../logger/index')

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'todos.json'
);

function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 100000);
    return `${timestamp}_${randomNumber}`;
  }

const getTodosFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const findTodoById = (id, todos)=> {
    for (const todo of todos) {
      if (todo.id === id) {
        return todo;
      } else if (todo.todo.length > 0) {
        const foundTodo = findTodoById(id, todo.todo);
        if (foundTodo) {
          return foundTodo;
        }
      }
    }
    return undefined;
  };

  const deleteTodoById = (id , todos) => {
    return todos.filter(todo => {
      if (todo.id === id) {
        // Exclude the todo with the given id
        return false;
      } else if (todo.todo.length > 0) {
        // Recursively delete todos from the sub-todo list
        todo.todo = deleteTodoById(id, todo.todo);
        return true;
      } else {
        // Include the todo if it's not the one to be deleted
        return true;
      }
    });
  };


  //Helper for changing a todo at a specific id
const changeTodoById = (id, updatedTodo, todos) => {
  return todos.map(todo => {
    if (todo.id === id) {
      return updatedTodo;
    } else if (todo.todo.length > 0) {
      return { ...todo, todo: changeTodoById(id, updatedTodo, todo.todo) };
    } else {
      return todo;
    }
  });
};

  /**
  * @name Todo
  * @param { object } object - { todoDetails } parameter
  * @returns { object } object - { newTodo } 
  * `{ title: todoDetails.title,
  * todo: todoDetails.todo,
    isCreated: todoDetails.isCreated,
    showInput: todoDetails.showInput,
    isCompleted: todoDetails.isCompleted,
    showSubtodos: todoDetails.showSubtodos, }`
  * @description Takes title , todo , isCreated , showInput, isCompleted, showSubtodos as args and creates a new todo , but doesn't saves it , u have to save it via `netTodo.save()` .
  */
module.exports = class Todo {

  constructor(title, todo, isCreated, showInput,isCompleted,showSubtodos) {
    this.title= title;
    this.todo= todo;
    this.isCreated= isCreated;
    this.showInput= showInput;
    this.isCompleted=isCompleted;
    this.showSubtodos=showSubtodos;
  }

  save(parentId) {
    this.id= generateUniqueId()
    getTodosFromFile(todos => {
      const parentTodo = findTodoById(parentId, todos);
      logger.log(parentTodo)
      if (parentTodo) {
        parentTodo.todo.push(this);
      } else {
        todos.push(this);
      }
      fs.writeFile(p, JSON.stringify(todos), err => {
        logger.info(err);
      });
    });
  }

  static fetchAll(cb) {
    getTodosFromFile(cb);
  }

  static findById(id, cb){
    getTodosFromFile(todos => {
      const todo = findTodoById(id,todos);
      cb(todo);
    })
  }

  static deleteTodoById = (id,cb) => {
    getTodosFromFile(todos => {
      const deletedTodo = findTodoById(id,todos);
      // const deletedTodoCatched = JSON.parse(JSON.stringify(deletedTodo||{}))
      const updatedTodos = deleteTodoById(id,todos);
      fs.writeFile(p, JSON.stringify(updatedTodos), err => {
        logger.error(err);
      });
      logger.warn(`Todo with ID : ${id} got DELETED`)
      logger.warn(JSON.stringify(deletedTodo))
      cb(updatedTodos, deletedTodo)
    })
  };

  static updateTodoById (id ,changeObj, cb){
    getTodosFromFile(todos => {
      const updatedTodo = findTodoById(id,todos);
      logger.error(id)
      updatedTodo.title = changeObj.newTitle
      const updatedTodos = changeTodoById(id ,updatedTodo,todos )
      fs.writeFile(p, JSON.stringify(updatedTodos), err => {
        logger.error(err);
      });
      logger.warn(`Todo with ID : ${id} got DELETED`)
      logger.warn(JSON.stringify(updatedTodo))
      cb(updatedTodo,updatedTodos);
    })
  }
};
