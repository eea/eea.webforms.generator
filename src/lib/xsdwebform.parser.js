/**
 * @file xsdwebform.parser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

import { XmlDocument } from 'xmldoc';
import XsdTagParser from './xsdwebform.parser.xsd.js';
import HtmlTagParser from './xsdwebform.parser.html.js';
import XsltGenerator from './xsdwebform.parser.xslt.js';
import XSDWebFormParserLog from './xsdwebform.parser.log.js';

/**
 * Class XSDWebFormParser
 * Parser for XSD Schema to HTML5
 */
class XSDWebFormParser {
	/**
	 * Class constructor
	 * @param showlog
	 * @param verbose
	 */
	constructor(baseFileName, showlog = false, verbose = false,  showXSDLog  = true) {
		this.xsdTagParser = new XsdTagParser();
		this.htmlTagParser = new HtmlTagParser();
		this.xsltGenerator = new XsltGenerator();
		this.logger = new XSDWebFormParserLog();
		this.baseFileName = baseFileName;

		this.htmlOutput = {
			content: '',
			HTMLObjects: []
		};

		this.showLog = showlog;
		this.verbose = verbose;
		this.showXSDLog = showXSDLog;

		this.xsdTagParser.setLogger(this.logger);
		this.xsdTagParser.setLog(this.showLog);
		this.xsdTagParser.setVerbose((this.showLog && this.verbose));
		this.htmlTagParser.setLogger(this.logger);
		this.htmlTagParser.setLog(this.showLog);
		this.htmlTagParser.setVerbose((this.showLog && this.verbose));
		this.xsltGenerator.setLogger(this.logger);
		this.xsltGenerator.setLog(this.showLog);
		this.xsltGenerator.setVerbose((this.showLog && this.verbose));
	}

	/**
	 * parse - Parse XML Document
	 * @param xml
	 */
	parse(xObject) {
		if (this.showLog && this.showXSDLog)
			this.logger.logXSD(xObject);

		// Create XML Document for XSD
		var xsdItem = new XmlDocument(xObject.xdata);
		xsdItem.level = 0;

		if (this.showLog && this.showXSDLog) 
			this.xsdTagParser.xsdParse(xsdItem);

		if (this.showLog)
			this.logger.logHTML(xObject);

		// Create XML Document for FORM.XML
		var htmlItem = new XmlDocument(xObject.hdata);
		htmlItem.level = 0;
		this.htmlTagParser.htmlParse(htmlItem, xsdItem);

		// Create HTML output
		this.htmlOutput.HTMLObjects = this.htmlTagParser.HTMLObjects;
		this.htmlOutput.content = this.createHTMLOutput();

		// Create XSLT output
		this.xslt = this.xsltGenerator.createXSLTOutput(htmlItem);
		this.xsltXml = this.xsltGenerator.createXMLOutput(htmlItem, this.baseFileName);
		
		if (this.showLog)
			this.logger.showLogs(this);
	}

