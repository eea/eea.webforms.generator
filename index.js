/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import fs from 'fs';
import XSDWebFormParser from './lib/xsdwebformparser.js'
/**
 * Class XSDWebForm
 * XSD Schema to HTML5
 */
class XSDWebForm 
{

    /**
     * Class constructor
     * Check for -f file in arguments
     */
    constructor(args) 
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

	    this.parseXSD(xsdFile);
    } 

    /**
     * parseXSD - Parse XSD file
     * Open .xsd file and read the contents
     */
    parseXSD(xsdFile) 
    {
    	var parser = new XSDWebFormParser();

    	new Promise((resolve, reject) => {
            fs.readFile(xsdFile, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            });
        }).then((res) => {
            parser.xsdParse(res);
        });

    }

}


new XSDWebForm(process.argv);