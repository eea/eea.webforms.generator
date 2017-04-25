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
     * Open .xsd file and read the contents
     */
    constructor(xsdFile) 
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
            "xs:union"          :   tagParser.parseUnion
        };
    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) 
    {
        // Create XML Document
        var xmlt = new XmlDocument(xml);
        xmlt.eachChild((item, index) => {
            console.log(`\n\n============================================================================\n\n |||||||||||| ${item.name} :: ${item.attr.name} ||||||||||||`);
            /*console.log("\n==> The item tag started at pos %s and the Tag ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
                        item.startTagPosition, item.line, item.column, item.position);*/
            // Parse Tag Tag
            this.parseFunc(item.name);
            this.xsdInnerParse(item);
        });

    }

    /**
     * xsdInnerParse - Parse inner XML Document
     * @param xmltItem
     */
    xsdInnerParse(xmltItem) 
    {
        
        // if (xmltItem.children)
        //     console.log(`\n[ =====================>---------------- ${xmltItem.name} | ${xmltItem.type} | ${xmltItem.children.length} ]`);

        // Loop through Tag's childNodes
        if (xmltItem.children) {
             for (var i = 0, l = xmltItem.children.length; i < l; i++) {
                if (xmltItem.children[i].type === "element") {
                    // console.log(`\n[ Looking for ${xmltItem.children[i].name} ]`);
                    // Parse Tag Tag
                    this.parseFunc(xmltItem.children[i].name);
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