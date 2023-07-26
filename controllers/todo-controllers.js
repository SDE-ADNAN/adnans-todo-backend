const Todo = require("../models/Todo-Model");
const subTodo = require("../models/SubTodo-Model");
const colors = require('colors');
const logger = require('../logger/index');
const User = require("../models/User-Model");
const mongoose = require('mongoose');


exports.getAllTodos = (req, res, next) => {
    Todo.find({ user: req.userId })
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
        .then(todo => {
            if (todo)
                return res.json(todo)
            else res.json({ message: "no todo found " })
        })
        .catch(err => {
            console.log(err)
        })
};

exports.getSubTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    subTodo.findById(reqTodoId)
        .then(todo => {
            return res.json(todo)
        })
        .catch(err => {
            console.log(err)
        })
};

exports.putTodo = (req, res, next) => {
    const { todoId, changeObj } = req.body;
    let parsedChangeObj = null;
    try {
        parsedChangeObj = JSON.parse(changeObj);
    } catch (err) {
        if (err) {
            logger.error(err)
            return res.status(500).json({ message: 'changeObj Json is invalid pls stringify it before sending in formData. ' })
        }
    }

    Todo.findByIdAndUpdate(
        todoId,
        { $set: parsedChangeObj },
        { new: true } // Return the updated document after the update
    ).then(updatedTodo => {
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
        return res.status(200).json(updatedTodo);
    })
        .catch(err => {
            console.error('Error updating todo:', err);
            return res.status(500).json({ message: 'Failed to update todo.' });
        })
}

exports.putSubTodo = (req, res, next) => {
    console.error(req.body)
    const { todoId, changeObj } = req.body;
    const parsedChangeObj = JSON.parse(changeObj);

    subTodo.findByIdAndUpdate(
        todoId,
        { $set: parsedChangeObj },
        { new: true } // Return the updated document after the update
    ).then(updatedSubTodo => {
        if (!updatedSubTodo) {
            return res.status(404).json({ message: 'subTodo not found.' });
        }
        return res.status(200).json({ updatedSubTodo, message: 'Successfully updated subTodo. ' });
    })
        .catch(err => {
            console.error('Error updating todo:', err);
            return res.status(500).json({ message: 'Failed to update todo.' });
        })
}

exports.deleteTodo = (req, res, next) => {
    const reqTodoId = req.body.todoId
    if (!reqTodoId) {
        return res.json({ errorMsg: "Please provide the Id  to delete Todo ", fieldMissing: true, requiredField: "todoId" })
    }
    User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { todos: reqTodoId } },
        { new: true }
    ).then((updatedUser) => {
        if (updatedUser) {
            Todo.findByIdAndDelete(reqTodoId)
                .then(deletedTodo => {
                    if (deletedTodo) {
                        return res.status(200).json(deletedTodo)
                    } else {
                        return res.status(500).json("something went wrong")
                    }
                })
        }
    }).catch(err => console.log(err))
};

exports.deleteSubTodo = (req, res, next) => {
    const subTodoId = req.body.subTodoId;
    const parentTodoId = req.body.parentTodoId;
    const userId = req.userId;

    Todo.findOneAndUpdate(
        { _id: parentTodoId, user: userId },
        { $pull: { todo: subTodoId } },
        { new: true }
    )
        .then((updatedParentTodo) => {
            if (!updatedParentTodo) {
                return res.status(404).json({ message: 'Parent Todo not found or unauthorized' });
            }

            return subTodo.findByIdAndDelete(subTodoId);
        })
        .then((deletedSubTodo) => {
            if (!deletedSubTodo) {
                return res.status(404).json({ message: 'Sub-todo not found' });
            }

            return res.status(200).json({ message: 'Sub-todo deleted successfully' });
        })
        .catch(err => {
            console.log('Error deleting sub-Todo: ', err);
            return res.status(500).json({ message: 'Failed to delete sub-todo.' });
        });
};



exports.postTodo = (req, res, next) => {
    const { userId } = req;
    const { title } = req.body;
    const newTodo = new Todo({
        title: title,
        user: new mongoose.Types.ObjectId(userId), // to filter todos as per users
        todo: [],
    });
    newTodo.save()
        .then((newTodo) => {
            // Add the newTodo's ObjectId to the user's todos array
            User.findByIdAndUpdate(
                userId,
                { $push: { todos: newTodo._id } },
                { new: true }
            )
                .then(() => {
                    return res.status(200).json(newTodo);
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};


exports.postSubTodo = (req, res, next) => {
    const userId = req.userId
    const { parentId, subTodoTitle } = req.body;
    let createdSubTodo = null
    Todo.findById(parentId)
        .then((parentTodo) => {
            console.log(parentTodo)
            if (!parentTodo) {
                return res.status(404).json({ message: 'Parent todo not found.' });
            } else {
                const newSubTodo = new subTodo({
                    title: subTodoTitle,
                    user: new mongoose.Types.ObjectId(userId)
                });
                return newSubTodo.save();
            }
        }).then((savedSubTodo) => {
            if (savedSubTodo) {
                createdSubTodo = savedSubTodo;
                return Todo.findByIdAndUpdate(parentId, { $push: { todo: savedSubTodo._id } })
            }
        }).then((updatedParentTodo) => {
            if (updatedParentTodo) {
                console.log('Sub-todo added to the parent todo:', updatedParentTodo);
                return res.status(200).json({ message: 'Subtodo Created and Parent Updated', subTodo: createdSubTodo, updatedParentTodo: updatedParentTodo });
            }
        }).catch((err) => {
            console.error('Error adding sub-todo:', err);
            return res.status(500).json({ message: 'Failed to add sub-todo.' });
        });
};