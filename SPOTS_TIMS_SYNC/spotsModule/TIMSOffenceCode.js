"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          libxml = require('libxmljs'),
          logger = require('./logger.js'),
          dateutil = require('./dateutil.js'),
          xmlack = require('./xmlGenerator.js'),
          temptable = require('./temptable.js');

    const TABLENAME = 'tims_offence_code', PK_FIELD = 'code';

    var _xmlContents = '',
        _allNodes = '',
        _nodesCount = 0,
        rowCount = 0,
        xw = '';

    // private function
    function IsNull( str ) {
        if (str)
            return str.toString();
        else
            return '';
    }    

    function queryDB( code, dateEffective, chargeIndicator, caption, demeritPoint, fineAmount,
                       dateCreated, dateModified, schoolZone, speedingOffence, vehicleCategory, commonOffence,
                       exceedingMinimumSpeed, exceedingMaximumSpeed, offenderType, roadSpeedLimit, resolve, reject ) {

        var req = new sql.Request();       

        req.input('code', sql.NVarChar, code);

        req.query('select fine_amount, demerit_point, charge_indicator, caption, offence_type, school_zone_indicator, ' + 
                  ' speeding_offence_indicator, vehicle_category, common_offence, exceeding_minimum_speed, exceeding_maximum_speed, ' +
                  'offender_type, road_speed_limit, delete_flag from ' + TABLENAME + ' where ' + PK_FIELD + '=@code')
            .then( function(result) {   

            if ( result.recordset.length == 0 ) {

                var req1 = new sql.Request();

                req1.input('code', sql.NVarChar, code);
                req1.input('fineAmount', sql.Decimal, Number(fineAmount));             
                req1.input('demeritPoint', sql.Decimal, Number(demeritPoint));
                req1.input('chargeIndicator', sql.Char, chargeIndicator);
                req1.input('caption', sql.NVarChar, caption);
                req1.input('dateEffective', sql.NVarChar, dateEffective);
                req1.input('dateCreated', sql.NVarChar, dateCreated);
                //req1.input('dateModified', sql.NVarChar, dateModified);
                req1.input('schoolZone', sql.Char, schoolZone);   
                req1.input('speedingOffence', sql.Char, speedingOffence);            
                req1.input('vehicleCategory', sql.Char, vehicleCategory);             
                req1.input('commonOffence', sql.Bit, commonOffence==='Y'); 
                if (exceedingMinimumSpeed!='')
                    req1.input('exceedingMinimumSpeed', sql.Decimal, Number(exceedingMinimumSpeed));
                else
                    req1.input('exceedingMinimumSpeed', sql.NVarChar, null);
                if (exceedingMaximumSpeed!='')                        
                    req1.input('exceedingMaximumSpeed', sql.Decimal, Number(exceedingMaximumSpeed));
                else
                    req1.input('exceedingMaximumSpeed', sql.NVarChar, null);
                req1.input('offenderType', sql.Char, offenderType); 
                if (roadSpeedLimit!='')
                    req1.input('roadSpeedLimit', sql.Decimal, Number(roadSpeedLimit));
                else
                    req1.input('roadSpeedLimit', sql.NVarChar, null);                 
                //logger.info('inserting into ' + TABLENAME + ' table')

                req1.query("insert into " + TABLENAME + " (code, fine_amount, demerit_point, charge_indicator, " + 
                           " caption, effective_date, created, modified, school_zone_indicator, speeding_offence_indicator, " + 
                           " vehicle_category, common_offence, exceeding_minimum_speed, exceeding_maximum_speed, offender_type, road_speed_limit, delete_flag ) values " + 
                           " (@code, @fineAmount, @demeritPoint, @chargeIndicator, @caption, @dateEffective, getdate(), getdate()," +
                           " @schoolZone, @speedingOffence, @vehicleCategory, @commonOffence, @exceedingMinimumSpeed, @exceedingMaximumSpeed, @offenderType, @roadSpeedLimit, 0) ").then(function(insertResult) {

                    logger.info( 'Inserted Offence Code = ' + code );

                    resolve();
                }).catch(function(err) {
                    // error checks
                    logger.error('Error inserting Offence Code = ' + code + '. Error : ' + err.message);
                    reject();
                });             
            } else {


                if (Number(result.recordset[0].fine_amount) != Number(fineAmount) ||
                    Number(result.recordset[0].demerit_point) != Number(demeritPoint) ||
                    result.recordset[0].charge_indicator != chargeIndicator ||
                    result.recordset[0].caption.trim() != caption.trim() ||
                    result.recordset[0].school_zone_indicator != schoolZone ||
                    IsNull( result.recordset[0].speeding_offence_indicator).trim() != IsNull( speedingOffence ).trim() ||
                    IsNull( result.recordset[0].vehicle_category ).trim() != IsNull( vehicleCategory).trim() ||
                    result.recordset[0].common_offence != (commonOffence==='Y') ||
                    Number(result.recordset[0].exceeding_minimum_speed) != Number(exceedingMinimumSpeed) ||
                    Number(result.recordset[0].exceeding_maximum_speed) != Number(exceedingMaximumSpeed) ||
                    result.recordset[0].offender_type != offenderType ||
                    Number(result.recordset[0].road_speed_limit) != Number(roadSpeedLimit) ||
                    result.recordset[0].delete_flag==1
                   ) {

                    var req2 = new sql.Request();
                    req2.input('pkValue', sql.NVarChar, code);
                    req2.input('fineAmount', sql.Decimal, fineAmount);
                    req2.input('demeritPoint', sql.Decimal, demeritPoint);
                    req2.input('chargeIndicator', sql.Char, chargeIndicator);
                    req2.input('caption', sql.NVarChar, caption);    
                    req2.input('dateEffective', sql.NVarChar, dateEffective);   
                    //req2.input('modified', sql.NVarChar, dateModified);                         
                    req2.input('schoolZone', sql.Char, schoolZone);     
                    req2.input('speedingOffence', sql.Char, speedingOffence);   
                    req2.input('vehicleCategory', sql.Char, vehicleCategory);     
                    req2.input('commonOffence', sql.Bit, commonOffence==='Y');

                    if (exceedingMinimumSpeed!='')
                        req2.input('exceedingMinimumSpeed', sql.Decimal, Number(exceedingMinimumSpeed));
                    else
                        req2.input('exceedingMinimumSpeed', sql.NVarChar, null);
                    if (exceedingMaximumSpeed!='')                        
                        req2.input('exceedingMaximumSpeed', sql.Decimal, Number(exceedingMaximumSpeed));
                    else
                        req2.input('exceedingMaximumSpeed', sql.NVarChar, null);

                    req2.input('offenderType', sql.Char, offenderType);

                    if (roadSpeedLimit!='')
                        req2.input('roadSpeedLimit', sql.Decimal, Number(roadSpeedLimit));
                    else
                        req2.input('roadSpeedLimit', sql.NVarChar, null);                       

                    req2.query('update ' + TABLENAME + ' set fine_amount=@fineAmount, demerit_point=@demeritPoint, charge_indicator=@chargeIndicator, caption=@caption, ' + 
                               'effective_date=@dateEffective, modified=getdate(), school_zone_indicator=@schoolZone, speeding_offence_indicator=@speedingOffence, ' + 
                               'vehicle_category=@vehicleCategory, common_offence=@commonOffence, exceeding_minimum_speed=@exceedingMinimumSpeed, ' +
                               'exceeding_maximum_speed=@exceedingMaximumSpeed, offender_type=@offenderType, road_speed_limit=@roadSpeedLimit, delete_flag=0 where ' + 
                               PK_FIELD + '=@pkValue').then(function(updateResult) {

                        logger.info( 'Updated Offence Code = ' + code );
                        resolve();
                    }).catch(function(err) {
                        // ... error checks
                        logger.error('Error updating Offence Code = ' + code + '. Error : ' + err.message);
                        reject()
                    });    
                } else {
                    //result = false;
                    resolve();                 
                }


            }

        })
            .then( function() { callbackAck(code); temptable.insertCode(TABLENAME,code); } )
            .catch(function(err) {
            // ... error checks
            //logger.error( req.input.toString() );
            logger.error( 'Error reading Offence Code ' + code + '. Error : ' + err.toString());
            //result = false;
        });

    }

    function processOneXMLTag(i,resolve,reject){
        rowCount++;

        var idx = 0, code='', dateEffective = '', chargeIndicator = '',
            caption='', demeritPoint='', fineAmount='', dateCreated = '', dateModified = '',
            schoolZone='',speedingOffence='',vehicleCategory='',commonOffence='',
            exceedingMinimumSpeed='', exceedingMaximumSpeed='', offenderType='', roadSpeedLimit='';               

        while (_allNodes[i].child(idx)) {

            //logger.info(_allNodes[i].child(idx).name());

            switch(_allNodes[i].child(idx).name()) {

                case 'offenceCode': 
                    code = _allNodes[i].child(idx).text().trim(); 
                    break;
                case 'dateEffective':
                    dateEffective = _allNodes[i].child(idx).text().trim();
                    break;                                
                case 'chargeIndicator':
                    chargeIndicator = _allNodes[i].child(idx).text().trim();
                    break;    
                case 'offenceCaption':
                    caption = _allNodes[i].child(idx).text().trim();
                    break;  
                case 'demeritPoint':
                    demeritPoint = _allNodes[i].child(idx).text().trim();
                    break;  
                case 'fineAmount':
                    fineAmount = _allNodes[i].child(idx).text().trim();
                    break;
                case 'dateCreated':
                    dateCreated = _allNodes[i].child(idx).text().trim();
                    break;
                case 'dateModified':
                    dateModified = _allNodes[i].child(idx).text().trim();
                    break;
                case 'schoolZone':
                    schoolZone = _allNodes[i].child(idx).text().trim();
                    break;
                case 'speedingOffence':
                    speedingOffence = _allNodes[i].child(idx).text().trim();
                    break;       
                case 'vehicleCategory':
                    vehicleCategory = _allNodes[i].child(idx).text().trim();
                    break; 
                case 'commonOffenceFlag':
                    commonOffence = _allNodes[i].child(idx).text().trim();
                    break;
                case 'exceedingMinimumSpeed':
                    exceedingMinimumSpeed = _allNodes[i].child(idx).text().trim();
                    break;
                case 'exceedingMaximumSpeed':
                    exceedingMaximumSpeed = _allNodes[i].child(idx).text().trim();
                    break;
                case 'offenderType':
                    offenderType = _allNodes[i].child(idx).text().trim();
                    break;
                case 'roadSpeedLimit':
                    roadSpeedLimit = _allNodes[i].child(idx).text().trim();
                    break;                                  
                default:
                    break;
            }
            idx++;
        }     

        //logger.info('Code = ' + code );


        queryDB( code, dateEffective, chargeIndicator, caption, demeritPoint, fineAmount,
                dateCreated, dateModified, schoolZone, speedingOffence, vehicleCategory, commonOffence,
                exceedingMinimumSpeed, exceedingMaximumSpeed, offenderType, roadSpeedLimit, resolve, reject );

    }

    async function publicUpdateDB(resolve, reject) {
        var arrPromises = [];
        
        var processedCount = 0;

        xw = new xmlack();
        xw.createXML('spotsOffenceCodeAcknowledgement');

        for (var i=2; i<_nodesCount-1; i++ ) {
            if (_allNodes[i].type()==='element' && _allNodes[i].name()==='detail') {

                var promise = new Promise( resolve => {
                    processOneXMLTag(i,resolve, reject);
                });

                arrPromises.push(promise);
            }
        }    
        await Promise.all( arrPromises );

        xw.writeAckXML( 'spots_offence_code', false);  
        temptable.deleteUnusedCode(TABLENAME, resolve );

    }  

    function callbackAck(code) {
        xw.setAckCode('offenceCode',code,'0','');
    }

    function publicSetXMLNodes(allNodes) {
        _allNodes = allNodes;
        _nodesCount = allNodes.length - 2;
        logger.info("SetXMLNodes TIMSOffenceCode is finished");
    }

    return {
        updateDB: publicUpdateDB,
        setXMLNodes: publicSetXMLNodes
    }
})();