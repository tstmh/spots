"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          logger = require('./logger.js'),
          dateutil = require('./dateutil.js'),
          temptable = require('./temptable.js');		

    const TABLENAME = 'idms_org_struc_code', PK_FIELD = 'OrganisationCode';

    let _xmlContents = '',
        _allNodes = '',
        _nodesCount = 0,
        rowCount = 0;

    // private function

    function queryDB( orgCode, orgCodeLevel, orgName, orgShortName, adCode, resolve, reject ) {

        var req = new sql.Request();

        req.input('orgCode', sql.NVarChar, orgCode);

        req.query('select OrganisationCode, OrganisationCodeLevel, OrganisationName, OrganisationShortName, ActiveDirectoryCode, delete_flag from ' + TABLENAME + ' where ' + PK_FIELD + '=@orgCode')
            .then( function(result) {   

            if ( result.recordset.length == 0 ) {

                let req1 = new sql.Request();

                req1.input('pkValue', sql.NVarChar, orgCode);
                req1.input('orgCodeLevel', sql.NVarChar, orgCodeLevel);             
                req1.input('orgName', sql.NVarChar, orgName);
                req1.input('orgShort', sql.NVarChar, orgShortName);
                req1.input('adCode', sql.NVarChar, adCode);

                req1.query('insert into ' + TABLENAME + ' (' + PK_FIELD + ', OrganisationCodeLevel, OrganisationName, OrganisationShortName, ActiveDirectoryCode, created, modified, delete_flag ) values ' + 
                           ' (@pkValue, @orgCodeLevel, @orgName, @orgShort, @adCode, getdate(), getdate(), 0 )').then(function(insertResult) {

                    logger.info( 'Inserted row in table ' + TABLENAME + '. OrgCode = ' + orgCode );
                    resolve();
                }).catch(function(err) {
                    // error checks
                    logger.error('Error inserting into table ' + TABLENAME + '. Error : ' + err.message);
                    reject();
                });             
            } else {


                let req2 = new sql.Request();
                req2.input('pkValue', sql.NVarChar, orgCode);
                req2.input('orgCodeLevel', sql.NVarChar, orgCodeLevel);             
                req2.input('orgName', sql.NVarChar, orgName);
                req2.input('orgShort', sql.NVarChar, orgShortName);
                req2.input('adCode', sql.NVarChar, adCode);

                req2.query('update ' + TABLENAME + ' set OrganisationCodeLevel=@orgCodeLevel, OrganisationName=@orgName, OrganisationShortName=@orgShort, ' + 
                           'ActiveDirectoryCode=@adCode, modified=getdate(), delete_flag=0 where ' + 
                           PK_FIELD + '=@pkValue').then(function(updateResult) {
                    logger.info( 'Updated row in table ' + TABLENAME + '. OrgCode = ' + orgCode );
                    resolve();

                }).catch(function(err) {
                    // ... error checks
                    logger.error('Error updating table ' + TABLENAME + '. OrgCode = ' + orgCode + '. Error : ' + err.message);
                    //result = false;
                    reject()
                });                     

            }

        })
            .then( function() { temptable.insertCode(TABLENAME,orgCode); } )
            .catch(function(err) {
            // ... error checks
            logger.error( 'Error reading table ' + TABLENAME + ' for OrgCode ' + orgCode + '. Error : ' + err.toString());
            //result = false;
            reject();
        });
        //return result;


    }

    function processOneXMLTag(i,resolve,reject){
        rowCount++;

        let idx = 0, orgCode='', orgCodeLevel='', orgName='', orgShortName='',adCode='';

        while (_allNodes[i].child(idx)) {

            //logger.info(_allNodes[i].child(idx).name());

            switch(_allNodes[i].child(idx).name()) {

                case 'OrganisationCode': 
                    orgCode = _allNodes[i].child(idx).text().trim(); 
                    break;
                case 'OrganisationCodeLevel':
                    orgCodeLevel = _allNodes[i].child(idx).text().trim();
                    break;                                                       
                case 'OrganisationName':
                    orgName = _allNodes[i].child(idx).text().trim();
                    break;                                                         
                case 'OrganisationShortName':
                    orgShortName = _allNodes[i].child(idx).text().trim();
                    break;                                                            
                case 'ActiveDirectoryCode':
                    adCode = _allNodes[i].child(idx).text().trim();
                    break; 
                default:
                    break;
            }
            idx++;
        }  

        queryDB( orgCode, orgCodeLevel, orgName, orgShortName, adCode, resolve, reject );

    }

    async function publicUpdateDB(resolve,reject) {
        var arrPromises = [];

        let processedCount = 0;

        for (let i=1; i<_nodesCount; i+=2 ) {					

            if (_allNodes[i].type()==='element' && _allNodes[i].name()==='OrganisationDetails') {

                var promise = new Promise( resolve => {
                    processOneXMLTag(i,resolve,reject);
                });

                arrPromises.push(promise);
            }
        }              

        await Promise.all( arrPromises );

        temptable.deleteUnusedCode(TABLENAME, ( () => { process.exit(0) }) );

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