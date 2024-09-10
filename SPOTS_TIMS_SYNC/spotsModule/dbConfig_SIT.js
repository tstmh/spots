"use strict";

module.exports = (function(){
  
    var dbConfig = {
        connectionString: "Driver={SQL Server Native Client 11.0};Server={15.210.9.145,9001};Database={SPOTS_OA};Trusted_Connection={yes};"
    };
    
    return { config : dbConfig }

})();

