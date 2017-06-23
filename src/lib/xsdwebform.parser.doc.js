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
		let forms = htmlItem.childNamed("page").childrenNamed("form");
		for (let fi = 0, fl = forms.length; fi < fl; fi++) {
			let groups = forms[fi].childrenNamed("group");
			for (let gi = 0, gl = groups.length; gi < gl; gi++) {
				for (let i = 0, l = groups[gi].children.length; i < l; i++) {
					if (groups[gi].children[i].type === "element") {
						output += `\t${groups[gi].children[i].label || groups[gi].children[i].attr.element} `;						
						if (groups[gi].children[i].xsdAttrs) {
							output += `Definition: ${groups[gi].children[i].xsdAttrs.src.Definition || ""}\n`;
							output += `Methodology: ${groups[gi].children[i].xsdAttrs.src.Methodology || ""}\n`;
						}
					}
				}
			}
		}

		return `${output}`;

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