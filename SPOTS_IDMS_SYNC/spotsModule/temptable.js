"use strict";

module.exports = (function(){
    const sql = require('mssql/msnodesqlv8'),
          logger = require('./logger.js');

    function priDeleteUnusedCode( tableName, callback ) {
        try {

            var reqdel = new sql.Request()

            reqdel.input('tableName',sql.VarChar(50),tableName);
            reqdel.output('delCode',sql.VarChar(5000));

            logger.info('Deleting unused code in table temp_' + tableName)

            var res = reqdel.execute("spDeleteTemp", (err, result) => {  

                if (err) {
                    logger.error( 'Error deleting unused code in table temp_' + tableName + '. Error : ' + err.toString());
                } else {
                    logger.info('Deleted unused code in table temp_' + tableName);
                    callback();
                }
            });

        } catch ( err ) {
            console.log(err);
            callback();
        }

    }    

    function priInsertCode(tableName,code) {
        var req1 = new sql.Request();
        req1.input('code', sql.VarChar(50), code);

        //        logger.info('Inserting code ' + code + ' in table temp_' + tableName);   

        var columnName = '';
        if (tableName=='idms_org_struc_code') {
            columnName='OrganisationCode'
        } else if (tableName=='idms_rank_code'){
            columnName='RankCode'
        }

        req1.query('insert into temp_' + tableName + ' select @code from temp_' + tableName +
            ' where @code not in (select ' + columnName + ' from temp_' + tableName +')', (err, result) => {
            if (err) {
                logger.error( 'Error inserting into temp_' + tableName + '. Code=' + code + '. Error : ' + err.toString());
            } else {
                //                logger.info('inserted code ' + code + '.'); 
            }

        });

    }

    return {        
        deleteUnusedCode: priDeleteUnusedCode,
        insertCode: priInsertCode
    }
})();