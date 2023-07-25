const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/getAllTodos', adminController.getAllTodos);
router.get('/getTodo', adminController.getTodo);
router.get('/getSubTodo', adminController.getSubTodo);
router.post('/postTodo', adminController.postTodo);
router.post('/postSubTodo', adminController.postSubTodo);
router.put('/putTodo', adminController.putTodo);
router.delete('/deleteTodo', adminController.deleteTodo);
router.delete('/deleteSubTodo', adminController.deleteSubTodo);

module.exports = router;