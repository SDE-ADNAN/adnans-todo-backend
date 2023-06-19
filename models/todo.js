const fs = require('fs');
const path = require('path');

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
      console.log(parentTodo)
      if (parentTodo) {
        parentTodo.todo.push(this);
      } else {
        todos.push(this);
      }
      fs.writeFile(p, JSON.stringify(todos), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getTodosFromFile(cb);
  }

  static findById(id, cb){
    getTodosFromFile(todos => {
      const product = findTodoById(id,todos);
      cb(product);
    })
  }
};
