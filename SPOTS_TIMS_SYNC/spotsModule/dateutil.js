"use strict";

module.exports = (function(){
  
    function right(str, chr)
    {
        return str.slice( -( chr ) );
    }

    function priGetTodayYMD() {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var ymd = (new Date(Date.now() - tzoffset)).toISOString().slice(0,10).replace(/-/g,"");
        return ymd;
    }

    function priGetTodayYMDDelimiter( delim ) {
        var today = new Date();

        var result = today.getFullYear().toString() + delim + right( "0" + (today.getMonth() + 1).toString(), 2 ) + delim + right( "0" + today.getDate(), 2 ) 

        return result;
    }

    function priGetCurrentTime() {
        var rightNow = new Date();

        var result = right( '0' + rightNow.getHours(), 2) + 
            right('0' + rightNow.getMinutes(),2);

        return result;
    }

    return { getTodayYMD : priGetTodayYMD,
            getTodayYMDDelimiter: priGetTodayYMDDelimiter,
            getCurrentTime : priGetCurrentTime }

})();

