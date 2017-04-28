/**
 * @file xsdwebformparsertags.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */


/**
 * Class XSDWebFormParserTags
 * Parser for XSD Schema Tags
 * Static
 */
class XSDWebFormParserHTMLTags
{
    /**
     * setLog - Show Log 
     * @param bool
     */
    static setLog(bool) 
    {
        this.showLog = bool;
    }

    /**
     * getLog - Show Log 
     */
    static getLog() 
    {
        return this.showLog;
    }

    /**
     * logTag - Log Element Tag
     * @param item
     */
    static logTag(item) 
    {
        if (this.showLog) 
            console.log(`\x1b[0m\x1b[31m⇣\x1b[2m Found Tag \x1b[33m${item}\x1b[0m`);
    }

    /**
     * getXSDComplexByGroupTag - Find and get XSD complexType Type filtered by Group Tag name
     * @param xsdItemName
     * @param xsdItem
     */
    static getXSDComplexByGroupTag(xsdItemName, xsdItem) 
    {

        var XSDWFormComplexItems = xsdItem.childWithAttribute("name", xsdItemName).childNamed("xs:sequence");
        if (!XSDWFormComplexItems) return "";
        
        return XSDWFormComplexItems;

    }


    /**
     * parseForm- Parse Form Tag
     * @param item
     */
    static parseForm(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item.name);  

    }

    /**
     * parseGroup- Parse Group Tag
     * @param item
     */
    static parseGroup(item, xsdItem) 
    {

         XSDWebFormParserHTMLTags.logTag(item.name);  

        var groupObject = {
                    name : item.attr.element,
                    htmlXML : item,
                    xsdXML :  XSDWebFormParserHTMLTags.getXSDComplexByGroupTag(item.attr.element, xsdItem)
                }
        XSDWebFormParserHTMLTags.HTMLObjects.push({ type : "group", itemObject : groupObject });

    } 

    /**
     * parseInput- Parse Input Tag
     * @param item
     */
    static parseInput(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

    /**
     * parseText- Parse Text Tag
     * @param item
     */
    static parseText(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

    /**
     * parseNumber- Parse Number Tag
     * @param item
     */
    static parseNumber(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

    /**
     * parseDate- Parse Date Tag
     * @param item
     */
    static parseDate(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

    /**
     * parseSelect- Parse Select Tag
     * @param item
     */
    static parseSelect(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

}

XSDWebFormParserHTMLTags.HTMLObjects = [];

module.exports = XSDWebFormParserHTMLTags;