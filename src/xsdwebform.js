/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

// import heapdump from 'heapdump';  //debug library
import fs from 'fs';
import path from 'path';
import ncp from 'ncp';
import rimraf from 'rimraf';
import openurl from 'openurl';
import express from 'express';
import XSDWebFormParser from './lib/xsdwebform.parser.js'
import XSDWebFormParserError from './lib/xsdwebform.parser.error.js'

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
		return new Promise ( (resolve, reject) => {			

			//logging
			this.showLog = true;
			this.verbose = true;

			//Build directory
			this.buildPath = "build/";
			// Input file variable
			var xsdFile = null;
			// HTML Input file variable
			var xmlHtmlFile = null;
			// Open the default browser when build is completed
			this.autoOpenOutput = false;

			// Check for [-f file] [-a | open browser after build] input
			args.forEach( 
				(item, index) => {
					if (item == '-f') {
						xsdFile = args[index + 1];
						return;
					}
					if (item == '-ul') {
						this.showLog = false;
						this.verbose = false;
						return;
					}
					if (item == '-a') {
						this.autoOpenOutput = true;
						return;
					}
				}
			);

			// XSDWebFormParser    		
			this.parser = new XSDWebFormParser(this.showLog, this.verbose);
			
			// If not file input
			if (!xsdFile) {
				xsdFile = "./test/test.xsd";
			}

			this.baseFileName = path.basename(xsdFile);
			this.baseFileName = this.baseFileName.substring(0, this.baseFileName.length - 3);
			this.basePath = path.dirname(xsdFile);
			xmlHtmlFile = this.baseFileName + "form.xml";

			this.prepareJSFiles().then((res) => {
				try {
					this.parseFiles(xsdFile, xmlHtmlFile, this.basePath).then ( (response) => {	
						var app = express();
						var parent = this;
						var filePath = path.join( __dirname.substring(0, __dirname.length - 3), this.buildPath);
						app.use(express.static(filePath))
							.listen(3001, function () {
								if (parent.showLog)
									console.log("\x1b[2m\x1b[37m\nTest web server is listening on port 3001\x1b[0m");								
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
					this.createFile(this.buildPath  + this.baseFileName + "html", this.getHeader() + this.parser.getHTMLOutput() + this.getFooter() ). then ( () => {
						this.createFile(this.buildPath  + this.baseFileName + "lang.json", this.parser.getFullTextContent()).then ( () => {
							resolve();
						})
					});
					// Open browser 
					if (this.autoOpenOutput)
						openurl.open(`http://localhost:3001/${this.baseFileName}html`);
				});
			});
		});
	}

	/**
	 * prepareJSFiles - Copy JS folder to build
	 */
	prepareJSFiles() {
		var buildPath = this.buildPath;
		return new Promise((resolve, reject) => {
			rimraf(buildPath, fs, function() {
				if (!fs.existsSync(buildPath)) {
					fs.mkdirSync(buildPath);
					ncp("./src/assets/", buildPath + "assets", function(err) {
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
	 * setHeaer
	 * @param pageTitle
	 */

	getHeader() {

		return `
<!DOCTYPE html>
<html lang="en" ng-app="WebFormApp">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{'pagetitle' | translate}}</title>

<script src="./assets/js/jquery.min.js"></script>
<script src="./assets/js/a/angular.min.js" ></script>
<script src="./assets/js/a/angular-translate.min.js" ></script>
<script src="./assets/js/a/angular-translate-loader-url.min.js" ></script>
<script src="./assets/js/a/angular-datepicker.min.js"></script>

<link rel="stylesheet" type="text/css" href="./assets/css/a/angular-datepicker.min.css"/>
<link rel="stylesheet" type="text/css" href="./assets/css/foundation.min.css"/>
<link rel="stylesheet" type="text/css" href="./assets/css/webform.css"/>

<link rel="shortcut icon" type="image/x-icon" href="./assets/img/favicon.ico"/>

<script type="text/javascript">

const app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', WebFormAppCtrl);

app.config(["$translateProvider", function($translateProvider) {

	$translateProvider.useUrlLoader('${this.baseFileName + "lang.json"}');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage('en');

}]);


/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($scope, $http, $timeout, $window,  $translate) {
 
	$scope.field = {};  
	$scope.multipleIndex = 1;

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};

	$scope.toggleValidation = function() {
		$scope.ValidationDisabled = !$scope.ValidationDisabled;
	}

	$scope.submit = function(frm) {
		$scope.field[frm.$name].AEAPrice = 11;
		console.log(frm);
		console.log(frm['AEA-Price'].$$attr.ewMap);
		return false;
	};

	$scope.printPreview = function() {
		var conversionLink = [formApplicationUrl("/download/convert", urlProperties.baseURI, urlProperties.sessionID, urlProperties.fileID), "&conversionId=", HTMLconversionNumber].join("");
		$window.open(conversionLink, '_blank');
	}

	$scope.toggleValidation = function() {
		$scope.ValidationDisabled = !$scope.ValidationDisabled;
	}

	$scope.save = function(){
		dataRepository.saveInstance($scope.Webform);
	}

	$scope.close = function(){
		if (urlProperties.baseURI == ''){
				urlProperties.baseURI = "/";
		};
   	 	var windowLocation = (urlProperties.envelope && urlProperties.envelope.length > 0) ? urlProperties.envelope : urlProperties.baseURI;
	    	if ($scope.Webform.$dirty){
		        	if ($window.confirm('You have made changes in the questionnaire! \\n\\n Do you want to leave without saving the data?')){
		 	           	window.location = windowLocation;
		        	}
	    	}
	    	else {
	       	 	window.location = windowLocation;
	    	}
	}

	$scope.addRow = function() {
		alert('Row');
	};

}
</script>

</head>
<body>

<div id="container" ng-controller="WebFormAppCtrl">

<div id="tool-ribbon">
	<div id="left-tools">
		<a id="eealink" href="http://www.eea.europa.eu/">EEA</a>
	</div>
	<div id="right-tools">
			<a href="http://www.eea.europa.eu/">
				<b>European Environment Agency</b>
			</a>
			Kgs. Nytorv 6, DK-1050 Copenhagen K, Denmark - Phone: +45 3336 7100              
		<a id="printlink" href="javascript:this.print();" title="Print this page">
			<span>Print</span>
		</a>
	</div>
</div>

<div id="page-head">
	<a accesskey="1" href="/">
	</a>
	<div id="network-title">Eionet</div>
	<div id="site-title">European Environment Information and Observation Network</div>
</div>

<!--<div class="top-bar">
	<div class="top-bar-left">
		<ul class="menu">
		    <li class="menu-text">EEA</li>
		    <li><a href="#">One</a></li>
		    <li><a href="#">Two</a></li>
		    <li><a href="#">Three</a></li>
		</ul>
</div>
</div>-->

<div class="callout small primary">
	<div class="row column text-center">
		<h1>EEA</h1>
		<h2 class="subheader">Web Form</h2>
	</div>
</div>

<div id="workarea" class="row collapse">
	
	<div class="row">
		<div class="multiple-index medium-1">{{'number' | translate}} <span class="index">{{multipleIndex}}</span></div>
		<div class="multiple-index-right medium-11"><h2>{{'formtitle' | translate}}</h2></div>
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

<div id="pagefoot" class="row">
        <div class="columns small-4">
            <div class="switch round tiny">
                <span>Validation </span>
                <span ng-show="ValidationDisabled" class="ng-hide">Off</span>
                <span ng-show="!ValidationDisabled">On</span>
                <div class="round tiny">
                  <input id="validationSwitch" class="switch-input" checked ng-click="toggleValidation()" type="checkbox">
                  <label for="validationSwitch" class="switch-paddle"></label>
                </div>
                <label for="validationSwitch"></label>
            </div> 
        </div>
        <div class="columns small-8 text-right buttons">
            <button ng-click="save()">Save</button>
            <button ng-click="printPreview()">Print Preview</button>
            <button ng-click="close()">Close</button>
        </div>
    </div>

</div>

<footer class="footer">
<div class="footer-wrapper">
${new Date()}
</div>
</footer>

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
					console.log(err);
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
	 */
	createFile(filename, content) {
		var parent = this;
		return new Promise((resolve, reject) => {
			fs.writeFile(filename, content, function(err) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					if (parent.showLog)
						console.log(`\x1b[2m\x1b[36mThe file ${filename} was saved\x1b[0m\n`);
					resolve();
				}
			});
		});
	}
}

var xsdWebForm = new XSDWebForm(process.argv);

module.exports.xsdWebForm = xsdWebForm;

// heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');