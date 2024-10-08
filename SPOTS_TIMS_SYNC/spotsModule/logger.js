"use strict";

module.exports = (function(){
    const fs = require('fs'),
        winston = require('winston');

    const env = process.env.NODE_ENV || 'development';
    const logDir = 'log';

    // Create the log directory if it does not exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const tsFormat = () => (new Date()).toLocaleTimeString();

    const logger = new (winston.Logger)({
        transports: [
            // colorize the output to the console
            new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
            }),
            new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
            })
        ]
        });

    return {
        info: logger.info,
        error: logger.error
    }    

})()        