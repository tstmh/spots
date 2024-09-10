"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          libxml = require('libxmljs'),
          logger = require('./logger.js'),
          dateutil = require('./dateutil.js'),
          xmlack = require('./xmlGenerator.js'),
          temptable = require('./temptable.js');

    const TABLENAME = 'tims_location_code', PK_FIELD = 'code';

    var _xmlContents = '',
        _allNodes = '',
        _nodesCount = 0,
        rowCount = 0,
        xw = '';

    // private function


    function queryDB( code, desc, codeType, speedLimit, silverZone, dateCreated, dateModified, dateEffective, resolve, reject ) {

        var req = new sql.Request();

        //var result = false;

        req.input('code', sql.VarChar(5), code);

        req.query('select description, code_type, speed_limit, silver_zone, delete_flag from ' + TABLENAME + ' where ' + PK_FIELD + '=@code')
            .then( function(result) {   

            if ( result.recordset.length == 0 ) {

                var req1 = new sql.Request();

                req1.input('pkValue', sql.NVarChar, code);
                req1.input('desc', sql.NVarChar, desc);             
                req1.input('codeType', sql.Char, codeType);
                if (speedLimit!='')
                    req1.input('speedLimit', sql.Decimal, Number(speedLimit));
                else
                    req1.input('speedLimit', sql.NVarChar, null);   

                req1.input('dateCreated', sql.NVarChar, dateCreated);
                req1.input('dateModified', sql.NVarChar, dateModified);
                req1.input('silverZone', sql.Bit, silverZone==='Y');             
                req1.input('dateEffective', sql.NVarChar, dateEffective);

                req1.query('insert into ' + TABLENAME + ' (' + PK_FIELD + ', description, code_type, speed_limit, created, modified, silver_zone, effective_date, delete_flag ) values ' + 
                           ' (@pkValue, @desc, @codeType, @speedLimit, getdate(), getdate(), @silverZone, @dateEffective, 0) ').then(function(insertResult) {

                    logger.info( 'Inserted Location Code ' + code );

                    temptable.insertCode(TABLENAME,code);   

                    resolve();

                    //result = true;
                }).catch(function(err) {
                    // error checks
                    logger.error('Error inserting into table ' + TABLENAME + '. Error : ' + err.message);
                    reject();
                });             
            } else {


                if (result.recordset[0].description != desc ||
                    result.recordset[0].code_type != codeType ||
                    (result.recordset[0].speed_limit?result.recordset[0].speed_limit:'') != (speedLimit?speedLimit:'') ||
                    (result.recordset[0].silver_zone==1) != (silverZone==='Y') ||
                    result.recordset[0].delete_flag
                   ) {

                    var req2 = new sql.Request();
                    req2.input('pkValue', sql.NVarChar, code);
                    req2.input('desc', sql.NVarChar, desc);
                    req2.input('codeType', sql.Char, codeType);
                    if (speedLimit!='')
                        req2.input('speedLimit', sql.Decimal, Number(speedLimit));
                    else
                        req2.input('speedLimit', sql.NVarChar, null);   

                    req2.input('silverZone', sql.Bit, silverZone==='Y');

                    req2.input('dateModified', sql.NVarChar, dateModified);
                    req2.input('dateEffective', sql.NVarChar, dateEffective);                       

                    req2.query('update ' + TABLENAME + ' set description=@desc, code_type=@codeType, speed_limit=@speedLimit, silver_zone=@silverZone, ' + 
                               ' modified=getdate(), effective_date=@dateEffective, delete_flag=0 where ' + 
                               PK_FIELD + '=@pkValue').then(function(updateResult) {
                        logger.info( 'Updated Location Code ' + code );
                        resolve();
                    }).catch(function(err) {
                        // ... error checks
                        logger.error('Error updating Location Code ' + code + '. Error : ' + err.message);
                        reject();
                    });                     


                } else {
                    resolve();
                }

            }

        })
            .then( function() { callbackAck(code);temptable.insertCode(TABLENAME,code); } )
            .catch(function(err) {
            // ... error checks
            logger.error( 'Error reading Location Code ' + code + '. Error : ' + err.toString());
            reject();
        }); 

    }

    function processOneXMLTag(i,resolve,reject){
        rowCount++;

        var idx = 0, code='', desc='', codeType='', speedLimit='', silverZone='',
            dateCreated = '', dateModified = '', dateEffective = '';

        while (_allNodes[i].child(idx)) {

            //logger.info(_allNodes[i].child(idx).name());

            switch(_allNodes[i].child(idx).name()) {

                case 'locationCode': 
                    code = _allNodes[i].child(idx).text().trim();
                    break;
                case 'locationDescription':
                    desc = _allNodes[i].child(idx).text().trim();
                    break;    
                case 'locationCodeType':
                    codeType = _allNodes[i].child(idx).text().trim();
                    break;  
                case 'roadSpeedLimit':
                    speedLimit = _allNodes[i].child(idx).text().trim();
                    break;  
                case 'silverZone':
                    silverZone = _allNodes[i].child(idx).text().trim();
                    break;
                case 'dateCreated':
                    dateCreated = _allNodes[i].child(idx).text().trim();
                    break;
                case 'dateEffective':
                    dateEffective = _allNodes[i].child(idx).text().trim();
                    break;
                case 'dateModified':
                    dateModified = _allNodes[i].child(idx).text().trim();
                    break;                                                                                                                                                                                                                                         
                default:
                    break;
            }
            idx++;
        }     

        queryDB( code, desc, codeType, speedLimit, silverZone, dateCreated, dateModified, dateEffective, resolve, reject);

    }

    async function publicUpdateDB(resolve,reject) {

        var arrPromises = [];

        var processedCount = 0;

        xw = new xmlack();
        xw.createXML('spotsLocationCodeAcknowledgement');

        for (var i=2; i<_nodesCount-1; i++ ) {
            if (_allNodes[i].type()==='element' && _allNodes[i].name()==='detail') {
                var promise = new Promise( resolve => {
                    processOneXMLTag(i,resolve,reject);
                });

                arrPromises.push(promise);
            }

        }              
        await Promise.all( arrPromises );

        xw.writeAckXML( 'spots_location_code', false );  

        temptable.deleteUnusedCode(TABLENAME, ( () => { resolve(); }) );

    }  

    function callbackAck(code) {
        xw.setAckCode('locationCode',code,'0','');
    }

    function publicSetXMLNodes(allNodes) {
        _allNodes = allNodes;
        _nodesCount = allNodes.length - 2;  
        logger.info("SetXMLNodes TIMSLocationCode is finished");
    }

    return {
        updateDB: publicUpdateDB,
        setXMLNodes: publicSetXMLNodes
    }
})();
