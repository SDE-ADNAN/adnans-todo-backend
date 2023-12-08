import  Todo from "../models/Todo-Model";
import  subTodo from "../models/SubTodo-Model";
import  colors from 'colors';
import  logger from '../logger/index';
import  User from "../models/User-Model";
import  mongoose from 'mongoose';
import { NextFunction, Request, Response } from "express";


export const getAllTodos = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('getAllTodos called')
    const userId = req.headers["userId"];
    Todo.find({ user: userId })
        .populate('todo')
        .exec()
        .then(Todos => {
            console.log(Todos);
            return res.json(Todos)
        })
        .catch(err => console.log(err));
};

// eg url : http://192.168.0.101:3033/admin/getFilteredTodos/?status=InProgress&priority=High&dueDate=2023-09-15 
export const getFilteredTodos = async (req:Request, res:Response, next:NextFunction) => {
    const userId = req.headers["userId"];
    const query = req.query;

    try {
        let filter: { user: mongoose.Types.ObjectId, status?: string, priority?: string, dueDate?: { $lte: Date } } = { user: new mongoose.Types.ObjectId(userId.toString()) };

        if (query.status) {
            filter.status = query.status as string;
        }

        if (query.priority) {
            filter.priority = query.priority as string;
        }

        if (query.dueDate) {
            filter.dueDate = { $lte: new Date(query.dueDate as string) };
        }

        const todos = await Todo.find(filter).populate('todo').exec();
        return res.status(200).json(todos);
    } catch (err) {
        console.error('Error fetching filtered todos:', err);
        return res.status(500).json({ message: 'Failed to fetch filtered todos.' });
    }
};

export const modifyTodo = async (req:Request, res:Response, next:NextFunction) => {
    const userId = req.headers["userId"];
    const { todoId, changeObj } = req.body;
    
    try {
        const todo = await Todo.findOne({ _id: todoId, user: userId });
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
        
        const parsedChangeObj = JSON.parse(changeObj);
        Object.keys(parsedChangeObj).forEach(key => {
            // Update only the fields that are allowed to be modified
            if (['status', 'priority', 'dueDate', 'tags', 'attachments', 'notes', 'recurring', 'estimatedTime', 'actualTimeSpent'].includes(key)) {
                todo[key] = parsedChangeObj[key];
            }
        });
        
        const updatedTodo = await todo.save();
        return res.status(200).json(updatedTodo);
    } catch (err) {
        console.error('Error modifying todo:', err);
        return res.status(500).json({ message: 'Failed to modify todo.' });
    }
};


export const postGetTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('postGetTodo called')
    const todoId = req.body.todoId
    Todo.findById(todoId)
        .populate('todo')
        .exec()
        .then(todo => {
            if (todo)
                return res.json(todo)
            else res.json({ message: "no todo found " })
        })
        .catch(err => {
            console.log(err)
        })
};

export const postGetSubTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('postGetSubTodo called')
    const reqTodoId = req.body.todoId
    subTodo.findById(reqTodoId)
        .then(todo => {
            return res.json(todo)
        })
        .catch(err => {
            console.log(err)
        })
};

export const putTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('putTodo called')
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

export const putSubTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('putSubTodo called')
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

export const deleteTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('deleteTodo called')
    const reqTodoId = req.body.todoId
    const userId = req.headers["userId"];
    if (!reqTodoId) {
        return res.json({ errorMsg: "Please provide the Id  to delete Todo ", fieldMissing: true, requiredField: "todoId" })
    }
    User.findOneAndUpdate(
        { _id: userId },
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

export const deleteSubTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('deleteSubTodo called')
    const subTodoId = req.body.subTodoId;
    const parentTodoId = req.body.parentTodoId;
    const userId = req.headers["userId"];

    Todo.findOneAndUpdate(
        { _id: parentTodoId, user: userId },
        { $pull: { todo: subTodoId } },
        { new: true }
    )
        .then((updatedParentTodo) => {
            if (!updatedParentTodo) {
                return res.status(404).json({ message: 'Parent Todo not found or unauthorized' });
            }

            return subTodo.findByIdAndDelete(subTodoId)
                .then((deletedSubTodo) => {
                    if (!deletedSubTodo) {
                        return res.status(404).json({ message: 'Sub-todo not found' });
                    }

                    return res.status(200).json({ message: 'Sub-todo deleted successfully' });
                });
        })
        .catch(err => {
            console.log('Error deleting sub-Todo: ', err);
            return res.status(500).json({ message: 'Failed to delete sub-todo.' });
        });
        // .catch(err => {
        //     console.log('Error deleting sub-Todo: ', err);
        //     return res.status(500).json({ message: 'Failed to delete sub-todo.' });
        // });
        //     if (!deletedSubTodo) {
        //         return res.status(404).json({ message: 'Sub-todo not found' });
        //     }

        //     return res.status(200).json({ message: 'Sub-todo deleted successfully' });
        // })
        // .catch(err => {
        //     console.log('Error deleting sub-Todo: ', err);
        //     return res.status(500).json({ message: 'Failed to delete sub-todo.' });
        // });
};



export const postTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('postTodo called')
    const userId = req.headers["userId"];
    const { title, description } = req.body;
    console.error(req.body)
    if (title && description) {
        const newTodo = new Todo({
            user: new mongoose.Types.ObjectId(userId as string), // to filter todos as per users
            todo: [],
            ...req.body
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
    } else {
        return res.status(401).json({ message: 'some field is missing', bodyYouSent: req.body })
    }

};


export const postSubTodo = (req:Request, res:Response, next:NextFunction) => {
    logger.warn('postSubTodo called')
    const userId = req.headers["userId"];
    const { parentId, subTodoTitle, subTodoDescription } = req.body;
    let createdSubTodo = null
    Todo.findById(parentId)
        .then((parentTodo) => {
            console.log(parentTodo)
            if (!parentTodo) {
                return res.status(404).json({ message: 'Parent todo not found.' });
            } else {
                const newSubTodo = new subTodo({
                    title: subTodoTitle,
                    description: subTodoDescription,
                    user: new mongoose.Types.ObjectId(userId.toString())
                });
                return newSubTodo.save().then((savedSubTodo) => {
                    if (savedSubTodo) {
                        createdSubTodo = savedSubTodo;
                        return Todo.findByIdAndUpdate(parentId, { $push: { todo: savedSubTodo._id } }).then((updatedParentTodo) => {
                            if (updatedParentTodo) {
                                console.log('Sub-todo added to the parent todo:', updatedParentTodo);
                                return res.status(200).json({ message: 'Subtodo Created and Parent Updated', subTodo: createdSubTodo, updatedParentTodo: updatedParentTodo });
                            }
                        });
                    }
                });
            }
        }).catch((err) => {
            console.error('Error adding sub-todo:', err);
            return res.status(500).json({ message: 'Failed to add sub-todo.' });
        });
        //     if (savedSubTodo) {
        //         createdSubTodo = savedSubTodo;
        //         return Todo.findByIdAndUpdate(parentId, { $push: { todo: savedSubTodo._id } })
        //     }
        // }).then((updatedParentTodo) => {
        //     if (updatedParentTodo) {
        //         console.log('Sub-todo added to the parent todo:', updatedParentTodo);
        //         return res.status(200).json({ message: 'Subtodo Created and Parent Updated', subTodo: createdSubTodo, updatedParentTodo: updatedParentTodo });
        //     }
        // }).catch((err) => {
        //     console.error('Error adding sub-todo:', err);
        //     return res.status(500).json({ message: 'Failed to add sub-todo.' });
        // });
};