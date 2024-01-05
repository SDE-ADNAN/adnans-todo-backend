"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mainModule = require.main;
const mainFilename = mainModule ? mainModule.filename : '';
const dirname = path_1.default.dirname(mainFilename);
exports.default = dirname;
// module.exports = path.dirname(require.main.filename);
