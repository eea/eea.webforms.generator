/**
 * @file xsdwebform.parser.error.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */


/**
 * Class XSDWebFormParserError
 * Error log for XSD Schema Tags
 * Static
 */
class XSDWebFormParserError {

	static reportError(error, item, dontex = false) {

		if (!dontex)
			console.log("\n\x1b[1m\x1b[31m" + error + "\x1b[0m");

		if (item)
			console.log(`\x1b[0m\x1b[37mline: ${item.line}, colum: ${item.column}, position: ${item.position}\n\x1b[0m`);

		if (!dontex)
			process.exit();
		else
			return true;
	}
}


module.exports = XSDWebFormParserError;