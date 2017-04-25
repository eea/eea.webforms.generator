/**
 * @file index.js
 * XSD Schema to HTML5
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import fs from 'fs';


/**
 * Class XSDWebForm
 * XSD Schema to HTML5
 */
class XSDWebForm {
 
    /**
     * Class constructor
     * Open .xsd file and read the contents
     */
    constructor(xsdFile) {

        this.ELEMENT_TYPES = {
            "xs:simpleType": this.parseSimpleType,
            "xs:complexType": this.parseComplexType
        };

        new Promise((resolve, reject) => {
            fs.readFile(xsdFile, 'utf8', function(err, data) {
                if (err) {
                    console.log(err);
                }
                resolve(data)
            });
        }).then((res) => {
            this.xsdParse(res);
        });

    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) {

        var xmlt = new XmlDocument(xml);
        let parent = this;
        xmlt.eachChild(function(item, index) {
            parent.parseFunc(item.name);
            //console.log(`\n============================================================================\n\n${item.name} :: ${item.attr.name}`);
            // console.log("\n==> The item tag started at pos %s and the element ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
            // 			item.startTagPosition, item.line, item.column, item.position);

            item.eachChild(function(sitem, index) {
                // console.log(`\n--------------------------------------------\n sitem`);
                // console.log("\n==> The sitem tag started at pos %s and the element ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
                // 			item.startTagPosition, sitem.line, sitem.column, sitem.position);
            });
        });

    }

    /**
     * parseFunc - Parse XML Element
     * @param item
     */
    parseFunc(item) {

        if (!(item in this.ELEMENT_TYPES)) return;
        (this.ELEMENT_TYPES[item])(item);
    
    }

    /**
     * parseSimpleType - Parse SimpleType Element
     * @param item
     */
    parseSimpleType(item) {

        console.log("ST:=====>" + item);

    }

 	/**
     * parseComplexType - Parse ComplexType Element
     * @param item
     */
    parseComplexType(item) {

        console.log("CT:=====>" + item);

    }

}


// Input file variable
var xsdFile = null;

// Check for [-f file] input
process.argv.forEach(
    (item, index) => {
        if (item == '-f') {
            xsdFile = process.argv[index + 1];
            return;
        }
    }
);

// If not file input
if (!xsdFile) {
    xsdFile = "test.xsd";
}

// Call XSDWebForm Class
const xsdwf = new XSDWebForm(xsdFile);

