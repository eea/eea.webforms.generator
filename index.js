/**
 * @file index.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

'use strict';

import { XmlDocument } from 'xmldoc';
import fs from 'fs';

/**
 * Class XSDWebForm
 * XSD Schema to HTML5
 */
class XSDWebForm 
{

    /**
     * Class constructor
     * Open .xsd file and read the contents
     */
    constructor(xsdFile) 
    {

        this.ELEMENT_TYPES = {
        	"xs:element" 		: 	this.parseElement,
            "xs:import"			: 	this.parseImport,
            "xs:simpleType"		: 	this.parseSimpleType,
            "xs:complexType"	: 	this.parseComplexType,
            "xs:sequence"		: 	this.parseSequence,
            "xs:restriction"	: 	this.parseRestriction,
            "xs:annotation"		: 	this.parseAnnotation,
            "xs:documentation"	: 	this.parseDocumentation,
            "xs:enumeration"	: 	this.parseEnumeration,
        };

        new Promise((resolve, reject) => {
            fs.readFile(xsdFile, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            });
        }).then((res) => {
            this.xsdParse(res);
        });

    }

    /**
     * xsdParse - Parse XML Document
     * @param xml
     */
    xsdParse(xml) 
    {

        var xmlt = new XmlDocument(xml);
        let parent = this;
        xmlt.eachChild((item, index) => {
            console.log(`\n\n============================================================================\n\n |||||||||||| ${item.name} :: ${item.attr.name} ||||||||||||`);
            /*console.log("\n==> The item tag started at pos %s and the Tag ended at line %s, col %s, pos %s.\n-------------------------------------------------------------------------------\n", 
            			item.startTagPosition, item.line, item.column, item.position);*/
            // Parse Tag Tag
	    	parent.parseFunc(item.name);
			this.xsdInnerParse(item);
        });

    }

    /**
     * xsdInnerParse - Parse inner XML Document
     * @param xml
     */
    xsdInnerParse(xmltItem) 
    {
    	
    	if (xmltItem.children)
    		console.log(`\n[ =====================>---------------- ${xmltItem.name} | ${xmltItem.type} | ${xmltItem.children.length} ]`);

    	let parent = this;
    	// Loop through Tag's childNodes
    	if (xmltItem.children) {
	    	 for (var i = 0, l = xmltItem.children.length; i < l; i++) {
	    	 	 if (xmltItem.children[i].type === "element") {
	    				// console.log(`\n[ Looking for ${xmltItem.children[i].name} ]`);
	    				// Parse Tag Tag
	    				parent.parseFunc(xmltItem.children[i].name);
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

        console.log("\n\tFound Tag {EL}} : =====> " + item);

    } 

    /**
     * parseImport- Parse Import Tag
     * @param item
     */
    parseImport(item) 
    {

        console.log("\n\tFound Tag {IM}} : =====> " + item);

    }

    /**
     * parseSimpleType - Parse SimpleType Tag
     * @param item
     */
    parseSimpleType(item) 
    {

        console.log("\n\tFound Tag {ST}} : =====> " + item);

    }

    /**
     * parseComplexType - Parse ComplexType Tag
     * @param item
     */
    parseComplexType(item)
    {

        console.log("\n\tFound Tag {CT}} : =====> " + item);

    }

    /**
     * parseSequence - Parse Sequence Tag
     * @param item
     */
    parseSequence(item) 
    {

        console.log("\n\tFound Tag {SQ}} : =====> " + item);

    }

    /**
     * parseRestriction - Parse Restriction Tag
     * @param item
     */
    parseRestriction(item) 
    {

        console.log("\n\tFound Tag {RS}} : =====> " + item);

    }

    /**
     * parseAnnotation - Parse Annotation Tag
     * @param item
     */
    parseAnnotation(item) 
    {

        console.log("\n\tFound Tag {AN}} : =====> " + item);

    }

    /**
     * parseDocumentation - Parse Documentation Tag
     * @param item
     */
    parseDocumentation(item) 
    {

        console.log("\n\tFound Tag {DC}} : =====> " + item);

    } 

    /**
     * parseEnumeration - Parse Enumeration Tag
     * @param item
     */
    parseEnumeration(item) 
    {

        console.log("\n\tFound Tag {EN}} : =====> " + item);

    }

}


/**
 * main - Init
 * @param args
 */
function main(args) 
{

    // Input file variable
    var xsdFile = null;

    // Check for [-f file] input
    args.forEach(
        (item, index) => {
            if (item == '-f') {
                xsdFile = args[index + 1];
                return;
            }
        }
    );

    // If not file input
    if (!xsdFile) {
        xsdFile = "test.xsd";
    }

    // Call XSDWebForm Class
    const xsdwf = new XSDWebForm(xsdFile);
}

main(process.argv);