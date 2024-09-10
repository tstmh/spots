"use strict";

module.exports = (function(){
  
    function right(str, chr)
    {
        return str.slice( -( chr ) );
    }

    function priGetTodayYMD() {
        var rightNow = new Date();
        var ymd = rightNow.toISOString().slice(0,10).replace(/-/g,"");
        return ymd;
    }

    function priGetTodayYM() {
        var rightNow = new Date();
        var ym = rightNow.toISOString().slice(0,8).replace(/-/g,"");
        return ym;
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

	function priGetTodayDMYHMS() {
		// To generate DateTime in DDMMYYYYHHmmss format
		
		var today = new Date();
		
		var result = right('0' + today.getDate(), 2 ) + 
						right('0' + (today.getMonth() + 1).toString(), 2 ) + 
						today.getFullYear().toString() + 
						right('0' + today.getHours(), 2) + 
						right('0' + today.getMinutes(), 2) + 
						right('0' + today.getSeconds(), 2);
			
        return result;
    }
	
    return { getTodayYMD : priGetTodayYMD,
            getTodayYM : priGetTodayYM,
            getTodayYMDDelimiter: priGetTodayYMDDelimiter,
            getCurrentTime : priGetCurrentTime,
			getTodayDMYHMS: priGetTodayDMYHMS }

})();

