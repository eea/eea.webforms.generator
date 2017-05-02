/**
 * @file xsdwebform.parser.htmltags.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

 import XSDWebFormParserLog from './xsdwebform.parser.log.js'

/**
 * Class XSDWebFormParserHTMLTags
 * Parser for XSD Schema Tags
 * Static
 */
class XSDWebFormParserHTMLTags
{

    /**
     * Class constructor
     */
    constructor(){
        
        this.HTML_TYPES = {
            "form": {
                        fn              : this.parseForm,
                        htmlTemplate    : "<form>${data}</form>"
                    },
            "group": {
                        fn              : this.parseGroup,
                        htmlTemplate    : "<fieldset>${data}</fieldset>"
                    },
            "input": {
                        fn              : this.parseInput,
                        htmlTemplate    : "<input type=\"text\">"
                    },
            "text": {
                        fn              : this.parseText,
                        htmlTemplate    : "<textarea></textarea>"
                    },
            "number": {
                        fn              : this.parseNumber,
                        htmlTemplate    : "<input type=\"number\">"
                    },
            "date": {
                        fn              : this.parseDate,
                        htmlTemplate    : "<input type=\"date\">"
                    },
            "select": {
                        fn              : this.parseSelect,
                        htmlTemplate    : "<select></select>"
                    }
        };

        this.HTMLObjects = [];
        this.showLog = false;
        this.verbose = false;
    }

    /**
     * htmlParse - Parse inner XML Document
     * @param htmlItem
     * @param xsdItem
     * @returns HTMLObjects[]
     */
    htmlParse(htmlItem, xsdItem) 
    {
        // Loop through Tag's childNodes
        for (let i = 0, l = htmlItem.children.length; i < l; i++) {

            if (htmlItem.children[i].type === "element") {

                if (this.showLog) {
                    process.stdout.write(`\x1b[0m\x1b[31mHTML => \x1b[0m\x1b[33m${htmlItem.children[i].name}`);
                    
                    if (htmlItem.children[i].attr.name) {
                        process.stdout.write(` :: \x1b[1m\x1b[33m${htmlItem.children[i].attr.name} \x1b[0m`);
                    }

                    if (htmlItem.children[i].attr.element) {
                       process.stdout.write(` :: \x1b[1m\x1b[33m${htmlItem.children[i].attr.element} \x1b[0m`);
                    }
                    console.log("");
                }

                this.parseHTMLItem(htmlItem.children[i], xsdItem);
                this.htmlParse(htmlItem.children[i], xsdItem);

            }
        };

        return this.HTMLObjects;

    }

    /**
     * parseHTMLItem - Parse HTML Tag
     * @param item
     * @param xsdItem
     */
    parseHTMLItem(item, xsdItem) 
    {

        if ((item.name in this.HTML_TYPES)) {
            (this.HTML_TYPES[item.name].fn)(item, xsdItem, this);
        } else {
            console.log(`\n************* Unknown HTML Tag {${item.name}} *************\n`);
            process.stdout.write('\x07');
        }

    }

    /**
     * getXSDComplexByGroupTag - Find and get XSD complexType Type filtered by Group Tag name
     * @param xsdItemName
     * @param xsdItem
     */
    getXSDComplexByGroupTag(xsdItemName, xsdItem) 
    {

        var XSDWFormComplexItems = xsdItem.childWithAttribute("name", xsdItemName).childNamed("xs:sequence");
        if (!XSDWFormComplexItems) return "";
        
        return XSDWFormComplexItems;

    }

    /**
     * parseForm- Parse Form Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseForm(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

    }

    /**
     * parseGroup- Parse Group Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseGroup(item, xsdItem, sender)  
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  
        
        var groupObject = {
                    name : item.attr.element,
                    htmlXML : item,
                    xsdXML :  sender.getXSDComplexByGroupTag(item.attr.element, xsdItem)
                }
        sender.HTMLObjects.push({ type : "group", itemObject : groupObject });

    } 

    /**
     * parseInput- Parse Input Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseInput(item, xsdItem, sender)
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

    } 

    /**
     * parseText- Parse Text Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseText(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

    } 

    /**
     * parseNumber- Parse Number Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseNumber(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

    } 

    /**
     * parseDate- Parse Date Tag
     * @param item
     */
    parseDate(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

    } 

    /**
     * parseSelect- Parse Select Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseSelect(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);  

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
     * getVerbose
     */
    getVerbose() 
    {
        return this.verbose;
    }

     /**
     * setLog - Show Log 
     * @param bool
     */
    setVerbose(bool) 
    {
        this.verbose = bool;
    }

    /**
     * getLog - Show Log 
     */
    getLog() 
    {
        return this.showLog;
    }

}


module.exports = XSDWebFormParserHTMLTags;