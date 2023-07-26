const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Todo = require("./todo")

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
            default: 'https://drive.google.com/file/d/17bH1aypjFtzvXEJuNKAkNV-ADIwvGthD/view?usp=sharing'
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo',
            }
        ]
    },
    { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
