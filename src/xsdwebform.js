/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
//TODO:
// Add a file with all files checksums  - Check if files have been changed after build
// File 1 checksum = something
// File 2 checksum = something
// Total checksum (File1 checksum, File2 checksum)
// https://github.com/alexgorbatchev/node-crc
// https://github.com/dshaw/checksum
// https://www.npmjs.com/package/crc32-java - https://npm.runkit.com/crc32-java - https://runkit.com/embed/ae2bwnaq5oth | + nodemon like app server side(?) + git it as timemachine(?)
// Check 1: If "nodemon" has been triggered=>log envriroment user, file etc=>git commit changes (rollback + staging capability + image/clone new server on the fly + update server farm on the fly + farm auto synch, works with database too? +database farm synch - constant pull mode)
// Check 2: check total checksum=>nodes(app area) checksum=>each file checksum - Can check remote files (e.g. html files source) 
// Total Checksum => each app checksum (e.g. webforms) => each webform file
// Stealth Mode: flag true. Don't accept changes. If something change, rollback => alert.
// test: file datetime numeric stamp + ":" + text crc  = Unique?

// Translation Server (possible method) 
// crc phrace "Insert value into [field] to blah blah"
// client replace in your request field title with generic [field]
// client send phrase to server=>server textToCrc=>select by crc
// client check translation server for field if available and replace [field] with translated text
// Server Database: langId, crc, text
// Create crc map => En[thiscrc] => Fr[thatcrc] and so on
// in case of duplicate crc (if returns array) then match entire text to find the correct one (server side)


'use strict';

import fs from 'fs';
import path from 'path';
import ncp from 'ncp';
import rimraf from 'rimraf';
import openurl from 'openurl';
import express from 'express';
import uglify from 'uglify-js';
import uglifycss from 'uglifycss';
import webshot from 'webshot';
import XSDWebFormParser from './lib/xsdwebform.parser.js';
import XSDWebFormParserError from './lib/xsdwebform.parser.error.js';
import XSDWebFormParserTest from './lib/xsdwebform.parser.test.js';

/**
 * Class XSDWebForm
 * XSD Schema to HTML5
 */
export default class XSDWebForm {

	/**
	 * Class constructor
	 * Check for arguments
	 */
	constructor(args) {
		return new Promise((resolve, reject) => {
			//Version	
			this.Version = "0.2";

			//logging
			this.showLog = true;
			this.verbose = true;
			this.showXSDLog = true;

			//Test Server	
			this.serverPort = 3001;

			//Build directory
			this.buildPath = "build/obligation/";
			// Input file variable
			var xsdFile = null;
			// HTML Input file variable
			var xmlHtmlFile = null;
			// Open the default browser when build is completed
			this.autoOpenOutput = false;

			// Check for [-f file] [-a | open browser after build] input
			args.forEach( 
				(item, index) => {
					if (item === '-f') {
						xsdFile = args[index + 1];
						return;
					}
					if (item === '-ul') {
						this.showLog = false;
						this.verbose = false;
						return;
					}
					if (item === '-l') {
						this.showXSDLog = false;
						return;
					}
					if (item === '-a') {
						this.autoOpenOutput = true;
						return;
					}
				});

			// If not file input
			if (!xsdFile) {
				xsdFile = "./test/test";
			}

			// Lookup for base file name. Needed to check for (formname).form.xml file. Also, if file is named form.xsd then .js,.css filets etc are going to be named form.js form.css
			this.baseFileName = path.basename(xsdFile);
			this.basePath = path.dirname(xsdFile);
			xsdFile += ".xsd";
			
			xmlHtmlFile = this.baseFileName + ".form.xml";

			// XSDWebFormParser    		
			this.parser = new XSDWebFormParser(this.baseFileName, this.showLog, this.verbose, this.showXSDLog);

			// XSDWebFormTest  		
			this.tester = new XSDWebFormParserTest(this.serverPort, this.baseFileName, this.showLog, this.verbose);

			// Create (/clean) Build directory and move files
			this.prepareJSFiles().then((res) => {
				try {
					// After Build directory preperation, parse the document
					this.parseFiles(xsdFile, xmlHtmlFile, this.basePath).then((response) => {	
						var app = express();
						var parent = this;
						var filePath = path.join(__dirname.substring(0, __dirname.length - 3), this.buildPath);

						// Start test web server in order to view the HTML5 file result.
						app.use(express.static(filePath))
							.listen(parent.serverPort, function () {
								if (parent.showLog) {
									console.log(`\x1b[1m\x1b[37mTest web server is listening on port ${parent.serverPort}\x1b[0m`);
									console.log(`http://localhost:${parent.serverPort}/webform/${parent.baseFileName}.html`);
									console.log(`\x1b[0m\x1b[37mLog: \x1b[2mhttp://localhost:${parent.serverPort}/log/${parent.baseFileName}.log.html \n\n`);
								}
								resolve(parent);
							});
						});
				} catch (err) {
					XSDWebFormParserError.reportError(err);
					reject(this);
				}
			});
		});
	};

