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
class XSDWebFormParserError
{

	static reportError(error) 
	{
		console.log("\n\x1b[1m\x1b[31m" + error + "\n\x1b[0m");
        process.exit();
	}
}



module.exports = XSDWebFormParserError;