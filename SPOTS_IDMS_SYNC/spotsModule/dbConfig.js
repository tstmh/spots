"use strict";

module.exports = (function(){

    var dbConfig = {
        connectionString: "Driver={SQL Server Native Client 11.0};Server={127.0.0.1\\SQLEXPRESS};Database={SPOTS_OA};Trusted_Connection={no};uid={localsql};pwd={password}"
    };

    return { config : dbConfig }

})();

