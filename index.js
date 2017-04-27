/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import fs from 'fs';
import XSDWebFormParser from './lib/xsdwebformparser.js'
// import heapdump from 'heapdump'; 

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
	    // HTML Input file variable
	    var hxsdFile = null;

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

	    hxsdFile = xsdFile.substring(0, xsdFile.length - 3) + "form.xml";
	    this.parseXSD(xsdFile, hxsdFile);
    } 

    /**
     * parseXSD - Parse XSD file
     * Open .xsd file and read the contents
     */
    parseXSD(xsdFile, hxsdFile) 
    {

    	var xmlFile = {
	    		xfile : xsdFile,
	    		xdata : '',
	    		hfile : xmlFile,
	    		hdata : ''
    		};
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
        	
        	xmlFile.xdata = res;

        	new Promise((resolve, reject) => {
	            fs.readFile(hxsdFile, 'utf8', (err, data) => {
	                if (err) {
	                    console.log(err);
	                    reject(err);
	                }
	                resolve(data);
	            });
	        }).then((res) => {
	        	
	        	xmlFile.hdata = res;
	        	parser.parse(xmlFile);

	        });

        });

    }

}


new XSDWebForm(process.argv);

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');