const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf } = format;
const colors = require("colors")

const levels = {
    error: 0, // red
    warn: 1,  // yellow
    info: 2,  // bold bgGrey
    http: 3,  // green bg
    verbose: 4,
    debug: 5, 
    silly: 6
  };

const myFormat = printf(({ level, message, /*label*/ timestamp }) => {
if(level === "error"){
    return `${colors.red.bgRed(`[ ${timestamp} ]`)} ${colors.bold.red(`[ level ${level} ]`)} : [ ${colors.red(`${message}`)}]`;
}
if(level === "warn"){
    return `${colors.bgYellow(`[ ${timestamp} ]`)} ${colors.bold.yellow(`[ level ${level} ]`)} : [ ${colors.yellow(`${message}`)} ]`;
}
if(level === "info"){
    return `${colors.bgWhite(`[ ${timestamp} ]`)} ${colors.bold.white(`[ level ${level} ]`)} : [ ${colors.white(`${message}`)} ]`;
}
});

const Logger=()=>{
    return createLogger({
        level: 'info',
        format: combine(
            // label({ label: 'right meow!' }),
            timestamp({format:"DD-MM-YYYY HH:mm:ss"}),
            myFormat,
            colorize(),
          ),
        // defaultMeta: { service: 'user-service' },
        transports: [
          //
          // - Write all logs with importance level of `error` or less to `error.log`
          // - Write all logs with importance level of `info` or less to `combined.log`
          //
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'warn.log', level: 'warn' }),
          new transports.File({ filename: 'debug.log', level: 'debug' }),
          new transports.File({ filename: 'combined.log' }),
        new transports.Console(),
        ],
      });
}

module.exports = Logger