	/**
	 * createHTMLOutput
	 */
	createHTMLOutput() {
		var html = [];

		for (let f = 0, t = this.htmlOutput.HTMLObjects.length; f < t; f++) {
			let form = this.htmlOutput.HTMLObjects[f];
			let formHtml = [];

			html.splice(html.length + 1, 0, "\t\t" + form.itemObject.tagToHtml(this, 1));
			let groups = this.htmlOutput.HTMLObjects[f].itemObject.groups;
			html.splice(groups.length + html.length + 1, 0, "\t\t</" + form.itemObject.tag + ">");

			for (let i = 0, l = groups.length; i < l; i++) {
				let group = groups[i];

				formHtml.push(`\t\t<div id="form-area-${form.itemObject.name}">`);
				formHtml.push(`\t\t<div id="group-area-{{$index + 1}}-${group.itemObject.name}" class="group-area" ng-repeat="grouprow in groups.${form.itemObject.name}.${group.itemObject.name} track by $index" ng-show="grouprow > 0">`);

				if (group.itemObject.prepend)
					formHtml.push("\t\t" + group.itemObject.prepend);

				formHtml.push("\t\t\t\t" + group.itemObject.tagToHtml(this.htmlTagParser, 3));
				for (let i2 = 0, l2 = groups[i].itemObject.items.length; i2 < l2; i2++) {
					let ngshow = '';
					if (groups[i].itemObject.items[i2].hide && groups[i].itemObject.items[i2].attrs.hideonautoselect == 1) {
						ngshow = ' ng-show="' + groups[i].itemObject.items[i2].hide + '"';
					} 
					formHtml.push("\t\t\t<div class=\"formitem\"" + ngshow + ">\n\t\t\t\t" + groups[i].itemObject.items[i2].tagToHtml(this.htmlTagParser) + "\n\t\t\t</div>");
				}

				formHtml.push("\t\t</" + group.itemObject.tag + ">");

				formHtml.push('\t\t</div>');
				formHtml.push('\t\t</div>');

				if (group.itemObject.append)
					formHtml.push("\t\t\t" + group.itemObject.append);
			}

			if (form.itemObject.append)
				formHtml.push("\t\t\t" + form.itemObject.append);


			html.splice(html.length - 1, 0, formHtml.join('\n\n'));
		}
		return html.join("\n\n");
	}

	/**
	 * getHTMLOutput - Return HTML5 Document
	 */
	getHTMLOutput() {
		return this.htmlOutput.content ;
	}
	
	/**
	 * getXSLTOutput - Return XSLT Document
	 */
	getXSLTOutput() {
		return this.xslt;
	}

	/**
	 * getXSLTXMLOutput - Return XSLT Document
	 */
	getXSLTXMLOutput() {
		return this.xsltXml;
	}

	/**
	 * getLanguageContent - Return Text Content 
	 */
	getLanguageContent() {
		// Remove duplicate labels
		let exists = {};
		let filteredLabels = this.htmlTagParser.LabelContentObjects.filter((item) => {
			if (exists[item.label])
				return false;

			exists[item.label] = 1;
			return true;
		});
		
		exists = {};
		let filteredText = this.htmlTagParser.TextContentObjects.filter((item) => {
			if (exists[item.label])
				return false;

			exists[item.label] = 1;
			return true;
		});
		
		let TextContentObjectsLength = filteredText.length - 1;
		filteredLabels.push( { "text" : filteredText.map((label, index) => {
			if (index < TextContentObjectsLength)
				return `\t\t\t\t\t\t\t\t\t"${label.label}" : \t\t${JSON.stringify(label.text.toString())},`;
			else
				return `\t\t\t\t\t\t\t\t\t"${label.label}" : \t\t${JSON.stringify(label.text.toString())}`;
		}).join("\n") } );
		
		
		let labelContentObjectsLength = filteredLabels.length - 1;
		let LabelContentObjects =  filteredLabels.map((label, index) => {
			if (!label.label) 
				return `\t\t\t\t\t"text" : \t\t {\n ${label.text} \n\t\t\t\t\t\t\t\t}`;
			if (index < labelContentObjectsLength)
				return `\t\t\t\t\t"${label.label}" : \t\t${JSON.stringify(label.text.toString())},`;
			else
				return `\t\t\t\t\t"${label.label}" : \t\t${JSON.stringify(label.text.toString())}`;
		}).join("\n");

		return LabelContentObjects;
	}

	/**
	 * getFullTextContent - getLanguageContent - Return Full JSON Text Content
	 */
	getFullTextContent() {
		let textContent = this.getLanguageContent();
		var fullTextContent = `{
	"language" 		: "Selected Language English",
	"isrequired"		: "is mandatory",
	"addrow"		: "Add Row",
	"deleterow"		: "Delete Row",
	"number" 		: "#",
	"submitform" 		: "Submit",
	"chooselanguage" 	: "Choose Language",
	"validation" 		: "Validation",
	"on" 			: "On",
	"off" 			: "Off",
	"save" 			: "Save",
	"printpreview" 		: "Print Preview",
	"close" 		: "Close",
	"labels"		: {
${textContent}
				}
}`;
		return fullTextContent;
	}

}


module.exports = XSDWebFormParser;