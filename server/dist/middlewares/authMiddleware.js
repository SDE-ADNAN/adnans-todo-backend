"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.headers["userId"] = decoded.userId;
        next();
    }
    catch (error) {
        console.error('Error authenticating user: ', error);
        return res.status(401).json({ message: 'Invalid authentication token. ' });
    }
};
exports.default = authenticateUser;
