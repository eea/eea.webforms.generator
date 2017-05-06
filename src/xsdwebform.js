/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import fs from 'fs';
import ncp from 'ncp';
import rimraf from 'rimraf';
import openurl from 'openurl';
import XSDWebFormParser from './lib/xsdwebform.parser.js'
import XSDWebFormParserError from './lib/xsdwebform.parser.error.js'

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

		// Open the default browser when build is completed
		this.autoOpenOutput = false;

		// Check for [-f file] input
		args.forEach(
		    (item, index) => {
		        if (item == '-f') {
		            xsdFile = args[index + 1];
		            return;
		        }
		        if (item == '-a') {
		            this.autoOpenOutput = true;
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

		//Build directory
		this.buildPath = "./build";
		this.prepareJSFiles().then((res) => {			
			try {
				this.parseFiles(xsdFile, xmlHtmlFile);
			    	
				if (this.autoOpenOutput)
					openurl.open(`./build/${this.baseFileName}html`);

			} catch(err){
				XSDWebFormParserError.reportError(err);
			}
		});

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

		this.getFile(xsdFile).then((res) => {
	    		xObject.xdata = res;
	    		this.getFile(xmlHtmlFile).then((res) => {
		    		xObject.hdata = res;
		    		// Parse file content
				this.parser.parse(xObject);

				// Create HTML file
				this.createHTMLFile( this.buildPath + "/" + this.baseFileName + "html", this.parser.getHTMLOutput());
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
		        	else
		    		console.log(`\x1b[2m\x1b[36mThe file ${filename} was saved\x1b[0m\n`);
			}); 

	}

	/**
	 * prepareJSFiles - Copy JS folder to build
	 */
	prepareJSFiles() 
	{	

		var buildPath = this.buildPath;
		return new Promise( (resolve, reject) =>{
			rimraf(buildPath, fs, function() {
				if (!fs.existsSync(buildPath)){
					fs.mkdirSync(buildPath);
					ncp("./src/assets", buildPath + "/assets", function (err) {
						if (err) { 
							return console.error(err);
							reject();
						}
						resolve();
					});
				}
			});
		});

	}

	/**
	 * getFile
	 * @param file
	 */
	getFile(file) {

		return new Promise((resolve, reject) => {
			fs.readFile(file, 'utf8', (err, data) => {
			    if (err) {
			        console.log(err);
			        reject(err);
			    }
			    resolve(data);
			});
		});

	}
}


const xsdWebForm = new XSDWebForm(process.argv);

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');