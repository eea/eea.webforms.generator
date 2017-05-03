/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import fs from 'fs';
import XSDWebFormParser from './lib/xsdwebform.parser.js'
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

		// XSDWebFormParser    		
    	this.parser = new XSDWebFormParser(true, true);

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
	    
	    this.baseFileName = xsdFile.substring(0, xsdFile.length - 3);
	    xmlHtmlFile = this.baseFileName + "form.xml";
	    
	    this.parseFiles(xsdFile, xmlHtmlFile);

    } 

    /**
     * parseFiles - Parse XSD and XML files
     * Open .xsd and .form.xml files and read the contents
     * @param xsdFile
     * @param xmlHtmlFile
     */
    parseFiles(xsdFile, xmlHtmlFile) 
    {

    	var xObject = {
	    		xfile : xsdFile,
	    		xdata : '',
	    		hfile : xmlHtmlFile,
	    		hdata : ''
    		};

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

	        	// Parse file content
	        	this.parser.parse(xObject);
	        	// Create HTML file
	        	this.createHTMLFile(this.baseFileName + "html", this.parser.getHTMLOutput());

	        });

        });

    }

    /**
     * createHTMLFile - Save output file
     * @param filename
     * @param content
     */
    createHTMLFile(filename, content) 
    {
    	
    	fs.writeFile(filename, content, function(err) {
        	if(err)
	        	console.log(err);
	    	console.log(`\x1b[2m\x1b[36mThe file ${filename} was saved\x1b[0m\n`);
		}); 
	}

}


const xsdWebForm = new XSDWebForm(process.argv);

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');