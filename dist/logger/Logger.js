"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const colors_1 = __importDefault(require("colors"));
const { combine, timestamp, colorize, printf } = winston_1.format;
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};
const myFormat = printf(({ level, message, /*label*/ timestamp }) => {
    if (level === "error") {
        return `${colors_1.default.red.bgRed(`[ ${timestamp} ]`)} ${colors_1.default.bold.red(`[ level ${level} ]`)} : [ ${colors_1.default.red(`${message}`)}]`;
    }
    if (level === "warn") {
        return `${colors_1.default.bgYellow(`[ ${timestamp} ]`)} ${colors_1.default.bold.yellow(`[ level ${level} ]`)} : [ ${colors_1.default.yellow(`${message}`)} ]`;
    }
    if (level === "info") {
        return `${colors_1.default.bgWhite(`[ ${timestamp} ]`)} ${colors_1.default.bold.white(`[ level ${level} ]`)} : [ ${colors_1.default.white(`${message}`)} ]`;
    }
});
const Logger = () => {
    //   var getLabel = function (callingModule) {
    //     var parts = callingModule.filename.split('/');
    //     return parts[parts.length - 2] + '/' + parts.pop();
    // };
    return (0, winston_1.createLogger)({
        level: 'info',
        format: combine(
        // label(getLabel),
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), myFormat, colorize()),
        // defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new winston_1.transports.File({ filename: 'error.log', level: 'error' }),
            new winston_1.transports.File({ filename: 'warn.log', level: 'warn' }),
            new winston_1.transports.File({ filename: 'debug.log', level: 'debug' }),
            new winston_1.transports.File({ filename: 'combined.log' }),
            new winston_1.transports.Console(),
        ],
    });
};
exports.default = Logger;
