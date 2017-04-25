/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';

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
            "xs:element"        :   this.parseElement,
            "xs:import"         :   this.parseImport,
            "xs:simpleType"     :   this.parseSimpleType,
            "xs:complexType"    :   this.parseComplexType,
            "xs:sequence"       :   this.parseSequence,
            "xs:restriction"    :   this.parseRestriction,
            "xs:annotation"     :   this.parseAnnotation,
            "xs:documentation"  :   this.parseDocumentation,
            "xs:enumeration"    :   this.parseEnumeration,
            "xs:minInclusive"   :   this.parseMinInclusive,
            "xs:maxInclusive"   :   this.parseMaxInclusive,
            "xs:union"          :   this.parseUnion
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

    /**
     * parseElement- Parse Element Tag
     * @param item
     */
    parseElement(item) 
    {
        
        console.log("\n\tFound Tag : =====> " + item);

    } 

    /**
     * parseImport- Parse Import Tag
     * @param item
     */
    parseImport(item) 
    {

        console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseSimpleType - Parse SimpleType Tag
     * @param item
     */
    parseSimpleType(item) 
    {

        console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseComplexType - Parse ComplexType Tag
     * @param item
     */
    parseComplexType(item)
    {

        console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseSequence - Parse Sequence Tag
     * @param item
     */
    parseSequence(item) 
    {

        console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseRestriction - Parse Restriction Tag
     * @param item
     */
    parseRestriction(item) 
    {

        console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseAnnotation - Parse Annotation Tag
     * @param item
     */
    parseAnnotation(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseDocumentation - Parse Documentation Tag
     * @param item
     */
    parseDocumentation(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    } 

    /**
     * parseEnumeration - Parse Enumeration Tag
     * @param item
     */
    parseEnumeration(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseMinInclusive - Parse MinInclusive Tag
     * @param item
     */
    parseMinInclusive(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseMaxInclusive - Parse MaxInclusive Tag
     * @param item
     */
    parseMaxInclusive(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    }

    /**
     * parseUnion - Parse Union Tag
     * @param item
     */
    parseUnion(item) 
    {

       console.log("\n\tFound Tag : =====> " + item);

    }

}

module.exports = XSDWebFormParser;