const path = require('path');
const express = require('express');

const authController = require('../controllers/auth');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// for registering a new User {{ WORKING FINE }}
router.post('/register', authController.registerUser);

// Login user and issue JWT token {{ WORKING FINE }}
router.post('/login',authController.loginUser);

// need to place it right to use the below protected routes and set userId in req object
router.use(authenticateUser)

// get user profile (requires authentication) {{ WORKING FINE }}
router.get('/profile',authController.getUserProfile);

// update user profile (requires authentication) {{ WORKING FINE }}
router.put('/profile',authController.updateUserProfile)

// delete user profile (requires authentication) 
router.delete('/profile',authController.deleteUser)

module.exports = router;