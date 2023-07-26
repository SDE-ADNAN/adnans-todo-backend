const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// need to place it right to use the below protected routes and set userId in req object
router.use(authenticateUser)
router.get('/getAllTodos', adminController.getAllTodos);
router.get('/getTodo', adminController.getTodo);
router.get('/getSubTodo', adminController.getSubTodo);
router.post('/postTodo', adminController.postTodo);
router.post('/postSubTodo', adminController.postSubTodo);
router.put('/putTodo', adminController.putTodo);
router.put('/putSubTodo', adminController.putSubTodo);
router.delete('/deleteTodo', adminController.deleteTodo);
router.delete('/deleteSubTodo', adminController.deleteSubTodo);

module.exports = router;