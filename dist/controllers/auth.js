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
exports.resetPassword = exports.forgotPassword = exports.deleteUser = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const index_js_1 = __importDefault(require("../logger/index.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_Model_js_1 = __importDefault(require("../models/User-Model.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// registering user
const registerUser = (req, res, next) => {
    index_js_1.default.warn('registerUser called');
    const { userName, password, email, picUrl } = req.body;
    User_Model_js_1.default.findOne({ $or: [{ userName }, { email }] })
        .then((existingUser) => {
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        else {
            const newUser = new User_Model_js_1.default({
                userName,
                password,
                email,
                picUrl,
                todos: [] // Initialized an empty array for todos
            });
            return newUser.save()
                .then((newlyCreatedUser) => {
                if (newlyCreatedUser) {
                    return res.status(201).json({ message: 'User registered successfully.' });
                }
            })
                .catch((err) => {
                console.error('Error registering user: ', err);
                return res.status(500).json({ message: 'Failed to register user.' });
            });
        }
    });
    // .then((newlyCreatedUser) => {
    //     if (newlyCreatedUser) {
    //         return res.status(201).json({ message: 'User registered successfully.' });
    //     }
    // })
    // .catch((err) => {
    //     console.error('Error registering user: ', err);
    //     return res.status(500).json({ message: 'Failed to register user.' });
    // });
};
exports.registerUser = registerUser;
// Logging in the user and issuing jwt token
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    index_js_1.default.warn('loginUser called');
    const { userName, password } = req.body;
    const user = yield User_Model_js_1.default.findOne({ userName });
    if (!user) {
        return res.status(404).json({ message: 'User Not Found. ' });
    }
    const passwordsMatch = yield bcrypt_1.default.compare(password, user.password);
    console.log(passwordsMatch);
    if (!passwordsMatch) {
        return res.status(401).json({ message: 'Invalid Credentials. ' });
    }
    else {
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.SECRET);
        return res.status(200).json({ message: 'Login successful. ', token });
    }
});
exports.loginUser = loginUser;
// Get user Profile (requires authentication)
const getUserProfile = (req, res) => {
    index_js_1.default.warn('getUserProfile called');
    const userId = req.headers["userId"];
    User_Model_js_1.default.findById(userId)
        .populate({
        path: 'todos',
        model: 'Todo',
        populate: {
            path: 'todo',
            model: 'SubTodo' // Use the SubTodo model to populate the todo field
        }
    })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'User not Found' });
        }
        const filteredTodos = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.status === 'Todo';
        });
        const filteredInProgress = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.status === 'InProgress';
        });
        const filteredCompleted = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.status === 'Completed';
        });
        const filteredOnHold = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.status === 'OnHold';
        });
        const filteredHigh = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.priority === 'High';
        });
        const filteredMedium = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.priority === 'Medium';
        });
        const filteredLow = user.todos.filter(todo => {
            const todoItem = todo; // Type assertion
            return todoItem.priority === 'Low';
        });
        const userObj = Object.assign(Object.assign({}, user.toObject()), { statusFiltered: {
                __filteredTodos: filteredTodos,
                __filteredInProgress: filteredInProgress,
                __filteredCompleted: filteredCompleted,
                __filteredOnHold: filteredOnHold
            }, priorityFiltered: {
                __filteredHigh: filteredHigh,
                __filteredMedium: filteredMedium,
                __filteredLow: filteredLow
            } });
        return res.status(200).json({ user: userObj });
    })
        .catch((err) => {
        console.error('Error fetching user profile: ', err);
        return res.status(500).json({ message: 'Failed to fetch user Profile' });
    });
};
exports.getUserProfile = getUserProfile;
// Update user profile (requires authentication)
const updateUserProfile = (req, res) => {
    index_js_1.default.warn('updateUserProfile called');
    // The userId is obtained from the authentication middleware (decoded JWT)
    const userId = req.headers["userId"];
    const { userName, email, picUrl } = req.body;
    User_Model_js_1.default.findByIdAndUpdate(userId, { userName, email, picUrl }, { new: true })
        .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found. ' });
        }
        return res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    })
        .catch(err => {
        console.error('Error updating user profile: ', err);
        return res.status(500).json({ message: 'Failed to update user profile. ' });
    });
};
exports.updateUserProfile = updateUserProfile;
// Delete user (requires authentication)
const deleteUser = (req, res) => {
    index_js_1.default.warn('deleteUser called');
    // the userId is obtained from the authentication middleware (decoded JWT)
    const userId = req.headers["userId"];
    if (typeof userId === "string") {
        User_Model_js_1.default.findOneAndDelete({ userId })
            .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({ message: 'User deleted successfully. ' });
        })
            .catch(err => {
            console.error('Error deleting User: ', err);
            return res.status(500).json({ message: 'Failed to delete User.' });
        });
    }
    else {
        return res.status(404).json({ message: 'User not found.' });
    }
};
exports.deleteUser = deleteUser;
// Forgot Password Route
const forgotPassword = (req, res) => {
    index_js_1.default.warn('forgotPassword called');
    const { email } = req.body;
    User_Model_js_1.default.findOne({ email })
        .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found. ' });
        }
        sendOTP(email)
            .then(otp => {
            req.session.storedOtp = otp; // Store OTP in session or a more persistent storage
            return res.status(200).json({ message: 'OTP sent successfully.', storedOtp: otp });
        })
            .catch(err => {
            console.error('Error sending OTP: ', err);
            return res.status(500).json({ message: 'Failed to send OTP.' });
        });
    })
        .catch(err => {
        console.error('Error finding user: ', err);
        return res.status(500).json({ message: 'Failed to find user.' });
    });
};
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    index_js_1.default.warn('resetPassword called');
    const { email, otp, newPassword } = req.body;
    try {
        if (otp !== req.session.storedOtp) {
            return res.status(401).json({ message: 'Invalid OTP. ' });
        }
        const user = yield User_Model_js_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. ' });
        }
        user.password = newPassword;
        yield user.save();
        // Clear the stored OTP after successful password reset
        req.session.storedOtp = null;
        return res.status(200).json({ message: 'Password reset successful.' });
    }
    catch (err) {
        console.error('Error resetting password: ', err);
        return res.status(500).json({ message: 'Failed to reset password.' });
    }
});
exports.resetPassword = resetPassword;
// Generate and send OTP
const sendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    index_js_1.default.warn('sendOTP called');
    const otp = otp_generator_1.default.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    index_js_1.default.error(process.env.NODEMAILER_EMAIL);
    let config = {
        service: 'gmail',
        port: 465,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_APP_SPECIFIC_PASS,
        },
    };
    let transporter = nodemailer_1.default.createTransport(config);
    let message = {
        from: 'adnansdeofficial@gmail.com',
        to: email,
        subject: "Password recovery OTP",
        text: `Your OTP is ${otp}. Use this for resetting your password.`,
        html: `<b>Your OTP is ${otp}. Use this for resetting your password.</b>`,
    };
    yield transporter.sendMail(message);
    return otp; // Return the generated OTP
});
