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
     * logTag - Log Element Tag
     * @param item
     */
    logTag(item) 
    {
        if (this.showLog) 
            console.log(`\x1b[0m\x1b[31m⇣\x1b[2m Found Tag \x1b[33m${item}\x1b[0m`);
    }

    /**
     * htmlParse - Parse inner XML Document
     * @param htmlItem
     * @param xsdItem
     * @param showLog
     */
    htmlParse(htmlItem, xsdItem, showLog) 
    {
        this.showLog = showLog;

      //   xsdItem = new XmlDocument(`<a><b><xs:sequence>
      //     <xs:element name="AEA" type="xs:integer" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="TransferringMemberState" type="EUCountryName" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="AcquiringMemberState" type="EUCountryName" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="AEA-Price" type="xs:decimal" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="TransferAgreementDate" type="xs:date" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="ExpectedTransactionYear" type="TransactionYear" minOccurs="1" maxOccurs="1"/>
      //     <xs:element name="Other" type="xs:string" minOccurs="1" maxOccurs="1"/>
      // </xs:sequence></b></a>`);
        
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
                    console.log("\n");
                }

                this.parseHTMLItem(htmlItem.children[i], xsdItem);
                
                if (htmlItem.children[i].name !== "group") {
                    this.htmlParse(htmlItem.children[i], xsdItem, showLog);
                }
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
            // console.log(`\n************* {${this.HTML_TYPES[item.name]}} *************\n`);
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
     * @param sender
     */
    parseForm(item, xsdItem, sender) 
    {

        // sender.logTag(item.name);  

    }

    /**
     * parseGroup- Parse Group Tag
     * @param item
     */
    parseGroup(item, xsdItem, sender)  
    {
        sender.logTag(item.name);  
  

        // var groupObject = {
        //             name : item.attr.element,
        //             htmlXML : item,
        //             xsdXML :  sender.getXSDComplexByGroupTag(item.attr.element, xsdItem)
        //         }
        // sender.HTMLObjects.push({ type : "group", itemObject : groupObject });

    } 

    /**
     * parseInput- Parse Input Tag
     * @param item
     */
    parseInput(item, xsdItem, sender)
    {

        sender.logTag(item.name);  

    } 

    /**
     * parseText- Parse Text Tag
     * @param item
     */
    parseText(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

    } 

    /**
     * parseNumber- Parse Number Tag
     * @param item
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
     */
    parseSelect(item, xsdItem, sender) 
    {

        sender.logTag(item.name);  

    } 

}


module.exports = XSDWebFormParserHTMLTags;