"use strict";

module.exports = (function(){
  
    var dbConfig = {
        connectionString: "Driver={SQL Server Native Client 11.0};Server={10.41.182.33};Database={SPOTS_OA_UAT};Trusted_Connection={yes}"
    };
 
    return { config : dbConfig }

})();
