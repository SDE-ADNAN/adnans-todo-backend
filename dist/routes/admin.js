"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_controllers_1 = require("../controllers/todo-controllers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// need to place it right to use the below protected routes and set userId in req object
router.use(authMiddleware_1.default);
router.get('/getAllTodos', todo_controllers_1.getAllTodos);
router.post('/postGetTodo', todo_controllers_1.postGetTodo);
router.post('/postGetSubTodo', todo_controllers_1.postGetSubTodo);
router.post('/postTodo', todo_controllers_1.postTodo);
router.post('/postSubTodo', todo_controllers_1.postSubTodo);
router.post('/getFilteredTodos', todo_controllers_1.getFilteredTodos);
router.put('/putTodo', todo_controllers_1.putTodo);
router.put('/putSubTodo', todo_controllers_1.putSubTodo);
router.delete('/deleteTodo', todo_controllers_1.deleteTodo);
router.delete('/deleteSubTodo', todo_controllers_1.deleteSubTodo);
exports.default = router;
