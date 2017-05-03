/**
 * @file xsdwebform.parser.htmltags.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 Eworx, George Bouris. All rights reserved.
 */

 import XSDWebFormParserLog from './xsdwebform.parser.log.js'
 import XSDWebFormParserError from './xsdwebform.parser.error.js'

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
                        htmlTemplate    : "<form action=\"${action}\">",
                        htmlTemplateE    : "</form>"
                    },
            "group": {
                        fn              : this.parseGroup,
                        htmlTemplate    : "<fieldset xsdmap=\"${xsdmap}\">",
                        htmlTemplateE    : "</fieldset>"
                    },
            "input": {
                        fn              : this.parseInput,
                        htmlTemplate    : "<input name=\"${name}\" ng-model=\"${model}\" xsdmap=\"${xsdmap}\" type=\"text\">"
                    },
            "text": {
                        fn              : this.parseText,
                        htmlTemplate    : "<textarea name=\"${name}\" ng-model=\"${model}\" xsdmap=\"${xsdmap}\"></textarea>"
                    },
            "number": {
                        fn              : this.parseNumber,
                        htmlTemplate    : "<input name=\"${name}\" ng-model=\"${model}\" xsdmap=\"${xsdmap}\" type=\"number\">"
                    },
            "date": {
                        fn              : this.parseDate,
                        htmlTemplate    : "<input name=\"${name}\" ng-model=\"${model}\" xsdmap=\"${xsdmap}\" type=\"date\">"
                    },
            "select": {
                        fn              : this.parseSelect,
                        htmlTemplate    : "<select name=\"${name}\" ng-model=\"${model}\" xsdmap=\"${xsdmap}\"></select>"
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

        let formStart = sender.HTML_TYPES[item.name].htmlTemplate;
        let formEnd = sender.HTML_TYPES[item.name].htmlTemplateE;

        formStart = formStart.replace("${action}", item.attr.action);

        var formObject = {
                    name : item.attr.name,
                    action : item.attr.action,
                    tagstart : formStart,
                    tagend : formEnd,
                    groups: []
                }
        sender.HTMLObjects.push({ type : "form", itemObject : formObject });

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

        let xsdGroupTag;

        try {
            xsdGroupTag = sender.getXSDComplexByGroupTag(item.attr.element, xsdItem);
        } catch (ex) {
            XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in XSD`);
        }

        let groupStart = sender.HTML_TYPES[item.name].htmlTemplate;
        let groupEnd = sender.HTML_TYPES[item.name].htmlTemplateE;

        groupStart = groupStart.replace("${xsdmap}", item.attr.element);

        var groupObject = {
                    name : item.attr.element,
                    tagstart : groupStart,
                    tagend : groupEnd,
                    htmlXML : item,
                    xsdXML :  xsdGroupTag,
                    items: []
                }
        // sender.HTMLObjects.push({ type : "group", itemObject : groupObject });
        // console.log("sender.HTMLObjects.length", sender.HTMLObjects.length);
        // console.log("sender.HTMLObjects[sender.HTMLObjects.length - 1]", sender.HTMLObjects[sender.HTMLObjects.length - 1]);
        // console.log("sender.HTMLObjects[sender.HTMLObjects.length - 1].groups", sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups);
        sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups.push({ type : "group", itemObject : groupObject });

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

    parseAttrs(itemStr, item, sender) {

        itemStr = itemStr.replace("${xsdmap}", item.attr.element);
        itemStr = itemStr.replace("${name}", item.attr.element);
        itemStr = itemStr.replace("${model}", sender.HTMLObjects[sender.HTMLObjects.length -1].itemObject.name + "." + item.attr.element);

        return itemStr;
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

        if (item.attr.element) {
            let htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];

            let itemStart = sender.HTML_TYPES[item.name].htmlTemplate;
            itemStart = sender.parseAttrs(itemStart, item, sender);

            htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1].itemObject.items.push(itemStart);
            
        }

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

        if (item.attr.element) {
            let htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];

            let itemStart = sender.HTML_TYPES[item.name].htmlTemplate;
            itemStart = sender.parseAttrs(itemStart, item, sender);
            
            htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1].itemObject.items.push(itemStart);
        }
 
    } 

    /**
     * parseDate- Parse Date Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseDate(item, xsdItem, sender) 
    {

        XSDWebFormParserLog.logHtmlTag(item.name, sender);    

        if (item.attr.element) {
            let htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];

            let itemStart = sender.HTML_TYPES[item.name].htmlTemplate;
            itemStart = sender.parseAttrs(itemStart, item, sender);
            
            htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1].itemObject.items.push(itemStart);
        }

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

        if (item.attr.element) {
            let htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];

            let itemStart = sender.HTML_TYPES[item.name].htmlTemplate;
            itemStart = sender.parseAttrs(itemStart, item, sender);
            
            htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1].itemObject.items.push(itemStart);
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