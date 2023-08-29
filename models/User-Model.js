const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Todo = require("./Todo-Model");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        picUrl: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
        },
        bio: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        website: {
            type: String,
            default: '',
        },
        social: {
            twitter: String,
            facebook: String,
            instagram: String,
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo',
            },
        ],
    },
    { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const saltRounds = 10;
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
