import  path from 'path';

import  express from 'express';

import  {getAllTodos,postGetTodo,postGetSubTodo,postTodo,postSubTodo,getFilteredTodos,putTodo,putSubTodo,deleteTodo,deleteSubTodo} from '../controllers/todo-controllers';
import  authenticateUser from '../middlewares/authMiddleware';

const router = express.Router();

// need to place it right to use the below protected routes and set userId in req object
router.use(authenticateUser)
router.get('/getAllTodos', getAllTodos);
router.post('/postGetTodo', postGetTodo);
router.post('/postGetSubTodo', postGetSubTodo);
router.post('/postTodo', postTodo);
router.post('/postSubTodo', postSubTodo);
router.post('/getFilteredTodos', getFilteredTodos);
router.put('/putTodo', putTodo);
router.put('/putSubTodo', putSubTodo);
router.delete('/deleteTodo', deleteTodo);
router.delete('/deleteSubTodo', deleteSubTodo);

export default router;