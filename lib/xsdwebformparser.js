/**
 * @file xsdwebformparser.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';


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
            "xs:enumeration"    :   this.parseEnumeration
        };
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

}

module.exports = XSDWebFormParser;