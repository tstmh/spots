"use strict";

module.exports = (function(){

    const xmlWriter = require('xml-writer'), 
        fs = require('fs'),
        sql = require('mssql/msnodesqlv8'),
        summonsGenerator = require('./summonsNumberGenerator.js'),
        logger = require('./logger.js'),
        dateutil = require('./dateutil.js');

    var xw = '';

	function privateCreateXMLHeader(elName) {
	    xw = new xmlWriter;
	    xw.startDocument().startElement(elName).startElement('header');
	
	    var td = new Date();
	
	    xw.startElement('timestamp').text(td.toISOString()).endElement();
	
	    xw.startElement('source').text('SPOTS').endElement();
	    xw.startElement('destination').text('TIMS').endElement().endElement();
	    
	}

	function privateSetAckCode(pkElementName, pkElementValue, statusCode, errMessage) {
	    xw.startElement('detail');
	    if(pkElementName && pkElementValue) {
	        xw.startElement(pkElementName).text(pkElementValue).endElement();
	    }
	    xw.startElement('status').text(statusCode).endElement();
	    if (errMessage!='') {
	        xw.startElement('error').text(errMessage).endElement();
	    }
	    xw.endElement();    
	}


    function privateWriteXMLtoFile(filePath, exitNow) {
        xw.endElement();
        xw.endDocument();

        fs.writeFile("./" + filePath, xw.toString(), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file " + filePath + " was generated successfully.");
            if (exitNow) process.exit(0);

        });
    }

    function privateGenerateXML(filename, exitNow) {
        privateWriteXMLtoFile( filename + '_' + dateutil.getTodayYMD() + '_' + dateutil.getCurrentTime() + '.xml', exitNow )
    }

    function privateGenerateAckXML(filename, exitNow) {
        privateWriteXMLtoFile( './xml/out/' + filename + '_' + dateutil.getTodayYMD() + '_ack.xml', exitNow )
    }

    function isnull( param ) {
        if (param)
            return param;
        else
            return '';     
    }
/*
            Address Type list in TIMS
            A - APT BLK
            B - WITHOUT APT BLK
            C - OVERSEAS ADDRESS
            D - PRIVATE FLATS WITH APT BLK
            E - C/O APT BLK
            F - C/O WITHOUT APT BLK
            
            Address Type List in SPOTS
            1	Apt Blk
            2	C/O Apt Blk
            3	C/O Without Apt Blk
            4	Overseas Address
            5	Private Flats with Apt Blk
            6	Quarter Address
            7	Reverse of Apt Blk & Str Name
            8	Without Apt Blk   
*/            

    var timsAddressType = { 1:'A', 8:'B', 4:'C', 5:'D', 2:'E', 3:'F'}

    function privateGenerateSummons( rs, summonsCount, sql ) {

        var memID = '', memSummonsType = 0, memInvolvementType = '', memTIMSReportNo = '', 
        timsReportNo = '', bGenerateTIMS = 0, totalOffence = 0, totalOffender=0;
        var involvementType = '';
		var memROID = '';

    	if (rs.length>0) {
			var x = 0;
			do 
			{
			    xw.startElement('detail');
			    xw.startElement('summonsType').text(rs[x].summonsType).endElement();
			
			    bGenerateTIMS = 0;
			    if (memSummonsType==rs[x].summonsType) {
			
			        if (memSummonsType==1) {
			            if (memID===isnull(rs[x].offenderIDNumber) && memROID===isnull(rs[x].roID)) {
			                bGenerateTIMS = 0;
			            } else {
			                bGenerateTIMS = 1;
			            }
			        } else if (memSummonsType==2) {
						if (memID===isnull(rs[x].vehicleNumber) && memROID===isnull(rs[x].roID)) {                     
							bGenerateTIMS = 0;
						} else {
							bGenerateTIMS = 1;
						}
					}
				} else {
					bGenerateTIMS = 1;
				}

				if (rs[x].summonsType == "1") {
					involvementType = rs[x].offenderInvolvement;
				} else if (rs[x].summonsType == "2") {
					// for Echo, offender involvedment is always set to Driver/Motorist (value 1)
					involvementType = '1';
				}

				if (bGenerateTIMS) {
					timsReportNo = summonsGenerator.getNextReportNumber(summonsCount++, involvementType );
					totalOffender++;
				} else {
					timsReportNo=memTIMSReportNo;
				}

				xw.startElement('reportNumber').text(timsReportNo).endElement();
				xw.startElement('reportDate').text(rs[x].reportDate).endElement();
				xw.startElement('offenceDate').text(rs[x].offenceDate).endElement();
				xw.startElement('locationCode1').text(rs[x].locationCode1).endElement();

				if (rs[x].locationCode2) xw.startElement('locationCode2').text(rs[x].locationCode2).endElement();
				if (rs[x].locationCode2Type) xw.startElement('locationCode2Type').text(rs[x].locationCode2Type).endElement();
				if (rs[x].locationRemarks) xw.startElement('locationRemarks').text(rs[x].locationRemarks.substr(0,70)).endElement();
				if (rs[x].specialZone) xw.startElement('specialZone').text(rs[x].specialZone).endElement();
				if (rs[x].schoolName) xw.startElement('schoolName').text(rs[x].schoolName).endElement();
				if (rs[x].vehicleNumber) xw.startElement('vehicleNumber').text(isnull(rs[x].vehicleNumber).slice(0,20)).endElement();
				if (rs[x].foreignLocalOrSpecialVehicleFlag) xw.startElement('foreignLocalOrSpecialVehicleFlag').text(rs[x].foreignLocalOrSpecialVehicleFlag).endElement();
				if (rs[x].vehicleType) xw.startElement('vehicleType').text(rs[x].vehicleType).endElement();
				if (rs[x].vehicleCategory && rs[x].vehicleCategory.trim().length > 0 ) xw.startElement('vehicleCategory').text(rs[x].vehicleCategory).endElement();
				if (rs[x].vehicleTransmission) xw.startElement('vehicleTransmission').text(rs[x].vehicleTransmission).endElement();
				if (rs[x].vehicleMake) xw.startElement('vehicleMake').text(isnull(rs[x].vehicleMake).slice(0,20)).endElement();
				if (rs[x].vehicleColour) xw.startElement('vehicleColour').text(rs[x].vehicleColour).endElement();
				if (rs[x].unladenWeight) xw.startElement('unladenWeight').text(rs[x].unladenWeight).endElement();
				if (rs[x].vehicleClass3CEligibility) xw.startElement('vehicleClass3CEligibility').text(rs[x].vehicleClass3CEligibility).endElement();
				if (rs[x].vehicleSpeed) xw.startElement('vehicleSpeed').text(rs[x].vehicleSpeed).endElement();
				if (rs[x].vehicleSpeedLimit) xw.startElement('vehicleSpeedLimit').text(rs[x].vehicleSpeedLimit).endElement();
				if (rs[x].roadSpeedLimit) xw.startElement('roadSpeedLimit').text(rs[x].roadSpeedLimit).endElement();
				if (rs[x].speedDeviceUsed) xw.startElement('speedDeviceUsed').text(rs[x].speedDeviceUsed).endElement();
				if (rs[x].speedLimiterRequired) xw.startElement('speedLimiterRequired').text(rs[x].speedLimiterRequired).endElement();
				if (rs[x].speedLimiterInstalled) xw.startElement('speedLimiterInstalled').text(rs[x].speedLimiterInstalled).endElement();
				if (rs[x].sentForInspection) xw.startElement('sentForInspection').text(rs[x].sentForInspection).endElement();

/* UAT & SIT
				xw.startElement('roType').text('U').endElement();                
				xw.startElement('roID').text('US7200004H').endElement();
				xw.startElement('roName').text('RO Name').endElement();
				xw.startElement('roRank').text('RO Rank').endElement();
				xw.startElement('roDivision').text('A').endElement();
*/

				if (rs[x].roType) xw.startElement('roType').text(rs[x].roType).endElement();
				if (rs[x].roID) xw.startElement('roID').text(rs[x].roID).endElement();
				if (rs[x].roName) xw.startElement('roName').text(rs[x].roName).endElement();
				if (rs[x].roRank) xw.startElement('roRank').text(isnull(rs[x].roRank).slice(0,7)).endElement();
				if (rs[x].roDivision) xw.startElement('roDivision').text('TP').endElement();

				if (rs[x].summonsType == "1") {
				    xw.startElement('offenderInvolvement').text(involvementType.toString()).endElement();
				} else if (rs[x].summonsType == "2") {
				    // for Echo, offender involvedment is always set to Driver/Motorist (value 1)
				    xw.startElement('offenderInvolvement').text("1").endElement();
				}
				xw.startElement('offenderIDType').text(isnull(rs[x].offenderIDType)).endElement();           
				xw.startElement('offenderIDNumber').text(isnull(rs[x].offenderIDNumber)).endElement();

				if (rs[x].offenderName) xw.startElement('offenderName').text(rs[x].offenderName).endElement();
				if (rs[x].offenderGender) xw.startElement('offenderGender').text(rs[x].offenderGender).endElement();
				if (rs[x].offenderDOB) xw.startElement('offenderDOB').text(rs[x].offenderDOB.toISOString().slice(0,10)).endElement();

/* UAT
                    if (rs[x].offenderDOB) xw.startElement('offenderDOB').text(rs[x].offenderDOB.slice(0,10)).endElement();
*/
				if (rs[x].offenderCountryOfBirth) xw.startElement('offenderCountryOfBirth').text(rs[x].offenderCountryOfBirth).endElement();
				if (rs[x].offenderContact1) xw.startElement('offenderContact1').text(rs[x].offenderContact1).endElement();
				if (rs[x].offenderContact2) xw.startElement('offenderContact2').text(rs[x].offenderContact2).endElement();
				if (rs[x].offenderNationality) xw.startElement('offenderNationality').text(rs[x].offenderNationality).endElement();
				
				if (rs[x].registeredAddressFlag) xw.startElement('registeredAddressFlag').text(rs[x].registeredAddressFlag).endElement();

				var addrType='';
				try {
				    if (rs[x].addressType) addrType=timsAddressType[ rs[x].addressType ];
				} catch(err) {
				    addrType='';
				}
				if (addrType) xw.startElement('addressType').text(addrType).endElement();

				if (rs[x].blockHouseNumber) xw.startElement('blockHouseNumber').text(rs[x].blockHouseNumber).endElement();
				if (rs[x].street) xw.startElement('street').text(rs[x].street).endElement();
				if (rs[x].floorNumber) xw.startElement('floorNumber').text(rs[x].floorNumber).endElement();
				
				if (rs[x].unitNumber) xw.startElement('unitNumber').text(isnull(rs[x].unitNumber)).endElement();

				if (rs[x].buildingName) xw.startElement('buildingName').text(isnull(rs[x].buildingName).slice(0,30)).endElement();
				if (rs[x].postalCode) xw.startElement('postalCode').text(isnull(rs[x].postalCode)).endElement();
				if (rs[x].licenceType) xw.startElement('licenceType').text(isnull(rs[x].licenceType)).endElement();

				if ( parseInt( rs[x].offenderInvolvement ) <= 4 ) {
				    if (rs[x].dlClass1) xw.startElement('dlClass1').text(isnull(rs[x].dlClass1)).endElement();
				    if (rs[x].dlClass2) xw.startElement('dlClass2').text(isnull(rs[x].dlClass2)).endElement();
				    if (rs[x].dlClass2A) xw.startElement('dlClass2A').text(isnull(rs[x].dlClass2A)).endElement();
				    if (rs[x].dlClass2B) xw.startElement('dlClass2B').text(isnull(rs[x].dlClass2B)).endElement();
				    if (rs[x].dlClass3) xw.startElement('dlClass3').text(isnull(rs[x].dlClass3)).endElement();
				    
				    if (rs[x].dlClass3A) xw.startElement('dlClass3A').text(rs[x].dlClass3A).endElement();
				    if (rs[x].dlClass3C) xw.startElement('dlClass3C').text(rs[x].dlClass3C).endElement();
				    if (rs[x].dlClass3CA) xw.startElement('dlClass3CA').text(rs[x].dlClass3CA).endElement();
				    if (rs[x].dlClass4) xw.startElement('dlClass4').text(rs[x].dlClass4).endElement();
				    if (rs[x].dlClass4A) xw.startElement('dlClass4A').text(rs[x].dlClass4A).endElement();
				    if (rs[x].dlClass5) xw.startElement('dlClass5').text(rs[x].dlClass5).endElement();
				}

				if (rs[x].licenceType=="4" || rs[x].licenceType=="5" || rs[x].licenceType=="6" ) {
				    if (rs[x].licenceDescription) xw.startElement('licenceDescription').text(rs[x].licenceDescription).endElement();
				}

			    /* PROD */
					if (rs[x].licenceExpiryDate ) xw.startElement('licenceExpiryDate').text(rs[x].licenceExpiryDate.toISOString().slice(0,10)).endElement();			
			    
			    /* UAT  
					if (rs[x].licenceExpiryDate ) xw.startElement('licenceExpiryDate').text(rs[x].licenceExpiryDate.slice(0,10)).endElement();
				*/	
					if (rs[x].reportRemarks) xw.startElement('reportRemarks').text(isnull(rs[x].reportRemarks).slice(0,2000)).endElement();
					if (rs[x].additionalRemarks) xw.startElement('caseRemarks').text(isnull(rs[x].additionalRemarks).slice(0,2000)).endElement();
					if (rs[x].operationType) xw.startElement('operationType').text(rs[x].operationType).endElement();
	
					totalOffence = 0;
					
					do {
					    totalOffence++;
					
					    if (rs[x].summonsType==1 ) {
					        // Summons
					        memID = isnull(rs[x].offenderIDNumber);
					    } else if ( rs[x].summonsType==2) {
					        // Summons Echo
					        memID = isnull(rs[x].vehicleNumber);
					    }
					
					    memSummonsType = rs[x].summonsType;    
					    memTIMSReportNo = timsReportNo;  
						memROID = rs[x].roID;
					    
					    x++;
					}
					while ( (x < rs.length) && (memSummonsType==rs[x].summonsType ) &&
					    (   ( (memSummonsType==1) && 
							  (memID === isnull(rs[x].offenderIDNumber)) && 
							  (memROID === isnull(rs[x].roID)) 
							) || 
					        ( (memSummonsType==2) && (memID === isnull(rs[x].vehicleNumber) ) &&
							   (memROID === isnull(rs[x].roID))
							)
					    ) )
					
					xw.startElement('totalOffence').text(isnull(totalOffence.toString())).endElement();
					
					for (var s=(totalOffence); s>0; s--) {
					    xw.startElement('offence');
					    xw.startElement('offenceCode').text(isnull(rs[x - s].offenceCode)).endElement();
					    xw.startElement('offenceRemarks').text(isnull(rs[x - s].offenceRemarks).slice(0,300)).endElement();
					    xw.endElement();
					
					    // update offence table with generated TIMS Report Number
					    var req3 = new sql.Request();
					    req3.input('offenceID', sql.Int, rs[x - s].offenceID );
					    req3.input('timsReportNo', sql.VarChar(12), memTIMSReportNo);
	
						//console.log( 'offenceID=' + rs[x - s].offenceID.toString() );
	
						logger.info( 'Updated tims_report_number=' + memTIMSReportNo + ' in table offence.' );
	
	
						req3.query('update offence set tims_report_number=@timsReportNo where offence_id=@offenceID').then(function(updateResult) {
						//result = true;
					}).catch(function(err) {
						// ... error checks
						logger.error('Error updating table offence. Error : ' + err.message);
						//result = false;
					});          
	
				}
				xw.endElement();
	
			}   
			while ( x < rs.length );
		}

		// trailer element
		xw.startElement('trailer');
		xw.startElement('totalNumber').text(totalOffender.toString()).endElement();
		xw.endElement(); // end of trailer element
		
		xw.endElement();    // end of detail element
	}

    return {
        createXML: privateCreateXMLHeader,
        setAckCode: privateSetAckCode,
        generateSummons: privateGenerateSummons,
        writeXML: privateGenerateXML,
        writeAckXML: privateGenerateAckXML
    }
});
