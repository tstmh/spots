"use strict";

const xmlChecker = require('./spotsModule/xmlChecker.js'),
    locationCode = require('./spotsModule/TIMSLocationCode.js'),
    offenceCode = require('./spotsModule/TIMSOffenceCode.js'),
    logger = require('./spotsModule/logger.js'),
    dateutil = require('./spotsModule/dateutil.js'),     
    dbConfig = require('./spotsModule/dbConfig.js'),
    sql = require('mssql/msnodesqlv8');

function processLocationCode(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_location_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_location_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_location_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                locationCode.setXMLNodes(xmlChecker.getXMLNodes());
                locationCode.updateDB(resolve,reject);    
            }
        } else reject('spots_location_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err) {
        logger.error('Error in processLocationCode function : ' + err.message);
        resolve();    
    }
}

function processOffenceCode(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_offence_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_offence_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_offence_code_' + dateutil.getTodayYMD() + '.xml is valid.');            
                offenceCode.setXMLNodes(xmlChecker.getXMLNodes());
                offenceCode.updateDB(resolve,reject);    
            }
        } else reject('spots_offence_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err) {
        logger.error('Error in processOffenceCode function : ' + err.message);
        resolve();  
    }

}

const exitProgram = () => { sql.close(); process.exit(0)};

async function processTIMSData() {

    var promiseLocationCode = new Promise( (resolve,reject) => {
        processLocationCode(resolve,reject);
    });

    var promiseOffenceCode = new Promise( (resolve,reject) => {
        processOffenceCode(resolve,reject);
    })    

    await Promise.all([promiseLocationCode,promiseOffenceCode]);
    
    exitProgram();
}

sql.connect(dbConfig.config, err => {
    if (err) {
        logger.error('Unable to connect to database. Error : ' + err.message);
        process.exit(1);
    } else {
        processTIMSData();   
    }
});
