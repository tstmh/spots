"use strict";

module.exports = (function(){
    const accountDiscovery = require('./spotsModule/accountDiscoveryModule.js'), 
        logger = require('./spotsModule/logger.js');

    try{
        accountDiscovery.getAccountDiscoveryCount( function() {
            accountDiscovery.getAccountDiscoveryRecords();
        });
    } catch(err) {
        logger.error(err.message);
        process.exit(1);
    }

})()