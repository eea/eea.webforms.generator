/**
 * @file xsdwebform.parser.test.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

import wcag from 'wcag';

/**
 * Class XSDWebFormParserTest
 * Parser Result Testing
 * Static
 */
class XSDWebFormParserTest {
	/**
	 * Class constructor
	 * @param baseFileName
	 * @param showLog
	 * @param verbose
	 */
	constructor(baseFileName, showLog, verbose) {
		this.baseFileName = baseFileName;
		this.showLog = showLog;
		this.verbose = verbose;

		this.acblt = { 
			options : {
				id: 'cb8b45b1bf19ff2d3c5a7f270e571e7acc055084',
				uri: 'http://localhost:3001/' + this.baseFileName,
				guide: 'WCAG2-AA'
			}
		};
	}

	/**
	 * test
	 * @param logger
	 */
	test() {
		return new Promise( (resolve, reject) => {
			wcag(this.acblt.options, function(error, data) {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});
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


module.exports = XSDWebFormParserTest;