	/**
	 * parseFiles - Parse XSD and XML files
	 * Open .xsd and .form.xml files and read the contents
	 * @param xsdFile
	 * @param xmlHtmlFile
	 */
	parseFiles(xsdFile, xmlHtmlFile, filePath) {
		return new Promise ( (resolve, reject) => {	
			var xObject = {
				basefilename: this.baseFileName, 
				xfile: xsdFile,
				xdata: '',
				hfile: xmlHtmlFile,
				hdata: ''
			};

			this.getFile(xsdFile).then((res) => {
				xObject.xdata = res;
				this.getFile(filePath + "/" + xmlHtmlFile).then((res) => {
					xObject.hdata = res;
					// Parse file content
					this.parser.parse(xObject);
					
					// Create HTML file
					this.createFile(this.buildPath + "webform/" + this.baseFileName + ".html", this.getHeader() + this.parser.getHTMLOutput() + this.getFooter() ). then ( () => {
						this.getFile(__dirname + "/client/resources/labels/ct-codelists-en.json").then((langs) => {
							langs = JSON.parse(langs);
							let langData = this.parser.getFullTextContent();
							langs.CTCodelists.Languages.item.forEach((item) => {
								this.createFile(this.buildPath + "resources/labels/" + this.baseFileName + "." + item.code + ".lang.json", langData, false);
							});
							if (this.showLog) {
								this.createFile(this.buildPath + "/log/" + this.baseFileName + ".log.html", this.parser.logger.getHtmlLog(), false);
								webshot(`http://localhost:${this.serverPort}/webform/${this.baseFileName}.html`,  this.buildPath + "log/scrnsht.png", { shotSize : { width: 'all', height: 'all'} }, (res) => { return; });
							}
							this.tester.test().then ((res) => {
								let cres = "\x1b[32m ✓\x1b[1m ";
								let cresPlus = "";
								if (res.status !== 'PASS') {
									cres = "\x1b[31mx ";
									cresPlus += "\n\n\x1b[37m\x1b[1mErrors: \x1b[2m" + res.errors.map((item) => {
										return `\n\tLine: ${item.line}, Column: ${item.column}\n\t\x1b[31m\x1b[1m${item.message}\n\t\x1b[0m\x1b[37m${item.solution}\n\x1b[2m`
									}).join("");
									cresPlus += "\n\x1b[37m\x1b[1m\nPotential Problems: \x1b[2m" + res.potentialProblems.map((item) => {
										return `\n\tLine: ${item.line}, Column: ${item.column}\n\t\x1b[31m\x1b[1m${item.message}\n\t\x1b[0m\x1b[37m${item.source}\n\x1b[2m`
									}).join("");
								}
								console.log(`\x1b[1m\x1b[37mWCAG 2-AA Accessibility checking: \x1b[1m${cres}${res.status}\x1b[37m\x1b[2m${cresPlus}\x1b[0m`);
							});
							
							resolve();
						});
					});

					// Create XSD and form.xml files
					this.createFile(this.buildPath + "schema/" + this.baseFileName + ".xsd", xObject.xdata, false);
					this.createFile(this.buildPath + "schema/" + this.baseFileName + ".form.xml", xObject.hdata, false);
					
					// Create XSLT output
					this.createFile(this.buildPath + "xsl/" + this.baseFileName + ".xslt", this.parser.getXSLTOutput(), false);
					this.createFile(this.buildPath + "xsl/" + this.baseFileName + ".xml", this.parser.getXSLTXMLOutput(), false);

					// Create Doc output
					this.createFile(this.buildPath + "docs/" + this.baseFileName + ".en.odt", this.parser.getDocOutput(), false);

					// Open browser 
					if (this.autoOpenOutput)
						openurl.open(`http://localhost:${this.serverPort}/webform/${this.baseFileName}.html`);
				});
			});
		});
	}

	/**
	 * prepareJSFiles - Copy JS folder to build
	 */
	prepareJSFiles() {
		var parent = this;
		return new Promise((resolve, reject) => {
			rimraf(parent.buildPath, fs, function() {
				if (!fs.existsSync(parent.buildPath)) {
					fs.mkdirSync(parent.buildPath);
					fs.mkdirSync(parent.buildPath + "webform");
					fs.mkdirSync(parent.buildPath + "aggregation");
					fs.mkdirSync(parent.buildPath + "docs");
					fs.mkdirSync(parent.buildPath + "xsl");
					fs.mkdirSync(parent.buildPath + "schema");
					fs.mkdirSync(parent.buildPath + "xquery");
					fs.mkdirSync(parent.buildPath + "log");
					ncp(__dirname + "/client/dev/", parent.buildPath + "dev", function(err) {
						parent.getFile(__dirname + "/client/dev/package.json").then((data) => {
							parent.createFile(parent.buildPath  + "dev/package.json", data.replace(/\$FNM\$/g, parent.baseFileName) , false);
						});
						if (err) {
							console.error(err);
							reject(err);
						}
					});
					ncp(__dirname + "/client/resources/", parent.buildPath + "resources", function(err) {
						if (err) {
							console.error(err);
							reject(err);
						}
						ncp(__dirname + "/client/resources/labels/", parent.buildPath + "resources/labels", function(err) {
							if (err) {
								console.error(err);
								reject(err);
							}
						});
						ncp(__dirname + "/client/webform/assets/", parent.buildPath + "webform/assets", function(err) {
							if (err) {
								console.error(err);
								reject(err);
							}
						});
						ncp(__dirname + "/client/webform/webform.js", parent.buildPath  + "webform/" + parent.baseFileName + ".webform.js", function(err) {
							parent.getFile(__dirname + "/client//webform/webform.js").then ((data) => {
								parent.createFile(parent.buildPath + "webform/" + parent.baseFileName + ".webform.min.js", uglify.minify(data).code, false);
							});
							if (err) {
								console.error(err);
								reject(err);
							}
							ncp(__dirname + "/client/webform/webform.css", parent.buildPath + "webform/" + parent.baseFileName + ".webform.css", function(err) {
								let uglified = uglifycss.processFiles(
								[ __dirname + "/client//webform/webform.css" ],
									{ maxLineLen: 500, expandVars: true }
								);
								parent.createFile(parent.buildPath + "webform/" +  parent.baseFileName +  ".webform.min.css", uglified, false);
								if (err) {
									console.error(err);
									reject(err);
								}
							resolve();
							});
						});
					});
				}
			});
		});
	}


