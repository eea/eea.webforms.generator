/**
 * @file xsdwebform.parser.tags.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

import XSDWebFormParserLog from './xsdwebform.parser.log.js'

/**
 * Class XSDWebFormParserTags
 * Parser for XSD Schema Tags
 * Static
 */
class XSDWebFormParserTags
{

    /**
     * Class constructor
     */
    constructor() {

        this.ELEMENT_TYPES = {
            "xs:element"        : this.parseElement,
            "xs:import"         : this.parseImport,
            "xs:simpleType"     : this.parseSimpleType,
            "xs:complexType"    : this.parseComplexType,
            "xs:sequence"       : this.parseSequence,
            "xs:restriction"    : this.parseRestriction,
            "xs:annotation"     : this.parseAnnotation,
            "xs:documentation"  : this.parseDocumentation,
            "xs:enumeration"    : this.parseEnumeration,
            "xs:minInclusive"   : this.parseMinInclusive,
            "xs:maxInclusive"   : this.parseMaxInclusive,
            "xs:union"          : this.parseUnion,
            "xs:pattern"        : this.parsePattern,
            "xs:whiteSpace"     : this.parseWhiteSpace,
            "xs:minLength"      : this.parseMinLength,
            "xs:maxLength"      : this.parseMaxLength
        };    

        this.showLog = false;
    }

    /**
     * xsdParse - Parse inner XML Document
     * @param xsdItem
     */
    xsdParse(xsdItem) 
    {

        if (this.showLog)
            XSDWebFormParserLog.showItemLog(xsdItem);

        // Loop through Tag's childNodes
        if (xsdItem.children) {
            for (let i = 0, l = xsdItem.children.length; i < l; i++) {
                if (xsdItem.children[i].type === "element") {

                    try {
                        // Parse Tag Tag
                        this.parseXSDItem(xsdItem.children[i].name);
                        xsdItem.children[i].xparent = xsdItem;
                        xsdItem.children[i].level = xsdItem.level + 1;

                        // Recursive call
                        this.xsdParse(xsdItem.children[i]);
                    } catch(err) {
                        XSDWebFormParserError.reportError(err);
                    }
                    
                }
            }
        }

    }

    /**
     * parseXSDItem - Parse XML Tag
     * @param item
     */
    parseXSDItem(item) 
    {

        if ((item in this.ELEMENT_TYPES)) {
            (this.ELEMENT_TYPES[item])(item, this);
        } else {
            console.log(`\n************* Unknown Tag {${item}} *************\n`);
            process.stdout.write('\x07');
        }

    }

    /**
     * setLog - Show Log 
     * @param bool
     */
    setLog(bool) 
    {
        this.showLog = bool;
    }

    /**
     * getLog - Show Log 
     */
    getLog() 
    {
        return this.showLog;
    }

    /**
     * parseElement- Parse Element Tag
     * @param item
     */
    parseElement(item, sender) 
    {
        if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item);  
    } 

    /**
     * parseImport- Parse Import Tag
     * @param item
     */
    parseImport(item, sender) 
    {

       if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseSimpleType - Parse SimpleType Tag
     * @param item
     */
    parseSimpleType(item, sender)
    {

       if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseComplexType - Parse ComplexType Tag
     * @param item
     */
    parseComplexType(item, sender)
    {

       if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseSequence - Parse Sequence Tag
     * @param item
     */
    parseSequence(item, sender)
    {

       if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseRestriction - Parse Restriction Tag
     * @param item
     */
    parseRestriction(item, sender)
    {

       if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseAnnotation - Parse Annotation Tag
     * @param item
     */
    parseAnnotation(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseDocumentation - Parse Documentation Tag
     * @param item
     */
    parseDocumentation(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    } 

    /**
     * parseEnumeration - Parse Enumeration Tag
     * @param item
     */
    parseEnumeration(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseMinInclusive - Parse MinInclusive Tag
     * @param item
     */
    parseMinInclusive(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseMaxInclusive - Parse MaxInclusive Tag
     * @param item
     */
    parseMaxInclusive(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseUnion - Parse Union Tag
     * @param item
     */
    parseUnion(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parsePattern - Parse Pattern Tag
     * @param item
     */
    parsePattern(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseWhiteSpace - Parse WhiteSpace Tag
     * @param item
     */
    parseWhiteSpace(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseMinLength - Parse MinLength Tag
     * @param item
     */
    parseMinLength(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    /**
     * parseMaxLength - Parse MaxLength Tag
     * @param item
     */
    parseMaxLength(item, sender)
    {

      if (sender.showLog)
            XSDWebFormParserLog.logXsdTag(item); 

    }

    
}


module.exports = XSDWebFormParserTags;