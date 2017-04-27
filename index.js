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
	    var xmlHtmlFile = null;

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

	    xmlHtmlFile = xsdFile.substring(0, xsdFile.length - 3) + "form.xml";
	    this.parseFiles(xsdFile, xmlHtmlFile);
    } 

    /**
     * parseFiles - Parse XSD and XML files
     * Open .xsd and .form.xml files and read the contents
     */
    parseFiles(xsdFile, xmlHtmlFile) 
    {

    	var xObject = {
	    		xfile : xsdFile,
	    		xdata : '',
	    		hfile : xmlHtmlFile,
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
        	
        	xObject.xdata = res;

        	new Promise((resolve, reject) => {
	            fs.readFile(xmlHtmlFile, 'utf8', (err, data) => {
	                if (err) {
	                    console.log(err);
	                    reject(err);
	                }
	                resolve(data);
	            });
	        }).then((res) => {
	        	
	        	xObject.hdata = res;
	        	parser.parse(xObject);

	        });

        });

    }

}


new XSDWebForm(process.argv);

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');