	/**
	 * setHeaer
	 * @param pageTitle
	 */

	getHeader() {

		return `<!DOCTYPE html>
<html lang="en" ng-app="WebFormApp">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<meta name="Publisher" content="EEA, The European Environment Agency" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{('labels.pagetitle' || 'pagetitle') | translate}}</title>

<script src="./assets/eea/eea.core.min.js"></script>
<script src="./assets/js/jquery.min.js" ></script>
<script src="./assets/js/a/angular.all.min.js" ></script>
<script src="./${this.baseFileName}.webform.min.js"></script>

<link rel="stylesheet" type="text/css" href="http://www.eionet.europa.eu/styles/eionet2007/screen.css" title="Eionet 2007 style" media="screen" />
<link rel="stylesheet" type="text/css" href="http://www.eionet.europa.eu/styles/eionet2007/print.css" media="print" />
<link rel="stylesheet" type="text/css" href="http://www.eionet.europa.eu/styles/eionet2007/handheld.css" media="handheld" />
<link rel="stylesheet" type="text/css" href="./${this.baseFileName}.webform.min.css"/>
  
<link rel="shortcut icon" type="image/x-icon" href="./assets/img/favicon.ico"/>
<script>
var groups = {${
	this.parser.htmlTagParser.HTMLObjects.map((frm) => { 
		return '\n' + frm.itemObject.name + ': {'  + frm.itemObject.groups.map ((grp) => {
			return '\n\t\t\t' + grp.itemObject.name + ' : [1]';
		}) + ' \n\t\t}';
	})
} 
};
</script>
</head>

<body  ng-controller="WebFormAppCtrl">

<eea-form-testing scp="this"></eea-form-testing>
<eea-form-viewmode scp="this"></eea-form-viewmode>
<eea-form-validation scp="this"></eea-form-validation>

<div id="container">

<eea-header></eea-header>
<eea-menu></eea-menu>

<div id="formworkarea">

	<div class="row">
		<div style="margin-top: 50px;">
			<eea-language scp="this" lang="{{selectedLanguage}}" langfile="${this.baseFileName}" chooselanguage="{{'chooselanguage' | translate}}" hide="0"></eea-language>
		</div>
	</div>
	<div class="row">
		<div class="top-form-right col-md-12"><h2>{{'labels.formtitle' | translate}}</h2></div>
	</div>
	
	<div class="row"> 
	`;
	}


	/**
	 * getFooter
	 */
	getFooter() {

		return `
	</div>
</div>

<eea-toolbar scp="this" off="{{'off' | translate}}" on="{{'on' | translate}}" save="{{'save' | translate}}" printpreview="{{'printpreview' | translate}}" close="{{'close' | translate}}" validation="{{'validation' | translate}}"></eea-toolbar>

<footer class="footer">
		<eea-footer></eea-footer>
		<!--eea-form-build date="${new Date()}" user="${process.env.USER}"></eea-form-build-->
</footer>

</div>

</body>
</html>
`;
	}

	/**
	 * getFile
	 * @param file
	 */
	getFile(file) {
		return new Promise((resolve, reject) => {
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) {
					XSDWebFormParserError.reportError(`No such file or directory ${err.path}\n`);
					reject(err);
				}
				resolve(data);
			});
		});
	}

	/**
	 * createFile - Save output file
	 * @param filename
	 * @param content
	 * @param log
	 */
	createFile(filename, content, log = true) {
		var parent = this;
		return new Promise((resolve, reject) => {
			fs.writeFile(filename, content, function(err) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					if (parent.showLog && log)
						console.log(`\x1b[2m\x1b[36mThe file ${filename} was saved\x1b[0m\n`);
					resolve();
				}
			});
		});
	}
}

var xsdWebForm = new XSDWebForm(process.argv);

module.exports.xsdWebForm = xsdWebForm;
