/**
 * @file xsdwebform.parser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import XsdTagParser from './xsdwebform.parser.tags.js';
import HtmlTagParser from './xsdwebform.parser.htmltags.js';
import XSDWebFormParserLog from './xsdwebform.parser.log.js'

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
	constructor(showlog = false, verbose = false) {
		this.xsdTagParser = new XsdTagParser();
		this.htmlTagParser = new HtmlTagParser();

		this.htmlOutput = {
			content: '',
			HTMLObjects: []
		};

		this.showLog = showlog;
		this.verbose = verbose;

		this.xsdTagParser.setLog((this.showLog && this.verbose));
		this.htmlTagParser.setLog(this.showLog);
		this.htmlTagParser.setVerbose((this.showLog && this.verbose));
	}

	/**
	 * parse - Parse XML Document
	 * @param xml
	 */
	parse(xObject) {
		if (this.showLog)
			XSDWebFormParserLog.logXSD(xObject);

		// Create XML Document for XSD
		var xsdItem = new XmlDocument(xObject.xdata);
		xsdItem.level = 0;

		if (this.showLog)
			this.xsdTagParser.xsdParse(xsdItem);

		if (this.showLog)
			XSDWebFormParserLog.logHTML(xObject);

		// Create XML Document for FORM.XML
		var htmlItem = new XmlDocument(xObject.hdata);
		htmlItem.level = 0;
		this.htmlTagParser.htmlParse(htmlItem, xsdItem);
		this.htmlOutput.HTMLObjects = this.htmlTagParser.HTMLObjects;
		this.createHTMLOutput();

		if (this.showLog)
			XSDWebFormParserLog.showLogs(this);
	}

	/**
	 * createHTMLOutput
	 */
	createHTMLOutput() {
		var html = [];

		for (let f = 0, t = this.htmlOutput.HTMLObjects.length; f < t; f++) {
			let form = this.htmlOutput.HTMLObjects[f];
			let formHtml = [];

			html.splice(html.length + 1, 0, "\t\t" + form.itemObject.tagToHtml());
			let groups = this.htmlOutput.HTMLObjects[f].itemObject.groups;
			html.splice(groups.length + html.length + 1, 0, "\t\t</" + form.itemObject.tag + ">");

			for (let i = 0, l = groups.length; i < l; i++) {
				let group = groups[i];
				formHtml.push("\t\t\t" + group.itemObject.tagToHtml());

				for (let i2 = 0, l2 = groups[i].itemObject.items.length; i2 < l2; i2++) {
					formHtml.push("\t\t\t\t<div class=\"formitem\">" + groups[i].itemObject.items[i2] + "</div>");
				}

				formHtml.push("\t\t\t</" + group.itemObject.tag + ">");

				if (group.itemObject.append)
					formHtml.push("\t\t\t" + group.itemObject.append);
			}

			if (form.itemObject.append)
				formHtml.push("\t\t\t" + form.itemObject.append);

			html.splice(html.length - 1, 0, formHtml.join('\n\n'));
		}
		this.htmlOutput.content = html.join("\n\n");
	}

	/**
	 * getHTMLOutput - Return HTML5 Document
	 */
	getHTMLOutput() {
		return this.htmlOutput.content ;
	}

	/**
	 * getTextContent - Return Text Content 
	 */
	getTextContent() {
		var textContentObjectsLength = this.htmlTagParser.TextContentObjects.length - 1;
		return this.htmlTagParser.TextContentObjects.map((label, index) => {
			if (index < textContentObjectsLength)
				return `\t\t\t\t\t\t\t"${label.label}" : "${label.text}",`;
			else
				return `\t\t\t\t\t\t\t"${label.label}" : "${label.text}"`;
		}).join("\n");
	}

	/**
	 * getFullTextContent - getTextContent - Return Full JSON Text Content
	 */
	getFullTextContent() {
		let textContent = this.getTextContent();
		var fullTextContent = `{
			"language" 		: "Selected Language English",
			"greeting" 		: "Welcome" ,
			"pagetitle"		: "Page Title",
			"formtitle"		: "Form Title",
			"number" 		: "#",
			"submitform" 		: "Submit",
			"labels "			: {
${textContent}
						}
}`;
		return fullTextContent;
	}

}


module.exports = XSDWebFormParser;