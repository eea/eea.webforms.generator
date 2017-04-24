'use strict';

import { XmlDocument } from 'xmldoc';
import fs from 'fs';


class XSDWebForm {

    constructor(xsdFile) {

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
        xmlt.eachChild(function(item) {
            console.log(`\n============================================================================\n\n${item.name} :: ${item.attr.name}`);
           	// console.log("\n==> The item tag started at pos %s and the element ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
           	// 			item.startTagPosition, item.line, item.column, item.position);

           	item.eachChild(function(sitem) {
	            console.log("\n--------------------------------------------\n" + sitem);
	           	// console.log("\n==> The sitem tag started at pos %s and the element ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
	           	// 			item.startTagPosition, sitem.line, sitem.column, sitem.position);
	        });
        });
        
    }

}

new XSDWebForm('test.xsd');
