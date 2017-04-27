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
     * parseForm- Parse Form Tag
     * @param item
     */
    static parseForm(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    }

    /**
     * parseMultiple- Parse Multiple Tag
     * @param item
     */
    static parseMultiple(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

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
     * parseNumber- Parse Number Tag
     * @param item
     */
    static parseNumber(item) 
    {

         XSDWebFormParserHTMLTags.logTag(item);  

    } 

}


module.exports = XSDWebFormParserHTMLTags;