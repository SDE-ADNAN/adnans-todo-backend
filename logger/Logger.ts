import {Logger, createLogger, format, transports } from 'winston';
import colors from "colors"
import { TransformableInfo } from 'logform';
import { format as winstonFormat } from 'winston';

const { combine, timestamp, colorize, printf } = winstonFormat;

const levels = {
  error: 0, // red
  warn: 1,  // yellow
  info: 2,  // bold bgGrey
  http: 3,  // green bg
  verbose: 4,
  debug: 5,
  silly: 6
};

const myFormat = (info: TransformableInfo) => {
  const { level, message, timestamp } = info;
  if (level === "error") {
    return `${colors.red.bgRed(`[ ${timestamp} ]`)} ${colors.bold.red(`[ level ${level} ]`)} : [ ${colors.red(`${message}`)}]`;
  }
  if (level === "warn") {
    return `${colors.bgYellow(`[ ${timestamp} ]`)} ${colors.bold.yellow(`[ level ${level} ]`)} : [ ${colors.yellow(`${message}`)} ]`;
  }
  if (level === "info") {
    return `${colors.bgWhite(`[ ${timestamp} ]`)} ${colors.bold.white(`[ level ${level} ]`)} : [ ${colors.white(`${message}`)} ]`;
  }
  return '';
};

const LoggerInIt: Logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    printf(myFormat),
    colorize(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'warn.log', level: 'warn' }),
    new transports.File({ filename: 'debug.log', level: 'debug' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console(),
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
export default LoggerInIt;