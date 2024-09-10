"use strict";

module.exports = (function(){

    const logger = require('./logger.js'),
        fs = require('fs'),
        libxml = require('libxmljs'),
        assert = require('assert'); 

    //----------------------------------- private variables
    // read XSD file
    var xsdContents = '', 
        _xmlContents = '',
        _xmlDoc = '', 
        xsdDoc = '';    

    var header = '',
        detail = '',
        totalNumber = '',
        _allNodes = '',
        _nodesCount = 0,
        rowCount = 0;
        
    function publicCheckXML( xmlPath, xsdPath ) {
        
        try {
            xsdContents = fs.readFileSync(xsdPath).toString();
            _xmlContents = fs.readFileSync(xmlPath).toString();
            xsdDoc = libxml.parseXml(xsdContents);
            _xmlDoc = libxml.parseXml(_xmlContents);
        } catch(err) {
            logger.error(err.message);
            //return false;
            throw err;
        }

        // validate XSD and XML is valid xml file then
        // validate xml against xsd            
        try {
            assert.equal(_xmlDoc.validate(xsdDoc), true);
        } catch (err) {
            logger.error('XML validation against XSD failed.');
            //return false;   
            throw err;
        }

        return true;
    }

    function publicIsTotalNumberCorrect() {
        header = _xmlDoc.get('header');
        detail = _xmlDoc.get('detail');
        totalNumber = _xmlDoc.get('//totalNumber').text();
        _allNodes = _xmlDoc.root().childNodes();
        _nodesCount = _allNodes.length - 2;
        rowCount = 0;

        // count detail node
        for (var i=2; i<_nodesCount-1; i++ ) {
            if (_allNodes[i].type()=='element' && _allNodes[i].name()==='detail') {
                rowCount++;
            }
        }

        // check total number of detail must match number of detail element
        if (rowCount != totalNumber) {
            logger.error('Total count of details does not match trailer.');   
            throw new Error ('Total count of details does not match trailer.')             
        } 
        return (rowCount == totalNumber);
    }

    function publicGetXMLNodes() {
        return _allNodes;
    }

    return {
        checkXML:               publicCheckXML,
        isTotalNumberCorrect:   publicIsTotalNumberCorrect,
        getXMLNodes:            publicGetXMLNodes
    }
})()