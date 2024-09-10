"use strict";


module.exports = (function(){

    const sql = require('mssql/msnodesqlv8'),
        dbConfig = require('./dbConfig.js'),
        logger = require('./logger.js'),
        xmlgen = require('./xmlGenerator.js');

    var xw = '', summonsCount = 0;

    function privateGetTIMSReportCount( callback ) {
        sql.connect(dbConfig.config, err => {
            if (err) {
                logger.error('Unable to connect to database. Error : ' + err.message);
                process.exit(1);                
            } else {
                var request = new sql.Request();
        
                request.execute("spGetTIMSReportCount").then(function (recordSet) {
                    summonsCount = parseInt( recordSet.recordsets[0][0].reportCount );
                    callback();
                    //sql.close();
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });

    }

    function privateQuerySummons() {

        var request = new sql.Request();
        
        request.execute("spGetSummonsRecords").then(function (recordSet) {

            xw = new xmlgen();
            xw.createXML('spotsCase');
            xw.generateSummons(recordSet.recordsets[0], summonsCount, sql );
            xw.writeXML( '.\\xml\\out\\spots_case', false );

            if (recordSet.recordset.length>0) {

                setTimeout((function() {  
                    return process.exit(0);
                }), 180000);

            } else {
                logger.info('There is no summons case processed.');

                setTimeout((function() {  
                    return process.exit(0);
                }), 60000);
            }
            
            //sql.close();
        }).catch(function (err) {
            console.log(err);

        });

    }

    return {
        getTIMSReportCount : privateGetTIMSReportCount,
        querySummons: privateQuerySummons
    }
})()