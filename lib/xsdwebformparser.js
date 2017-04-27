/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import tagParser from './xsdwebformparsertags.js';

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
            "xs:element"        :   tagParser.parseElement,
            "xs:import"         :   tagParser.parseImport,
            "xs:simpleType"     :   tagParser.parseSimpleType,
            "xs:complexType"    :   tagParser.parseComplexType,
            "xs:sequence"       :   tagParser.parseSequence,
            "xs:restriction"    :   tagParser.parseRestriction,
            "xs:annotation"     :   tagParser.parseAnnotation,
            "xs:documentation"  :   tagParser.parseDocumentation,
            "xs:enumeration"    :   tagParser.parseEnumeration,
            "xs:minInclusive"   :   tagParser.parseMinInclusive,
            "xs:maxInclusive"   :   tagParser.parseMaxInclusive,
            "xs:union"          :   tagParser.parseUnion,
            "xs:pattern"        :   tagParser.parsePattern,
            "xs:whiteSpace"     :   tagParser.parseWhiteSpace,
            "xs:minLength"      :   tagParser.parseMinLength,
            "xs:maxLength"      :   tagParser.parseMaxLength
        };

        this.showLog = true;
        tagParser.setLog(false);
    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) 
    {

        if (this.showLog) {
            console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m"); 
            console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xml.file} \x1b[0m\n`); 
            console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n"); 
        }

        // Create XML Document
        var xmlt = new XmlDocument(xml.xdata);
        xmlt.level = 0;
        this.xsdInnerParse(xmlt);

        if (this.showLog) {
            console.log("\n\x1b[2m\x1b[33m==================================================================================================================================================\n\x1b[0m"); 
        }
    }

    /**
     * xsdInnerParse - Parse inner XML Document
     * @param xmltItem
     */
    xsdInnerParse(xmltItem) 
    {
        
        if (this.showLog) 
            this.showItemLog(xmltItem);


        // Loop through Tag's childNodes
        if (xmltItem.children) {
             for (let i = 0, l = xmltItem.children.length; i < l; i++) {
                if (xmltItem.children[i].type === "element") {

                    // Parse Tag Tag
                    this.parseFunc(xmltItem.children[i].name);
                    xmltItem.children[i].xparent = xmltItem;
                    xmltItem.children[i].level = xmltItem.level + 1;

                    // if (xmltItem.children[i].name === "xs:sequence" && xmltItem.name === "xs:complexType") {
                    //     console.log( "WF-----------"+xmltItem.name);
                    // }

                    // if (xmltItem.children[i].name === "xs:element" && xmltItem.name === "xs:sequence") {
                    //     console.log( "-----------"+xmltItem.name);
                    
                    //     // if (xmltItem.parent.name === "xs:sequence") {
                    //     // console.log("AA");
                    //     // xmltItem.isHTML = true;
                    // }
                    
                    // Recursive call
                    this.xsdInnerParse(xmltItem.children[i]);
              
                }
            };
        }

    }

    /**
     * parseFunc - Parse XML Tag
     * @param item
     */
    parseFunc(item) 
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
     * @param xmltItem
     */
    showItemLog(xmltItem)
    {

        let xspace = "  ";
        for (let i = 0; i < xmltItem.level; i++) {
            xspace += "\t";
        }
        
        console.log(`${xspace}\x1b[0m\x1b[31m▓▓▓▓▓▓▓▓▓▓▓▓▓\x1b[0m`);
        process.stdout.write(`${xspace}\x1b[2m▓▓▓▓ \x1b[0m\x1b[2mL:${xmltItem.level} \x1b[2m▓▓▓▓\x1b[0m\x1b[31m⇢\x1b[0m `);

        if (xmltItem.children) {
            process.stdout.write(`\x1b[1m${xmltItem.name}`);

            if (xmltItem.attr.name) {
                process.stdout.write(` - ${xmltItem.attr.name}`);

                if (xmltItem.name === "xs:element") {

                    var txmlItem = xmltItem.toString();
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

            process.stdout.write(`\n\x1b[2m${xspace}▓▓▓▓▓▓▓▓▓▓▓▓▓`); // ${xmltItem.name} | ${xmltItem.type} | ${xmltItem.children.length} ]`);
            if (xmltItem.xparent) {
                console.log(`\x1b[32m  parent ::\x1b[1m ${xmltItem.xparent.name}\x1b[0m`);

                if (xmltItem.xparent.attr.name) {
                    console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓ \x1b[0m\x1b[36m par.name ::\x1b[1m ${xmltItem.xparent.attr.name}\x1b[0m`);
                }
            }
        } 

        if (xmltItem.level === 0) {
            console.log(" ");
        } 

        // console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓`);
        process.stdout.write(`\x1b[2m${xspace}         ▒▒`);//\n${xspace}         ▒▒\x1b[0m
        if (!tagParser.getLog()){
            console.log(" ");
        }

    }

}


module.exports = XSDWebFormParser;