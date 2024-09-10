"use strict";

module.exports = (function(){
    const summons = require('./spotsModule/summonsModule.js'), 
        logger = require('./spotsModule/logger.js'),    
        summonsGenerator = require('./spotsModule/summonsNumberGenerator.js');

    try{
        summons.getTIMSReportCount( function() {
            summons.querySummons();
        });
    } catch(err) {
        logger.error(err.message);
        process.exit(1);
    }

})()