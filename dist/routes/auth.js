"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// for registering a new User {{ WORKING FINE }}
router.post('/register', auth_1.registerUser);
// Login user and issue JWT token {{ WORKING FINE }}
router.post('/login', auth_1.registerUser);
router.post('/resetPassword', auth_1.resetPassword);
router.post('/forgotPassword', auth_1.forgotPassword);
// need to place it right to use the below protected routes and set userId in req object
router.use(authMiddleware_1.default);
// get user profile (requires authentication) {{ WORKING FINE }}
router.get('/profile', auth_1.getUserProfile);
// update user profile (requires authentication) {{ WORKING FINE }}
router.put('/profile', auth_1.updateUserProfile);
// delete user profile (requires authentication) 
router.delete('/profile', auth_1.deleteUser);
exports.default = router;
