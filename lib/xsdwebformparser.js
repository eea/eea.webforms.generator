/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import tagParser from './xsdwebformparsertags.js';
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

        this.ELEMENT_TYPES = {
            "xs:element": tagParser.parseElement,
            "xs:import": tagParser.parseImport,
            "xs:simpleType": tagParser.parseSimpleType,
            "xs:complexType": tagParser.parseComplexType,
            "xs:sequence": tagParser.parseSequence,
            "xs:restriction": tagParser.parseRestriction,
            "xs:annotation": tagParser.parseAnnotation,
            "xs:documentation": tagParser.parseDocumentation,
            "xs:enumeration": tagParser.parseEnumeration,
            "xs:minInclusive": tagParser.parseMinInclusive,
            "xs:maxInclusive": tagParser.parseMaxInclusive,
            "xs:union": tagParser.parseUnion,
            "xs:pattern": tagParser.parsePattern,
            "xs:whiteSpace": tagParser.parseWhiteSpace,
            "xs:minLength": tagParser.parseMinLength,
            "xs:maxLength": tagParser.parseMaxLength
        };

        this.htmlTagParser = new HtmlTagParser();

        this.showLog = true;
        this.verbose = true;

        this.htmlTagParser.setLog(this.showLog);
        this.htmlTagParser.setVerbose((this.showLog && this.verbose));
        tagParser.setLog((this.showLog && this.verbose));

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
        this.xsdParse(xsdItem);

        if (this.showLog) {
            this.logHTML(xObject);
        }

        // Create XML Document for FORM.XML
        var htmlItem = new XmlDocument(xObject.hdata);
        htmlItem.level = 0;
        this.htmlTagParser.htmlParse(htmlItem, xsdItem);

        if (this.showLog) {
            console.log("\x1b[0m\x1b[32mHTML OBJECTS: \x1b[0m\x1b[36m"); 
            process.stdout.write(this.htmlTagParser.HTMLObjects[0].itemObject.htmlXML.attr.element);
            if (this.verbose) {
                    console.log("\x1b[0m\x1b[2m"); 
                    console.log(this.htmlTagParser.HTMLObjects);
                }
            console.log("\x1b[0m"); 
        }

        if (this.showLog) {
            console.log("\n\x1b[2m\x1b[33m==================================================================================================================================================\n\x1b[0m");
        }
    }

    /**
     * xsdParse - Parse inner XML Document
     * @param xsdItem
     */
    xsdParse(xsdItem) 
    {

        if (this.showLog)
            this.showItemLog(xsdItem);

        // Loop through Tag's childNodes
        if (xsdItem.children) {
            for (let i = 0, l = xsdItem.children.length; i < l; i++) {
                if (xsdItem.children[i].type === "element") {

                    // Parse Tag Tag
                    this.parseXSDItem(xsdItem.children[i].name);
                    xsdItem.children[i].xparent = xsdItem;
                    xsdItem.children[i].level = xsdItem.level + 1;

                    // Recursive call
                    this.xsdParse(xsdItem.children[i]);

                }
            };
        }

    }

    /**
     * parseXSDItem - Parse XML Tag
     * @param item
     */
    parseXSDItem(item) 
    {

        if ((item in this.ELEMENT_TYPES)) {
            (this.ELEMENT_TYPES[item])(item);
        } else {
            console.log(`\n************* Unknown Tag {${item}} *************\n`);
            process.stdout.write('\x07');
        }

    }
    
    /**
     * showItemLog - ShowLog
     * @param xsdItem
     */
    showItemLog(xsdItem) 
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

            process.stdout.write(`\n\x1b[2m${xspace}▓▓▓▓▓▓▓▓▓▓▓▓▓`); // ${xsdItem.name} | ${xsdItem.type} | ${xsdItem.children.length} ]`);
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

        // console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓`);
        process.stdout.write(`\x1b[2m${xspace}         ▒▒`); //\n${xspace}         ▒▒\x1b[0m
        if (!tagParser.getLog()) {
            console.log(" ");
        }

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