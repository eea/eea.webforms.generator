/**
 * @file xsdwebform.parser.test.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

/**
 * Class XSDWebFormParserTest
 * Parser Result Testing
 * Static
 */
class XSDWebFormParserTest {
	/**
	 * Class constructor
	 */
	constructor() {
		this.showLog = false;
		this.verbose = false;
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