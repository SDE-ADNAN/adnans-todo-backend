"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const colors_1 = __importDefault(require("colors"));
const winston_2 = require("winston");
const { combine, timestamp, colorize, printf } = winston_2.format;
const levels = {
    error: 0, // red
    warn: 1, // yellow
    info: 2, // bold bgGrey
    http: 3, // green bg
    verbose: 4,
    debug: 5,
    silly: 6
};
const myFormat = (info) => {
    const { level, message, timestamp } = info;
    if (level === "error") {
        return `${colors_1.default.red.bgRed(`[ ${timestamp} ]`)} ${colors_1.default.bold.red(`[ level ${level} ]`)} : [ ${colors_1.default.red(`${message}`)}]`;
    }
    if (level === "warn") {
        return `${colors_1.default.bgYellow(`[ ${timestamp} ]`)} ${colors_1.default.bold.yellow(`[ level ${level} ]`)} : [ ${colors_1.default.yellow(`${message}`)} ]`;
    }
    if (level === "info") {
        return `${colors_1.default.bgWhite(`[ ${timestamp} ]`)} ${colors_1.default.bold.white(`[ level ${level} ]`)} : [ ${colors_1.default.white(`${message}`)} ]`;
    }
    return '';
};
const LoggerInIt = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), printf(myFormat), colorize()),
    transports: [
        new winston_1.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'warn.log', level: 'warn' }),
        new winston_1.transports.File({ filename: 'debug.log', level: 'debug' }),
        new winston_1.transports.File({ filename: 'combined.log' }),
        new winston_1.transports.Console(),
    ],
});
// return createLogger({
//   level: 'info',
//   format: combine(
//     timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
//     printf(myFormat),
//     colorize(),
//   ),
//   transports: [
//     new transports.File({ filename: 'error.log', level: 'error' }),
//     new transports.File({ filename: 'warn.log', level: 'warn' }),
//     new transports.File({ filename: 'debug.log', level: 'debug' }),
//     new transports.File({ filename: 'combined.log' }),
//     new transports.Console(),
//   ],
// });
// }
exports.default = LoggerInIt;
