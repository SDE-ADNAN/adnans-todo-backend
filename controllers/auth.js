const logger = require('../logger/index')
const bcrypt = require('bcrypt');
const User = require('../models/User-Model');
const jwt = require('jsonwebtoken')


// registering user
exports.registerUser = (req, res, next) => {
    const { userName, password, email, picUrl } = req.body;

    // checking if the user exists
    User.findOne({ $or: [{ userName }, { email }] })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already exists. ' });
            } else {
                const newUser = new User({
                    userName: userName,
                    password: password,
                    email: email,
                    picUrl: picUrl,
                    todos: [] // Initialized an empty array for todos
                });

                return newUser.save();
            }
        })
        .then((newlyCreatedUser) => {
            if (newlyCreatedUser) {
                return res.status(201).json({ message: 'User registered successfully. ' });
            }
        })
        .catch((err) => {
            console.error('Error registering user: ', err);
            return res.status(500).json({ message: 'Failed to register user. ' });
        });
};

// Logging in the user and issuing jwt token
exports.loginUser = (req, res, next) => {
    const { userName, password } = req.body;

    User.findOne({ userName })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User Not Found. ' });
            }

            bcrypt.compare(password, user.password).then((result) => {
                if (!result) {
                    return res.status(401).json({ message: 'Invalid Credentials. ' });
                }

                const token = jwt.sign({ userId: user._id }, process.env.SECRET);
                return res.status(200).json({ message: 'Login successful. ', token });
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({ message: 'Failed to compare passwords.' });
            });
        })
        .catch((err) => {
            console.error('Error logging in user: ', err);
            return res.status(500).json({ message: 'Failed to Login user' });
        });
};

// Get user Profile (requires authentication)
exports.getUserProfile = (req, res) => {
    const { userId } = req;

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
            return res.status(200).json({ user });
        })
        .catch((err) => {
            console.error('Error fetching user profile: ', err);
            return res.status(500).json({ message: 'Failed to fetch user Profile' });
        });
};

// Update user profile (requires authentication)
exports.updateUserProfile = (req, res) => {
    // The userId is obtained from the authentication middleware (decoded JWT)

    const { userId } = req;
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
exports.deleteUser = (req, res) => {
    // the userId is obtained from the authentication middleware (decoded JWT)
    const { userId } = req;

    User.findOneAndDelete(userId)
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
}

let storedOTP = ''; // This variable will hold the OTP temporarily

// Forgot Password Route
exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    console.log(email)

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found. ' });
            }

            sendOTP(email)
                .then(otp => {
                    storedOTP = otp; // Store the generated OTP in the variable

                    return res.status(200).json({ message: 'OTP sent successfully.' });
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

// Reset Password Route
exports.resetPassword = (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (otp !== storedOTP) {
        return res.status(401).json({ message: 'Invalid OTP. ' });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found. ' });
            }

            // Update user's password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password: ', err);
                    return res.status(500).json({ message: 'Failed to reset password.' });
                }

                user.password = hashedPassword;
                user.save()
                    .then(() => {
                        // Clear the stored OTP after successful password reset
                        storedOTP = '';
                        return res.status(200).json({ message: 'Password reset successful.' });
                    })
                    .catch(err => {
                        console.error('Error saving user with new password: ', err);
                        return res.status(500).json({ message: 'Failed to reset password.' });
                    });
            });
        })
        .catch(err => {
            console.error('Error finding user: ', err);
            return res.status(500).json({ message: 'Failed to find user.' });
        });
};



const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

// Configure your nodemailer transporter
// App specific password from google 
// where is it manage acc Page > security > 2 factor verification > App passwords > add new (others)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        type: 'oauth2',
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_SPECIFIC_PASS,
    },
    authMethod: 'PLAIN',
});

const sendmail = require('sendmail')();



// Generate and send OTP
const sendOTP = async (email) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    logger.error(process.env.NODEMAILER_EMAIL,)

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('SMTP server is ready to take our messages');
        }
    });


    try {
        await transporter.sendMail(mailOptions);
        return otp;
    } catch (error) {
        console.error('Error sending OTP email: ', error);
        throw new Error('Failed to send OTP.');
    }
};

