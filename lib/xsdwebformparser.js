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
            "xs:minLength"      :   tagParser.parseMinLength
        };

        this.showLog = true;
        // tagParser.setLog(true);
    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) 
    {
        
        // Create XML Document
        var xmlt = new XmlDocument(xml);
        xmlt.level = 0;
        this.xsdInnerParse(xmlt);

    }

    /**
     * xsdInnerParse - Parse inner XML Document
     * @param xmltItem
     */
    xsdInnerParse(xmltItem) 
    {
        
        // console.log("============================================================================\n"); 
        
        if (this.showLog) {
            
            let xspace = "";
            for (let i = 0; i < xmltItem.level; i++) {
                xspace += "\t";
            }
            
            console.log(`${xspace}░░░░░░░░░░░░░ `);
            process.stdout.write(`${xspace}░░░░ L:${xmltItem.level} ░░░░ `);

            if (xmltItem.children) {
                process.stdout.write(`\x1b[1m${xmltItem.name}`);

                if (xmltItem.attr.name != undefined) {
                         process.stdout.write(` :: ${xmltItem.attr.name}`);
                }

                console.log("\x1b[0m");

                // console.log(`\n[ =====================>---------------- ${xmltItem.name} | ${xmltItem.type} | ${xmltItem.children.length} ]`);
                if (xmltItem.xparent) {
                    console.log(`${xspace}░░░░░░░░░░░░░ \x1b[32mparent :: ${xmltItem.xparent.name}\x1b[0m`);

                    if (xmltItem.xparent.attr.name) {
                        console.log(`${xspace}░░░░░░░░░░░░░ \x1b[36mpar.name :: ${xmltItem.xparent.attr.name}\x1b[0m`);
                    }
                }
            }
            console.log(`\x1b[36m${xspace}      ▒▒\x1b[0m`);
            // process.stdout.write(`${xspace}      ░░`); 
            // console.log(`\x1b[32m${xspace}░░░░░░░░░░░░░ \x1b[0m`);
        }


        // Loop through Tag's childNodes
        if (xmltItem.children) {
             for (let i = 0, l = xmltItem.children.length; i < l; i++) {
                if (xmltItem.children[i].type === "element") {
                    // console.log(`\n[ Looking for ${xmltItem.children[i].name} ]`);
                    // Parse Tag Tag
                    this.parseFunc(xmltItem.children[i].name);
                    xmltItem.children[i].xparent = xmltItem;
                    xmltItem.children[i].level = xmltItem.level + 1;
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
        }

    }

}


module.exports = XSDWebFormParser;