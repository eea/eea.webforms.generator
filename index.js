/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import fs from 'fs';
import { XSDWebFormParser } from './parser.js'
/**
 * Class XSDWebForm
 * XSD Schema to HTML5
 */
class XSDWebForm 
{

    /**
     * Class constructor
     * Open .xsd file and read the contents
     */
    constructor(xsdFile) 
    {
    	// Create Parser
    	this.parser = new XSDWebFormParser();

        new Promise((resolve, reject) => {
            fs.readFile(xsdFile, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            });
        }).then((res) => {
            this.xsdParse(res);
        });

    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) 
    {
    	let parent = this;
        var xmlt = new XmlDocument(xml);
        xmlt.eachChild((item, index) => {
            console.log(`\n\n============================================================================\n\n |||||||||||| ${item.name} :: ${item.attr.name} ||||||||||||`);
            /*console.log("\n==> The item tag started at pos %s and the Tag ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
            			item.startTagPosition, item.line, item.column, item.position);*/
            // Parse Tag Tag
	    	parent.parser.parseFunc(item.name);
			this.xsdInnerParse(item);
        });

    }

    /**
     * xsdInnerParse - Parse inner XML Document
     * @param xml
     */
    xsdInnerParse(xmltItem) 
    {
    	
    	if (xmltItem.children)
    		console.log(`\n[ =====================>---------------- ${xmltItem.name} | ${xmltItem.type} | ${xmltItem.children.length} ]`);

    	let parent = this;
    	// Loop through Tag's childNodes
    	if (xmltItem.children) {
	    	 for (var i = 0, l = xmltItem.children.length; i < l; i++) {
	    	 	 if (xmltItem.children[i].type === "element") {
	    				// console.log(`\n[ Looking for ${xmltItem.children[i].name} ]`);
	    				// Parse Tag Tag
	    				parent.parser.parseFunc(xmltItem.children[i].name);
	    				// Recursive call
	    				this.xsdInnerParse(xmltItem.children[i]);
	    			}
	    	};
    	}

    }

}


/**
 * main - Init
 * @param args
 */
function main(args) 
{

    // Input file variable
    var xsdFile = null;

    // Check for [-f file] input
    args.forEach(
        (item, index) => {
            if (item == '-f') {
                xsdFile = args[index + 1];
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
}

main(process.argv);