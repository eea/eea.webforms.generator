/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import XsdTagParser from './xsdwebformparsertags.js';
import HtmlTagParser from './xsdwebformparserhtmltags.js';


/**
 * Class XSDWebFormParser
 * Parser for XSD Schema to HTML5
 */
class XSDWebFormParser 
{

    /**
     * Class constructor
     */
    constructor() 
    {

        this.xsdTagParser = new XsdTagParser();
        this.htmlTagParser = new HtmlTagParser();

        this.showLog = true;
        this.verbose = true;

        this.xsdTagParser.setLog((this.showLog && this.verbose));
        this.htmlTagParser.setLog(this.showLog);
        this.htmlTagParser.setVerbose((this.showLog && this.verbose));

    }

    /**
     * parse - Parse XML Document
     * @param xml
     */
    parse(xObject) 
    {

        if (this.showLog) {
           this.logXSD(xObject);
        }

        // Create XML Document for XSD
        var xsdItem = new XmlDocument(xObject.xdata);
        xsdItem.level = 0;
        if (this.showLog)
            this.xsdTagParser.xsdParse(xsdItem);


        if (this.showLog) 
            this.logHTML(xObject);
        
        // Create XML Document for FORM.XML
        var htmlItem = new XmlDocument(xObject.hdata);
        htmlItem.level = 0;
        this.htmlTagParser.htmlParse(htmlItem, xsdItem);

        if (this.showLog) {
            this.showLogs();
        }
    }


    /**
     * showLog 
     */
    showLogs(){

        if (!this.verbose) {
            console.log("");
        }
        process.stdout.write("\x1b[0m\x1b[32mHTML OBJECTS: \x1b[0m\x1b[36m\n"); 
        process.stdout.write(this.htmlTagParser.HTMLObjects[0].itemObject.htmlXML.attr.element);
        if (this.verbose) {
                console.log("\x1b[0m\x1b[2m"); 
                console.log(this.htmlTagParser.HTMLObjects);
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
    logXSD(xObject){

        console.log("\n\n\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
        console.log(`                                                             \x1b[1m\x1b[36mFILE : ${xObject.xfile} \x1b[0m\n`);
        console.log("\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

    }

    /**
     * logHTML 
     * @param xObject
     */
    logHTML(xObject){

        console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
        console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xObject.hfile} \x1b[0m\n`);
        console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

    }

}


module.exports = XSDWebFormParser;