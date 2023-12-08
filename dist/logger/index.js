"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_js_1 = __importDefault(require("./Logger.js"));
let logger = null;
logger = (0, Logger_js_1.default)();
exports.default = logger;
