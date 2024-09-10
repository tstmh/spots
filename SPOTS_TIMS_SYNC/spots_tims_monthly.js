"use strict";

const xmlChecker = require('./spotsModule/xmlChecker.js'),
      countryCode = require('./spotsModule/TIMSCountryCode.js'),
      nationalityCode = require('./spotsModule/TIMSNationalityCode.js'),
      vehicleMake = require('./spotsModule/TIMSVehicleMake.js'),    
      vehicleType = require('./spotsModule/TIMSVehicleType.js'),    
      vehicleColour = require('./spotsModule/TIMSVehicleColourCode.js'),    
      logger = require('./spotsModule/logger.js'),
      dateutil = require('./spotsModule/dateutil.js'),       
      dbConfig = require('./spotsModule/dbConfig.js'),
      sql = require('mssql/msnodesqlv8');

function writeCountryAck() {
    logger.info('finished Country Code import');
    countryCode.writeAck();
}

function processCountryCode(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_country_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_country_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_country_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                countryCode.setXMLNodes(xmlChecker.getXMLNodes());
                countryCode.updateDB(resolve, reject);
            }
        } else reject('spots_country_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err){
        logger.error('Error in processCountryCode function : ' + err.message);
        resolve();      
    }
}

function processNationalityCode(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_nationality_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_nationality_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_nationality_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                nationalityCode.setXMLNodes(xmlChecker.getXMLNodes());
                nationalityCode.updateDB(resolve, reject);    
            }
        } else reject('spots_nationality_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err){
        logger.error('Error in processNationalityCode function : ' + err.message);
        resolve();    
    }
}

function processVehicleMake(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_vehicle_make_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_vehicle_make_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_vehicle_make_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                vehicleMake.setXMLNodes(xmlChecker.getXMLNodes());
                vehicleMake.updateDB(resolve, reject);    
            }
        } else reject('spots_vehicle_make_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err){
        logger.error('Error in processVehicleMake function : ' + err.message);
        resolve();    
    }
}

function processVehicleType(resolve,reject) {
    try{
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_vehicle_type_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_vehicle_type_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_vehicle_type_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                vehicleType.setXMLNodes(xmlChecker.getXMLNodes());
                vehicleType.updateDB(resolve, reject);    
            }
        } else reject('spots_vehicle_type_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err){
        logger.error('Error in processVehicleType function : ' + err.message);
        resolve();    
    }
}

function processVehicleColourCode(resolve,reject) {
    try{
        if ( xmlChecker.checkXML(__dirname + '/xml/in/spots_vehicle_colour_code_' + dateutil.getTodayYMD() + '.xml', __dirname + '/xsd/spots_vehicle_colour_code.xsd') ) {
            if (xmlChecker.isTotalNumberCorrect()) {
                logger.info('spots_vehicle_colour_code_' + dateutil.getTodayYMD() + '.xml is valid.');
                vehicleColour.setXMLNodes(xmlChecker.getXMLNodes());
                vehicleColour.updateDB(resolve, reject);    
            }
        } else reject('spots_vehicle_colour_code_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err){
        logger.error('Error in processVehicleColourCode function : ' + err.message);
        resolve();    
    }
}

const exitProgram = () => { sql.close(); process.exit(0)};

async function processTIMSData() {

    var promiseCountryCode = new Promise( (resolve,reject) => {
        processCountryCode(resolve,reject);
    });

    var promiseNationalityCode = new Promise( (resolve,reject) => {
        processNationalityCode(resolve,reject);
    })    

    var promiseVehicleMake = new Promise( (resolve,reject) => {
        processVehicleMake(resolve,reject);
    });
    
    var promiseVehicleType = new Promise( (resolve,reject) => {
        processVehicleType(resolve,reject);
    });    

    var promiseVehicleColourCode = new Promise( (resolve,reject) => {
        processVehicleColourCode(resolve,reject);
    }); 

    await Promise.all([promiseCountryCode,promiseNationalityCode,promiseVehicleMake,promiseVehicleType,promiseVehicleColourCode]);
    
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
