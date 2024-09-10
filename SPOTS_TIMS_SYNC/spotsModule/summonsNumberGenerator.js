"use strict";

module.exports = (function(){

        function right(str, chr)
        {
            return str.slice( -( chr ) );
        }

        function privateGetNextReportNumber(summonsCount, offenderInvolvement) {
            // summonsCount is the count of summons this year
            const maxNum = 50000;

            var total = 0;

            // 1st digit is the 3rd digit of current year, i.e.: year 2017 -> 1
            // 1st digit is always multitplied by 3
            var yy = ((new Date()).getFullYear() - 2000 );
            total += Math.floor( yy / 10 ) * 3;

            // 2nd digit is the 4th digit of current year, i.e.: year 2017 -> 7
            // 2nd digit is always multitplied by 2
            total += ( yy % 10 ) * 2;

            // 3rd digit is always 5
            total += 5;

            // 4th digit is always multiplied by 6
            total += ( Math.floor( (summonsCount + 1) / 100000 ) % 10 ) * 6;

            // 5th digit is always multiplied by 5, do you see the pattern?
            total += ( Math.floor( (summonsCount + 1) / 10000 ) % 10 ) * 5;

            total += ( Math.floor( (summonsCount + 1) / 1000 ) % 10 ) * 4;

            total += ( Math.floor( (summonsCount + 1) / 100 ) % 10 ) * 3;

            total += ( Math.floor( (summonsCount + 1) / 10 ) % 10 ) * 2;

            total += Math.floor( (summonsCount + 1) % 10 );

            var lastDigit = total % 11;
            if ( lastDigit == 10 ) lastDigit = 7;

            return ( yy.toString() + '5' + right('00000' + (summonsCount + 1).toString(), 6) + lastDigit.toString() + offenderInvolvement + '1');

        }


    return {
        //showCurrentYearReportList: publicShowCurrentYearReportList,
        getNextReportNumber: privateGetNextReportNumber
        //getTIMSReportCount: publicGetTIMSReportCount
    }
})()
