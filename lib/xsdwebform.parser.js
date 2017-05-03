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

        this.xsdTagParser = new XsdTagParser();
        this.htmlTagParser = new HtmlTagParser();

        this.htmlOutput = {
            content: '',
            HTMLObjects : []
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
        this.htmlTagParser.htmlParse(htmlItem, xsdItem);
        this.htmlOutput.HTMLObjects =  this.htmlTagParser.HTMLObjects;
        this.createHTMLOutput();
        // this.htmlOutput.content = this.getHTMLOutput();

        if (this.showLog) {
            XSDWebFormParserLog.showLogs(this);
        }

    }

    /**
     * createHTMLOutput
     */
    createHTMLOutput() 
    {
        
        var html = [];

        for (let f = 0, t = this.htmlOutput.HTMLObjects.length; f < t; f++) {

            let form = this.htmlOutput.HTMLObjects[f];
            console.log("form", form);

            let groups = this.htmlOutput.HTMLObjects[f].itemObject.groups;
            console.log("groups", groups);

            console.log("groups.length", groups.length);
            for (let i = 0, l = groups.length; i < l; i++) {
                
                let group = groups[i];
                let groupObjHTML = groups[i].itemObject.htmlXML;
                let groupObjXSD = groups[i].itemObject.xsdXML;

                console.log("===");
                console.log(this.htmlTagParser.HTML_TYPES[group.type].htmlTemplate);

                // html.push(this.htmlTagParser.HTML_TYPES[group.type].htmlTemplate);
                // html[groupObjHTML.children.length + 1] = this.htmlTagParser.HTML_TYPES[group.type].htmlTemplateE;

            }

        }

        // // console.log("this.htmlOutput.HTMLObjects.length", this.htmlOutput.HTMLObjects);
        // for (let i = 0, l = this.htmlOutput.HTMLObjects.length; i < l; i++) {

        //     let group = this.htmlOutput.HTMLObjects[i];
        //     let groupObjHTML = this.htmlOutput.HTMLObjects[i].itemObject.htmlXML;
        //     let groupObjXSD = this.htmlOutput.HTMLObjects[i].itemObject.xsdXML;

        //     console.log("===");
        //     console.log(this.htmlTagParser.HTML_TYPES[group.type].htmlTemplate);

        //     html.push(this.htmlTagParser.HTML_TYPES[group.type].htmlTemplate);
        //     html[groupObjHTML.children.length + 1] = this.htmlTagParser.HTML_TYPES[group.type].htmlTemplateE;

        //     for (let i2 = 0, l2 = groupObjHTML.children.length; i2 < l2; i2++) {

        //         // console.log("\t===");
        //         // console.log(groupObjHTML.children[i2]);
        //         // console.log(groupObjHTML.children[i2]);

        //         html[((i + 1) * i2) + 1] = groupObjHTML.children[i2];
        //     }   
            
        // }

        this.htmlOutput.content = "TEST - " + html.join("\n");
    }

    /**
     * getHTML - Return HTML5 Document
     */
    getHTMLOutput() 
    {
        return this.htmlOutput.content;
    }

}


module.exports = XSDWebFormParser;