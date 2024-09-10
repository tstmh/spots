"use strict";

module.exports = (function(){

    const sql = require('mssql/msnodesqlv8'),
        dbConfig = require('./dbConfig.js'),
        logger = require('./logger.js'),
        xmlgen = require('./accountDiscoveryXmlGenerator.js');

    var xw = '', usersCount = 0;

    function publicGetAccountDiscoveryCount( callback ) {
        sql.connect(dbConfig.config, err => {
            if (err) {
                logger.error('Unable to connect to database. Error : ' + err.message);
                process.exit(1);                
            } else {
                var request = new sql.Request();
        
                request.execute("spGetAccountDiscoveryCount").then(function (recordSet) {
                    usersCount = parseInt( recordSet.recordsets[0][0].usersCount );
                    callback();

                }).catch(function (err) {
					logger.error(err.message);
                });
            }
        });
    }

    function publicGetAccountDiscoveryRecords() {

        var request = new sql.Request();
        
        request.execute("spGetAccountDiscoveryRecords").then(function (recordSet) {
			xw = new xmlgen();
			xw.createXML('APP2IDMS', usersCount);
			xw.generateAccountDiscovery(recordSet.recordsets[0]);
			xw.writeXML( '.\\xml\\out\\APP_IDMS_USER').then(function(response){
				logger.info(response);
				
				setTimeout((function() {  
                    return process.exit(0);
                }), 60000);
			})
			
        }).catch(function (err) {
			logger.error(err.message);
        });

    }

    return {
        getAccountDiscoveryCount : publicGetAccountDiscoveryCount,
        getAccountDiscoveryRecords: publicGetAccountDiscoveryRecords
    }
})()