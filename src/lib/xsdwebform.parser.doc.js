/**
 * @file xsdwebform.parser.doc.js
 * XSD/Web Form Documentation
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

/**
 * Class XSDWebFormParserDoc
 * Parser for XSD to Doc
 */
class XSDWebFormParserDoc {
	/**
	 * Class constructor
	 */
	constructor() {
		this.showLog = false;
		this.verbose = false;
	}

	/**
	 * createDocOutput
	 */
	createDocOutput(htmlItem) {
		var output = ``;

		// Loop through Tag's childNodes
		let page = htmlItem.childNamed("page")
		output += `<h1>${page.attr.title}</h1><br><br><br>`;
		let forms = page.childrenNamed("form");
		for (let fi = 0, fl = forms.length; fi < fl; fi++) {
			output += `Form: <h2>${forms[fi].attr.title}</h2>\n`;
			let groups = forms[fi].childrenNamed("group");
			for (let gi = 0, gl = groups.length; gi < gl; gi++) {
				for (let i = 0, l = groups[gi].children.length; i < l; i++) {
					if (groups[gi].children[i].type === "element" && !groups[gi].children[i].inactive) {
						output += `<br><br><h3>${groups[gi].children[i].label || groups[gi].children[i].attr.element}</h3>\<br>`;						
						if (groups[gi].children[i].xsdAttrs) {
							output += `<b>Definition:</b> ${groups[gi].children[i].xsdAttrs.src.Definition || ""}<br><br>`;
							output += `<b>Methodology:</b> ${groups[gi].children[i].xsdAttrs.src.Methodology || ""}<br>`;
						}
					}
				}
			}
		}

		return ${output};
	}


	/**
	 * setLogger
	 * @param logger
	 */
	setLogger(logger) {
		this.logger = logger;
	}
	
	/**
	 * setLog  - Show Log
	 * @param bool
	 */
	setLog(bool) {
		this.showLog = bool;
	}

	/**
	 * setVerbose - Show Log verbose
	 * @param bool
	 */
	setVerbose(bool) {
		this.verbose = bool;
	}

	/**
	 * getLog - Show Log
	 */
	getLog() {
		return this.showLog;
	}

	/**
	 * getLog - Show Log
	 */
	getVerbose() {
		return this.verbose;
	}
	
}


module.exports = XSDWebFormParserDoc;