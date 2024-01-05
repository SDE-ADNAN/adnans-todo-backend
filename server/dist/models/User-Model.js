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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Define the schema for the user
const userSchema = new mongoose_1.default.Schema({
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
        default: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Todo',
        },
    ],
}, { timestamps: true });
// Hash password before saving to the database
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.isModified('password'))
                return next();
            const saltRounds = 10;
            const hash = yield bcrypt_1.default.hash(this.password, saltRounds);
            this.password = hash;
            next();
        }
        catch (error) {
            const errorF = error;
            next(errorF);
        }
    });
});
// Define the User model based on the schema
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
