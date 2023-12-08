"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSubTodo = exports.postTodo = exports.deleteSubTodo = exports.deleteTodo = exports.putSubTodo = exports.putTodo = exports.postGetSubTodo = exports.postGetTodo = exports.modifyTodo = exports.getFilteredTodos = exports.getAllTodos = void 0;
const Todo_Model_1 = __importDefault(require("../models/Todo-Model"));
const SubTodo_Model_1 = __importDefault(require("../models/SubTodo-Model"));
// import  logger from '../logger/index';
const User_Model_1 = __importDefault(require("../models/User-Model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllTodos = (req, res, next) => {
    console.log('getAllTodos called');
    const userId = req.headers["userId"];
    Todo_Model_1.default.find({ user: userId })
        .populate('todo')
        .exec()
        .then(Todos => {
        console.log(Todos);
        return res.json(Todos);
    })
        .catch(err => console.log(err));
};
exports.getAllTodos = getAllTodos;
// eg url : http://192.168.0.101:3033/admin/getFilteredTodos/?status=InProgress&priority=High&dueDate=2023-09-15 
const getFilteredTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const query = req.query;
    try {
        if (userId) {
            let filter = { user: new mongoose_1.default.Types.ObjectId(userId.toString()) };
            if (query.status) {
                filter.status = query.status;
            }
            if (query.priority) {
                filter.priority = query.priority;
            }
            if (query.dueDate) {
                filter.dueDate = { $lte: new Date(query.dueDate) };
            }
            const todos = yield Todo_Model_1.default.find(filter).populate('todo').exec();
            return res.status(200).json(todos);
        }
    }
    catch (err) {
        console.error('Error fetching filtered todos:', err);
        return res.status(500).json({ message: 'Failed to fetch filtered todos.' });
    }
});
exports.getFilteredTodos = getFilteredTodos;
const modifyTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const { todoId, changeObj } = req.body;
    try {
        const todo = yield Todo_Model_1.default.findOne({ _id: todoId, user: userId });
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
        const updatedTodo = yield todo.save();
        return res.status(200).json(updatedTodo);
    }
    catch (err) {
        console.error('Error modifying todo:', err);
        return res.status(500).json({ message: 'Failed to modify todo.' });
    }
});
exports.modifyTodo = modifyTodo;
const postGetTodo = (req, res, next) => {
    console.log('postGetTodo called');
    const todoId = req.body.todoId;
    Todo_Model_1.default.findById(todoId)
        .populate('todo')
        .exec()
        .then(todo => {
        if (todo)
            return res.json(todo);
        else
            res.json({ message: "no todo found " });
    })
        .catch(err => {
        console.log(err);
    });
};
exports.postGetTodo = postGetTodo;
const postGetSubTodo = (req, res, next) => {
    console.log('postGetSubTodo called');
    const reqTodoId = req.body.todoId;
    SubTodo_Model_1.default.findById(reqTodoId)
        .then(todo => {
        return res.json(todo);
    })
        .catch(err => {
        console.log(err);
    });
};
exports.postGetSubTodo = postGetSubTodo;
const putTodo = (req, res, next) => {
    console.log('putTodo called');
    const { todoId, changeObj } = req.body;
    let parsedChangeObj = null;
    try {
        parsedChangeObj = JSON.parse(changeObj);
    }
    catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'changeObj Json is invalid pls stringify it before sending in formData. ' });
        }
    }
    Todo_Model_1.default.findByIdAndUpdate(todoId, { $set: parsedChangeObj }, { new: true } // Return the updated document after the update
    ).then(updatedTodo => {
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
        return res.status(200).json(updatedTodo);
    })
        .catch(err => {
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Failed to update todo.' });
    });
};
exports.putTodo = putTodo;
const putSubTodo = (req, res, next) => {
    console.log('putSubTodo called');
    const { todoId, changeObj } = req.body;
    const parsedChangeObj = JSON.parse(changeObj);
    SubTodo_Model_1.default.findByIdAndUpdate(todoId, { $set: parsedChangeObj }, { new: true } // Return the updated document after the update
    ).then(updatedSubTodo => {
        if (!updatedSubTodo) {
            return res.status(404).json({ message: 'subTodo not found.' });
        }
        return res.status(200).json({ updatedSubTodo, message: 'Successfully updated subTodo. ' });
    })
        .catch(err => {
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Failed to update todo.' });
    });
};
exports.putSubTodo = putSubTodo;
const deleteTodo = (req, res, next) => {
    console.log('deleteTodo called');
    const reqTodoId = req.body.todoId;
    const userId = req.headers["userId"];
    if (!reqTodoId) {
        return res.json({ errorMsg: "Please provide the Id  to delete Todo ", fieldMissing: true, requiredField: "todoId" });
    }
    User_Model_1.default.findOneAndUpdate({ _id: userId }, { $pull: { todos: reqTodoId } }, { new: true }).then((updatedUser) => {
        if (updatedUser) {
            Todo_Model_1.default.findByIdAndDelete(reqTodoId)
                .then(deletedTodo => {
                if (deletedTodo) {
                    return res.status(200).json(deletedTodo);
                }
                else {
                    return res.status(500).json("something went wrong");
                }
            });
        }
    }).catch(err => console.log(err));
};
exports.deleteTodo = deleteTodo;
const deleteSubTodo = (req, res, next) => {
    console.log('deleteSubTodo called');
    const subTodoId = req.body.subTodoId;
    const parentTodoId = req.body.parentTodoId;
    const userId = req.headers["userId"];
    Todo_Model_1.default.findOneAndUpdate({ _id: parentTodoId, user: userId }, { $pull: { todo: subTodoId } }, { new: true })
        .then((updatedParentTodo) => {
        if (!updatedParentTodo) {
            return res.status(404).json({ message: 'Parent Todo not found or unauthorized' });
        }
        return SubTodo_Model_1.default.findByIdAndDelete(subTodoId)
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
exports.deleteSubTodo = deleteSubTodo;
const postTodo = (req, res, next) => {
    console.log('postTodo called');
    const userId = req.headers["userId"];
    const { title, description } = req.body;
    console.error(req.body);
    if (title && description) {
        const newTodo = new Todo_Model_1.default(Object.assign({ user: new mongoose_1.default.Types.ObjectId(userId), todo: [] }, req.body));
        newTodo.save()
            .then((newTodo) => {
            // Add the newTodo's ObjectId to the user's todos array
            User_Model_1.default.findByIdAndUpdate(userId, { $push: { todos: newTodo._id } }, { new: true })
                .then(() => {
                return res.status(200).json(newTodo);
            })
                .catch((err) => console.log(err));
        })
            .catch((err) => console.log(err));
    }
    else {
        return res.status(401).json({ message: 'some field is missing', bodyYouSent: req.body });
    }
};
exports.postTodo = postTodo;
const postSubTodo = (req, res, next) => {
    console.log('postSubTodo called');
    const userId = req.headers["userId"];
    const { parentId, subTodoTitle, subTodoDescription } = req.body;
    let createdSubTodo;
    Todo_Model_1.default.findById(parentId)
        .then((parentTodo) => {
        console.log(parentTodo);
        if (!parentTodo) {
            return res.status(404).json({ message: 'Parent todo not found.' });
        }
        else if (userId) {
            const newSubTodo = new SubTodo_Model_1.default({
                title: subTodoTitle,
                description: subTodoDescription,
                user: new mongoose_1.default.Types.ObjectId(userId.toString())
            });
            return newSubTodo.save().then((savedSubTodo) => {
                if (savedSubTodo) {
                    createdSubTodo = savedSubTodo.toObject();
                    return Todo_Model_1.default.findByIdAndUpdate(parentId, { $push: { todo: savedSubTodo._id } }).then((updatedParentTodo) => {
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
exports.postSubTodo = postSubTodo;
