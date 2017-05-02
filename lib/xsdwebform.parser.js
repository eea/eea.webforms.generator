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
class XSDWebFormParser 
{

    /**
     * Class constructor
     * @param showlog
     * @param verbose
     */
    constructor(showlog = false, verbose = false) 
    {

        this.htmlOutput = {
            content: "test html",
            HTMLObjects : []
        };

        this.xsdTagParser = new XsdTagParser();
        this.htmlTagParser = new HtmlTagParser();

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
    parse(xObject) 
    {

        if (this.showLog) {
           XSDWebFormParserLog.logXSD(xObject);
        }

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
        this.htmlOutput.HTMLObjects = this.htmlTagParser.htmlParse(htmlItem, xsdItem);

        if (this.showLog) {
            XSDWebFormParserLog.showLogs(sender);
        }

    }

    /**
     * getHTML -Return HTML5 Document
     */
    getHTML() 
    {
        return this.htmlOutput.content;
    }

}


module.exports = XSDWebFormParser;