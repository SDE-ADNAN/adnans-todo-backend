import logger from '../logger/index.js';
import bcrypt from 'bcrypt';
import User from '../models/User-Model.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import TodoItem from '../Types/TodoTypesInterfaces.js';

// registering user
export const registerUser = (req: Request, res: Response, next: NextFunction) => {
    logger.warn('registerUser called');
    const { userName, password, email, picUrl } = req.body;

    User.findOne({ $or: [{ userName }, { email }] })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already exists.' });
            } else {
                const newUser = new User({
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
        })
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

// Logging in the user and issuing jwt token
export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    logger.warn('loginUser called')
    const { userName, password } = req.body;

    const user = await User.findOne({ userName })
    if (!user) {
        return res.status(404).json({ message: 'User Not Found. ' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    console.log(passwordsMatch)

    if (!passwordsMatch) {
        return res.status(401).json({ message: 'Invalid Credentials. ' });
    } else {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET);
        return res.status(200).json({ message: 'Login successful. ', token });
    }
};

// Get user Profile (requires authentication)
export const getUserProfile = (req:Request, res:Response,) => {
    logger.warn('getUserProfile called')
    const userId  = req.headers["userId"];

    User.findById(userId)
        .populate({
            path: 'todos',
            model: 'Todo', // Populate the todos field with actual Todo objects
            populate: {
                path: 'todo', // Populate the todo field inside each Todo object (subTodos)
                model: 'SubTodo' // Use the SubTodo model to populate the todo field
            }
        })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not Found' });
            }

            const filteredTodos = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.status === 'Todo';
            });
            const filteredInProgress = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.status === 'InProgress';
            });
            const filteredCompleted = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.status === 'Completed';
            });
            const filteredOnHold = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.status === 'OnHold';
            });
            const filteredHigh = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.priority === 'High';
            });
            const filteredMedium = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.priority === 'Medium';
            });
            const filteredLow = user.todos.filter(todo => {
                const todoItem = todo as TodoItem; // Type assertion
                return todoItem.priority === 'Low';
            });
            const userObj = {
                ...user.toObject(),
                statusFiltered: {
                    __filteredTodos: filteredTodos,
                    __filteredInProgress: filteredInProgress,
                    __filteredCompleted: filteredCompleted,
                    __filteredOnHold: filteredOnHold
                },
                priorityFiltered: {
                    __filteredHigh: filteredHigh,
                    __filteredMedium: filteredMedium,
                    __filteredLow: filteredLow
                }
            };
            return res.status(200).json({ user: userObj });
        })
        .catch((err) => {
            console.error('Error fetching user profile: ', err);
            return res.status(500).json({ message: 'Failed to fetch user Profile' });
        });
};

// Update user profile (requires authentication)
export const updateUserProfile = (req:Request, res:Response,) => {
    logger.warn('updateUserProfile called')
    // The userId is obtained from the authentication middleware (decoded JWT)

    const userId  = req.headers["userId"];
    const { userName, email, picUrl } = req.body
    User.findByIdAndUpdate(
        userId,
        { userName, email, picUrl },
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found. ' })
            }

            return res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
        })
        .catch(err => {
            console.error('Error updating user profile: ', err);
            return res.status(500).json({ message: 'Failed to update user profile. ' })
        })
}


// Delete user (requires authentication)
export const deleteUser = (req:Request, res:Response,) => {
    logger.warn('deleteUser called')
    // the userId is obtained from the authentication middleware (decoded JWT)
    const userId = req.headers["userId"];
    if (typeof userId === "string"){
        User.findOneAndDelete({userId})
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({ message: 'User deleted successfully. ' });
        })
        .catch(err => {
            console.error('Error deleting User: ', err);
            return res.status(500).json({ message: 'Failed to delete User.' })
        })
    }else{
        return res.status(404).json({ message: 'User not found.' });
    }
}


// Forgot Password Route
export const forgotPassword = (req:Request, res:Response,) => {
    logger.warn('forgotPassword called')
    const { email } = req.body;

    User.findOne({ email })
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

export const resetPassword = async (req:Request, res:Response,) => {
    logger.warn('resetPassword called')
    const { email, otp, newPassword } = req.body;

    try {
        if (otp !== req.session.storedOtp) {
            return res.status(401).json({ message: 'Invalid OTP. ' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. ' });
        }
        user.password = newPassword;
        await user.save();

        // Clear the stored OTP after successful password reset
        req.session.storedOtp = null;

        return res.status(200).json({ message: 'Password reset successful.' });
    } catch (err) {
        console.error('Error resetting password: ', err);
        return res.status(500).json({ message: 'Failed to reset password.' });
    }
};

// Generate and send OTP
const sendOTP = async (email) => {
    logger.warn('sendOTP called')
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    logger.error(process.env.NODEMAILER_EMAIL);

    let config = {
        service: 'gmail',
        port: 465,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_APP_SPECIFIC_PASS,
        },
    };

    let transporter = nodemailer.createTransport(config);
    let message = {
        from: 'adnansdeofficial@gmail.com',
        to: email,
        subject: "Password recovery OTP",
        text: `Your OTP is ${otp}. Use this for resetting your password.`,
        html: `<b>Your OTP is ${otp}. Use this for resetting your password.</b>`,
    };

    await transporter.sendMail(message);

    return otp; // Return the generated OTP
};

