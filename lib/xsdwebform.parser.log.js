/**
 * @file xsdwebform.parser.log.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

/**
 * Class XSDWebFormParserLog
 * Parser for XSD Schema Tags
 * Static
 */
class XSDWebFormParserLog
{

	/**
     * showLog 
     */
    static showLogs(sender)
    {

        if (!sender.verbose) {
            console.log("");
        }
        process.stdout.write("\x1b[0m\x1b[32mHTML OBJECTS: \x1b[0m\x1b[36m\n"); 
        process.stdout.write(sender.htmlTagParser.HTMLObjects[0].itemObject.htmlXML.attr.element);
        if (sender.verbose) {
                console.log("\x1b[0m\x1b[2m"); 
                console.log(sender.htmlOutput.HTMLObjects);
            } else {
                  console.log("");
            }
        console.log("\x1b[0m"); 
    
        console.log(new Date());
        console.log("\n\x1b[2m\x1b[33m==================================================================================================================================================\n\x1b[0m");

    }

    /**
     * logXSD 
     * @param xObject
     */
    static logXSD(xObject)
    {

        console.log("\n\n\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
        console.log(`                                                             \x1b[1m\x1b[36mFILE : ${xObject.xfile} \x1b[0m\n`);
        console.log("\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

    }

    /**
     * logHTML 
     * @param xObject
     */
    static logHTML(xObject)
    {

        console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
        console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xObject.hfile} \x1b[0m\n`);
        console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

    }

	/**
     * showItemLog - ShowLog
     * @param xsdItem
     */
    static showItemLog(xsdItem) 
    {

        let xspace = "  ";
        for (let i = 0; i < xsdItem.level; i++) {
            xspace += "\t";
        }

        console.log(`${xspace}\x1b[0m\x1b[31m▓▓▓▓▓▓▓▓▓▓▓▓▓\x1b[0m`);
        process.stdout.write(`${xspace}\x1b[2m▓▓▓▓ \x1b[0m\x1b[2mL:${xsdItem.level} \x1b[2m▓▓▓▓\x1b[0m\x1b[31m⇢\x1b[0m `);

        if (xsdItem.children) {
            process.stdout.write(`\x1b[1m${xsdItem.name}`);

            if (xsdItem.attr.name) {
                process.stdout.write(` - ${xsdItem.attr.name}`);

                if (this.verbose) {
                    if (xsdItem.name === "xs:element") {    

                        var txmlItem = xsdItem.toString();
                        txmlItem = txmlItem.split("\n").join("");
                        txmlItem = txmlItem.split("<").join(xspace + `\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓\t \x1b[2m<`);

                        let pos1 = txmlItem.indexOf("<xs:documentation>");
                        if (pos1 > 0 ){
                            var pos2 = txmlItem.indexOf("</xs:documentation>");
                            txmlItem = txmlItem.substring(0, pos1) + "<xs:documentation> ..." + txmlItem.substring(pos2);
                        }

                        process.stdout.write(`\x1b[2m${txmlItem}`);
                    }
                }
            }

            process.stdout.write(`\n\x1b[2m${xspace}▓▓▓▓▓▓▓▓▓▓▓▓▓`); 
            if (xsdItem.xparent) {
                console.log(`\x1b[32m  parent ::\x1b[1m ${xsdItem.xparent.name}\x1b[0m`);

                if (xsdItem.xparent.attr.name) {
                    console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓ \x1b[0m\x1b[36m par.name ::\x1b[1m ${xsdItem.xparent.attr.name}\x1b[0m`);
                }
            }
        }

        if (xsdItem.level === 0) {
            console.log(" ");
        }

        process.stdout.write(`\x1b[2m${xspace}         ▒▒`); 
        // if (!sender.showLog) {
        //     console.log(" ");
        // }

    }

    /**
     * logXsdTag - Log XSD Element Tag
     * @param item
     */
    static logXsdTag(item) 
    {
    	console.log(`\x1b[0m\x1b[31m⇣\x1b[2m Found Tag \x1b[33m${item}\x1b[0m`);
    }

    /**
     * logHtmlTag - Log HTML Element Tag
     * @param item
     */
    static logHtmlTag(item, sender) 
    {
        if (sender.verbose) {
            console.log(`\x1b[0m\x1b[31m⇣\n\x1b[2mParsing HTML Tag ⇢ \x1b[33m${item}\x1b[0m`);
            console.log("\x1b[2m" + sender.HTML_TYPES[item].htmlTemplate + "\x1b[0m\n");
        }
    }

}


module.exports = XSDWebFormParserLog;