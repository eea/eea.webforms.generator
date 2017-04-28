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
     * Class constructor
     */
    constructor(){
        
        this.HTML_TYPES = {
            "form": this.parseForm,
            "group": this.parseGroup,
            "input": this.parseInput,
            "text": this.parseText,
            "number": this.parseNumber,
            "date": this.parseDate,
            "select": this.parseSelect
        };

        this.HTMLObjects = [];
        this.showLog = false;
        this.verbose = false;
    }

    /**
     * htmlParse - Parse inner XML Document
     * @param htmlItem
     * @param xsdItem
     */
    htmlParse(htmlItem, xsdItem) 
    {
        // Loop through Tag's childNodes
        for (let i = 0, l = htmlItem.children.length; i < l; i++) {

            if (htmlItem.children[i].type === "element") {
                // console.log("-----------" + htmlItem.children[i].name);
                if (this.showLog) {
                    process.stdout.write(`\x1b[0m\x1b[31mHTML => \x1b[0m\x1b[33m${htmlItem.children[i].name}`);
                    
                    if (htmlItem.children[i].attr.name) {
                        process.stdout.write(` :: \x1b[1m\x1b[33m${htmlItem.children[i].attr.name} \x1b[0m`);
                    }

                    if (htmlItem.children[i].attr.element) {

                            // if (htmlItem.children[i].attr.element ==="AcquiringMemberState") {
                            //     htmlItem.children[i].attr.test ="ASDASDASASDAS";
                            //     console.log("SSSSS"+htmlItem.children[i]);
                            // }

                        process.stdout.write(` :: \x1b[1m\x1b[33m${htmlItem.children[i].attr.element} \x1b[0m`);
                    }
                    console.log("");
                }

                this.parseHTMLItem(htmlItem.children[i], xsdItem);
                
                // if (htmlItem.children[i].name !== "group") {
                    // this.htmlParse(htmlItem.children[i], xsdItem);
                // }

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
            (this.HTML_TYPES[item.name])(item, xsdItem, this);
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

        sender.logTag(item.name);  

    }

    /**
     * parseGroup- Parse Group Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseGroup(item, xsdItem, sender)  
    {

        sender.logTag(item.name);  
  
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

        sender.logTag(item.name);  

    } 

    /**
     * parseText- Parse Text Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseText(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

    } 

    /**
     * parseNumber- Parse Number Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseNumber(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

    } 

    /**
     * parseDate- Parse Date Tag
     * @param item
     */
    parseDate(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

    } 

    /**
     * parseSelect- Parse Select Tag
     * @param item
     * @param xsdItem
     * @param sender
     */
    parseSelect(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

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

    /**
     * logTag - Log Element Tag
     * @param item
     */
    logTag(item) 
    {
        if (this.verbose) 
            console.log(`\x1b[0m\x1b[31m⇣\n\x1b[2mParsing HTML Tag ⇢ \x1b[33m${item}\x1b[0m\n`);
    }

}


module.exports = XSDWebFormParserHTMLTags;