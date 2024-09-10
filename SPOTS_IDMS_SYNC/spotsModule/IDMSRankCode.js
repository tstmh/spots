"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          logger = require('./logger.js'),
          dateutil = require('./dateutil.js'),
          temptable = require('./temptable.js');		

    const TABLENAME = 'idms_rank_code', PK_FIELD = 'RankCode';

    let _xmlContents = '',
        _allNodes = '',
        _nodesCount = 0,	
        rowCount = 0;

    // private function

    function queryDB( rankCode, rankName, nameDisplay, categoryType, resolve, reject ) {

        let req = new sql.Request();

        req.input('rankCode', sql.NVarChar, rankCode);

        req.query('select RankCode, RankName, RankNameForDisplay, CategoryType, delete_flag from ' + TABLENAME + ' where ' + PK_FIELD + '=@rankCode')
            .then( function(result) {   

            if ( result.recordset.length == 0 ) {

                let req1 = new sql.Request();

                req1.input('pkValue', sql.NVarChar, rankCode);
                req1.input('rankName', sql.NVarChar, rankName);             
                req1.input('rankNameForDisplay', sql.NVarChar, nameDisplay);
                req1.input('categoryType', sql.NVarChar, categoryType);

                req1.query('insert into ' + TABLENAME + ' (' + PK_FIELD + ', RankName, RankNameForDisplay, CategoryType, created, modified, delete_flag ) values ' + 
                           ' (@pkValue, @rankName, @rankNameForDisplay, @categoryType, getdate(), getdate(), 0 )').then(function(insertResult) {
                    logger.info( 'Inserted row in table ' + TABLENAME + '. RankCode = ' + rankCode );
                    resolve();
                }).catch(function(err) {
                    // error checks
                    logger.error('Error inserting into table ' + TABLENAME + '. Error : ' + err.message);                   
                    reject();
                });             
            } else {

                let req2 = new sql.Request();
                req2.input('pkValue', sql.NVarChar, rankCode);
                req2.input('rankName', sql.NVarChar, rankName);             
                req2.input('rankNameForDisplay', sql.NVarChar, nameDisplay);
                req2.input('categoryType', sql.NVarChar, categoryType);

                req2.query('update ' + TABLENAME + ' set RankName=@rankName, RankNameForDisplay=@rankNameForDisplay, categoryType=@categoryType, ' + 
                           ' modified=getdate(), delete_flag=0 where ' + 
                           PK_FIELD + '=@pkValue').then(function(updateResult) {
                    logger.info( 'Updated row in table ' + TABLENAME + '. RankCode = ' + rankCode );
                    resolve();
                }).catch(function(err) {
                    // ... error checks
                    logger.error('Error updating table ' + TABLENAME + '. RankCode = ' + rankCode + '. Error : ' + err.message);
                    reject();
                });                     

            }

        })
            .then( function() { temptable.insertCode(TABLENAME,rankCode); } )
            .catch(function(err) {
            // ... error checks
            logger.error( 'Error reading table ' + TABLENAME + ' for RankCode ' + rankCode + '. Error : ' + err.toString());

        });
        //return result;

    }

    function processOneXMLTag(i,resolve,reject){
        rowCount++;

        let idx = 0, rankCode='', rankName='', nameDisplay='', categoryType='';

        while (_allNodes[i].child(idx)) {

            //logger.info(_allNodes[i].child(idx).name());

            switch(_allNodes[i].child(idx).name()) {

                case 'RankCode': 
                    rankCode = _allNodes[i].child(idx).text().trim(); 
                    break;
                case 'RankName':
                    rankName = _allNodes[i].child(idx).text().trim();
                    break;                                          
                case 'RankNameForDisplay':
                    nameDisplay = _allNodes[i].child(idx).text().trim();
                    break;                                                        
                case 'CategoryType':
                    categoryType = _allNodes[i].child(idx).text().trim();
                    break;                                                         
                default:
                    break;
            }
            idx++;
        }  

        queryDB( rankCode, rankName, nameDisplay, categoryType, resolve, reject );

    }

    async function publicUpdateDB(resolve,reject) {
        var arrPromises = [];

        let processedCount = 0;

        for (let i=1; i<_nodesCount; i+=2 ) {

            if (_allNodes[i].type()==='element' && _allNodes[i].name()==='Rank') {

                var promise = new Promise( resolve => {
                    processOneXMLTag(i,resolve,reject);
                });

                arrPromises.push(promise);
            }
        }              

        await Promise.all( arrPromises );

        temptable.deleteUnusedCode(TABLENAME, resolve);


    }  

    function publicSetXMLNodes(allNodes) {
        _allNodes = allNodes;
        _nodesCount = allNodes.length;  
        logger.info("SetXMLNodes is finished");
    }

    return {
        updateDB: publicUpdateDB,
        setXMLNodes: publicSetXMLNodes,
    }
})();