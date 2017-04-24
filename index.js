'use strict';

import { XmlDocument } from 'xmldoc';
import fs from 'fs';


class XSDWebForm {

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

    parseFunc(item) {
    	
    	if (!(item in this.ELEMENT_TYPES)) return;
        (this.ELEMENT_TYPES[item])(item);
    }

    parseSimpleType(item) {

        console.log("ST:=====>" + item);

    }

    parseComplexType(item) {

        console.log("CT:=====>" + item);

    }

}

const xsdwf = new XSDWebForm('test.xsd');

//test element types
// console.log(xsdwf.ELEMENT_TYPES['xs:simpleType']);