"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          libxml = require('libxmljs'),
          logger = require('./logger.js'),
          dateutil = require('./dateutil.js'),
          xmlack = require('./xmlGenerator.js'),
          temptable = require('./temptable.js');

    const TABLENAME = 'tims_vehicle_make', PK_FIELD = 'code';

    var _xmlContents = '',
        _allNodes = '',
        _nodesCount = 0,
        rowCount = 0,
        xw = '';

    // private function

    function queryDB( code, desc, resolve, reject ) {

        var req = new sql.Request();

        req.input('code', sql.VarChar(5), code);

        req.query('select code, description, delete_flag from ' + TABLENAME + ' where ' + PK_FIELD + '=@code')
            .then( function(result) {   

            if ( result.recordset.length == 0 ) {

                var req1 = new sql.Request();

                req1.input('pkValue', sql.NVarChar, code);
                req1.input('desc', sql.NVarChar, desc);             

                req1.query('insert into ' + TABLENAME + ' (' + PK_FIELD + ', description, created, modified, delete_flag ) values ' + 
                           ' (@pkValue, @desc, getdate(), getdate(),0) ').then(function(insertResult) {

                    logger.info( 'Inserted row in table ' + TABLENAME + '. Code = ' + code );

                    resolve();

                }).catch(function(err) {
                    // error checks
                    logger.error('Error inserting into table ' + TABLENAME + '. Error : ' + err.message);
                    reject();
                });             
            } else {

                if (result.recordset[0].description != desc ||
                    result.recordset[0].code != code ||
                    result.recordset[0].delete_flag
                   ) {
                    var req2 = new sql.Request();
                    req2.input('pkValue', sql.NVarChar, code);
                    req2.input('desc', sql.NVarChar, desc)
                    //req2.input('dateModified', sql.NVarChar, dateModified);

                    req2.query('update ' + TABLENAME + ' set description=@desc, code=@pkValue, ' + 
                               ' modified=getdate(), delete_flag=0  where ' + 
                               PK_FIELD + '=@pkValue').then(function(updateResult) {
                        logger.info( 'Updated row in table ' + TABLENAME + '. Code = ' + code );

                        reject();

                        //result = true;
                    }).catch(function(err) {
                        // ... error checks
                        logger.error('Error updating table ' + TABLENAME + '. Code = ' + code + '. Error : ' + err.message);
                        reject();
                    });                     
                } else {
                    resolve();
                } 
            }

        })
            .then( function() { callbackAck(code); temptable.insertCode(TABLENAME,code); } )
            .catch(function(err) {
            // ... error checks
            logger.error( 'Error reading table ' + TABLENAME + ' for Code ' + code + '. Error : ' + err.toString());
            reject();
        });

    }

    function processOneXMLTag(i,resolve,reject){
        rowCount++;

        var idx = 0, code='', desc='';

        while (_allNodes[i].child(idx)) {

            //logger.info(_allNodes[i].child(idx).name());

            switch(_allNodes[i].child(idx).name()) {

                case 'code': 
                    code = _allNodes[i].child(idx).text().trim(); 
                    break;
                case 'description':
                    desc = _allNodes[i].child(idx).text().trim();
                    break;                                                                                                                                                                                                                                       
                default:
                    break;
            }
            idx++;
        }     

        queryDB( code, desc, resolve, reject );

    }

    async function publicUpdateDB(resolve,reject) {
        var arrPromises = [];

        var processedCount = 0;

        xw = new xmlack();
        xw.createXML('spotsVehicleMakeCodeAcknowledgement');

        for (var i=2; i<_nodesCount-1; i++ ) {
            if (_allNodes[i].type()==='element' && _allNodes[i].name()==='detail') {

                var promise = new Promise( resolve => {
                    processOneXMLTag(i,resolve,reject);
                });

                arrPromises.push(promise);

            }
        }              
        await Promise.all( arrPromises );
        xw.writeAckXML( 'spots_vehicle_make_code', false );
        temptable.deleteUnusedCode(TABLENAME, resolve );
    }  

    function callbackAck(code) {
        xw.setAckCode('code',code,'0','');
    }

    function publicSetXMLNodes(allNodes) {
        _allNodes = allNodes;
        _nodesCount = allNodes.length - 2;  
        logger.info("SetXMLNodes TIMSVehicleMake is finished");
    }

    return {
        updateDB: publicUpdateDB,
        setXMLNodes: publicSetXMLNodes
    }
})();