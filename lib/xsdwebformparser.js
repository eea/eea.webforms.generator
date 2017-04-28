/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import tagParser from './xsdwebformparsertags.js';
import htmlTagParser from './xsdwebformparserhtmltags.js';


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

        this.HTML_TYPES = {
            "form": htmlTagParser.parseForm,
            "group": htmlTagParser.parseGroup,
            "input": htmlTagParser.parseInput,
            "text": htmlTagParser.parseText,
            "number": htmlTagParser.parseNumber,
            "date": htmlTagParser.parseDate,
            "select": htmlTagParser.parseSelect
        };

        this.showLog = true;
        this.verbose = true;

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
        this.htmlParse(htmlItem, xsdItem);

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
     * htmlParse - Parse inner XML Document
     * @param htmlItem
     */
    htmlParse(htmlItem, xsdItem) 
    {

      //   xsdItem = new XmlDocument(`<a><b><xs:sequence>
      //     <xs:element name="AEA" type="xs:integer" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="TransferringMemberState" type="EUCountryName" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="AcquiringMemberState" type="EUCountryName" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="AEA-Price" type="xs:decimal" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="TransferAgreementDate" type="xs:date" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="ExpectedTransactionYear" type="TransactionYear" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="Other" type="xs:string" minOccurs="1" maxOccurs="1"/>
      // </xs:sequence></b></a>`);
        
        // Loop through Tag's childNodes
        for (let i = 0, l = htmlItem.children.length; i < l; i++) {

            if (htmlItem.children[i].type === "element") {
                // console.log("-----------" + htmlItem.children[i].name);
                if (this.showLog) {
                    process.stdout.write(`\x1b[0m\x1b[31mHTML => \x1b[0m\x1b[33m${htmlItem.children[i].name}`);
                }

                if (htmlItem.children[i].attr.element) {

                    // if (htmlItem.children[i].name === "group") {

                    //     var groupObject = {
                    //         name : htmlItem.children[i].attr.element,
                    //         htmlXML : htmlItem.children[i],
                    //         xsdXML :  this.getXSDComplexByGroupTag(htmlItem.children[i].attr.element, xsdItem)
                    //     }
                    //     htmlTagParser.HTMLObjects.push({ type : "group", itemObject : groupObject });
                        
                    // }
                    
                    if (this.showLog) {
                        process.stdout.write(` :: \x1b[1m\x1b[33m${htmlItem.children[i].attr.element} \x1b[0m`);
                    }
                }

                if (this.showLog) {
                    console.log("\n");
                }

                this.parseHTMLItem(htmlItem.children[i], xsdItem);
                this.htmlParse(htmlItem.children[i], xsdItem);
            }
        };

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
     * parseHTMLItem - Parse HTML Tag
     * @param item
     * @param xsdItem
     */
    parseHTMLItem(item, xsdItem) 
    {

        if ((item.name in this.HTML_TYPES)) {
            (this.HTML_TYPES[item.name])(item, xsdItem);
        } else {
            console.log(`\n************* Unknown HTML Tag {${item}} *************\n`);
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