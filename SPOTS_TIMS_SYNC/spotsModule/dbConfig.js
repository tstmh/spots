"use strict";

module.exports = (function(){

    var dbConfig = {
        connectionString: "Driver={SQL Server Native Client 11.0};Server={127.0.0.1};Database={SPOTS_OA};Trusted_Connection={yes};User ID=mavis2ldc;Password=Password1"
    };
    
    return { config : dbConfig }

})();

