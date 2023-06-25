const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/getAllTodos', adminController.getAllTodos);
router.get('/getTodo', adminController.getTodo);
router.post('/postTodo', adminController.postTodo);
router.put('/putTodo', adminController.putTodo);
router.delete('/deleteTodo', adminController.deleteTodo);

module.exports = router;