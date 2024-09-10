"use strict";

module.exports = (function(){

    const xmlWriter = require('xml-writer'), 
        fs = require('fs'),
        sql = require('mssql/msnodesqlv8'),
        logger = require('./logger.js'),
        dateutil = require('./dateutil.js'),
        q = require('q');

    var xw = '';

        function publicCreateXMLHeader(elName, usersCount) {
            xw = new xmlWriter;
            xw.startDocument('1.0', 'UTF-8').startElement(elName).startElement('Header');

            xw.startElement('ProcessID').text(dateutil.getTodayDMYHMS()).endElement();
            xw.startElement('TotalRecordCount').text(usersCount).endElement();
			xw.endElement(); // end of Header element
        }

        function publicWriteXMLtoFile(filename) {
            xw.endElement();
            xw.endDocument();

            var filePath = '';
            var response = '';
            filePath = filename + '_' + dateutil.getTodayYMD() + '.xml';

            var deferred = q.defer();

            fs.writeFile("./" + filePath, xw.toString(), function(err) {
                if(err) {
                    logger.error(err.message);
                    deferred.reject(err);
                    process.exit(0);
                }

                deferred.resolve("The file " + filePath + " was generated successfully.")
            });

            return deferred.promise;
        }

        function isnull( param ) {
            if (param)
                return param;
            else
                return '';     
        }

        function publicGenerateAccountDiscovery( rs ) {

			xw.startElement('AccessDetail');
			
            if (rs.length > 0) {
                var x = 0;
                var mIC = '';
                do 
                {
                    xw.startElement('PersonData');
                    xw.startElement('NRIC').text(isnull(rs[x].NRIC)).endElement();
                    xw.startElement('Name').text(rs[x].Name).endElement();
                    xw.startElement('Status').text(rs[x].Status).endElement();
                    xw.startElement('LastLogin').text(isnull(rs[x].LastLogin)).endElement();

                    if (x < rs.length && rs[x].NRIC && mIC != rs[x].NRIC) {
                        mIC = rs[x].NRIC;
                    }
                    
                    xw.startElement('RolesType');                 
                    while ( x < rs.length && rs[x].NRIC && mIC == rs[x].NRIC ) {
                        xw.startElement('Role');
                        xw.startElement('RoleID').text(isnull(rs[x].RoleID)).endElement();
                        xw.startElement('RoleType').text(isnull(rs[x].RoleType)).endElement();
                        xw.endElement(); // end of Role

                        x++
                    }

					xw.endElement(); // end of RolesType element				
					xw.endElement(); // end of PersonData element
                }   
                while ( x < rs.length );
            }
    
            xw.endElement(); // end of AccessDetail element
        }

    return {
        createXML: publicCreateXMLHeader,
        generateAccountDiscovery: publicGenerateAccountDiscovery,
        writeXML: publicWriteXMLtoFile
    }
});
