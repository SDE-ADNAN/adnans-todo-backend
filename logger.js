const winston = require("winston");
const moment = require("moment");


const consoleLogger = new winston.transport.Console({
    timestamp: function (){
        const today = moment();
        return today.format('DD-MM-YYYY h:mm:ssa')
    },
    colorize:true,
})

const logger = new winston.Logger({
    transports:[
        consoleLogger
    ]
});

logger.exitOnError = false;

module.exports.logger = logger;