"use strict";

const xmlChecker = require('./spotsModule/xmlChecker.js'),
      rankCode = require('./spotsModule/IDMSRankCode.js'),
      orgStructure  = require('./spotsModule/IDMSOrgStructureLevels.js'),
      logger = require('./spotsModule/logger.js'),
      dateutil = require('./spotsModule/dateutil.js'),     
      dbConfig = require('./spotsModule/dbConfig.js'),
      sql = require('mssql/msnodesqlv8'),
      temptable = require('./spotsModule/temptable.js');		

function processRankCode(resolve,reject) {
    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/IDMS_HR_RANKCODES_' + dateutil.getTodayYM() + '.xml', __dirname + '/xsd/idms_hr_rank_code.xsd') ) {
            logger.info('IDMS_HR_RANKCODES_' + dateutil.getTodayYM() + '.xml is valid.');
            rankCode.setXMLNodes(xmlChecker.getXMLNodes())
            rankCode.updateDB(resolve,reject);
        } else reject('IDMS_HR_RANKCODES_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err) { 
        console.log(err.message);
        resolve();
    }
}

function processOrgStructure(resolve,reject) {

    try {
        if ( xmlChecker.checkXML(__dirname + '/xml/in/IDMS_HR_ORGSTRUCTURE_LEVELS_' + dateutil.getTodayYM() + '.xml', __dirname + '/xsd/IDMS_HR_ORGSTRUCTURE_LEVELS.xsd') ) {
            logger.info('IDMS_HR_ORGSTRUCTURE_LEVELS_' + dateutil.getTodayYM() + '.xml is valid.');
            orgStructure.setXMLNodes(xmlChecker.getXMLNodes());
            orgStructure.updateDB(resolve,reject);
        } else reject('IDMS_HR_ORGSTRUCTURE_LEVELS_' + dateutil.getTodayYM() + '.xml is not valid.');
    } catch(err) {
        console.log(err.message);
        resolve();
    }
}

const exitProgram = () => { sql.close(); process.exit(0)} ;

const processIDMSData = async () => {

    var promiseRankCode = new Promise( (resolve,reject) => {
        processRankCode(resolve,reject);
    })

    var promiseOrgStructure = new Promise( (resolve,reject) => {
        processOrgStructure(resolve,reject);
    })    

    await Promise.all([promiseRankCode,promiseOrgStructure]);

    exitProgram();
}

sql.connect(dbConfig.config).then(pool => {
    processIDMSData();
})

sql.on('error',err => {
    logger.error('Unable to connect to database. Error : ' + err.message);
    process.exit(1);    
})