"use strict";

module.exports = (function(){
  
    var dbConfig = {
        driver: "msnodesqlv8",
        connectionString: "Driver={SQL Server Native Client 11.0};Server={10.41.119.23};Database={SPOTS};Trusted_Connection={yes}"
    };
    
    return { config : dbConfig }

})();

