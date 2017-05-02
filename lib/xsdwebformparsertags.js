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
class XSDWebFormParserTags
{

    /**
     * Class constructor
     */
    constructor() {

        this.ELEMENT_TYPES = {
            "xs:element": this.parseElement,
            "xs:import": this.parseImport,
            "xs:simpleType": this.parseSimpleType,
            "xs:complexType": this.parseComplexType,
            "xs:sequence": this.parseSequence,
            "xs:restriction": this.parseRestriction,
            "xs:annotation": this.parseAnnotation,
            "xs:documentation": this.parseDocumentation,
            "xs:enumeration": this.parseEnumeration,
            "xs:minInclusive": this.parseMinInclusive,
            "xs:maxInclusive": this.parseMaxInclusive,
            "xs:union": this.parseUnion,
            "xs:pattern": this.parsePattern,
            "xs:whiteSpace": this.parseWhiteSpace,
            "xs:minLength": this.parseMinLength,
            "xs:maxLength": this.parseMaxLength
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
            this.showItemLog(xsdItem);

        // Loop through Tag's childNodes
        if (xsdItem.children) {
            for (let i = 0, l = xsdItem.children.length; i < l; i++) {
                if (xsdItem.children[i].type === "element") {

                    // Parse Tag Tag
                    this.parseXSDItem(xsdItem.children[i].name);
                    xsdItem.children[i].xparent = xsdItem;
                    xsdItem.children[i].level = xsdItem.level + 1;

                    // Recursive call
                    this.xsdParse(xsdItem.children[i]);

                }
            };
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
     * logTag - Log Element Tag
     * @param item
     */
    logTag(item) 
    {
        if (this.showLog) 
            console.log(`\x1b[0m\x1b[31m⇣\x1b[2m Found Tag \x1b[33m${item}\x1b[0m`);
    }

    /**
     * parseElement- Parse Element Tag
     * @param item
     */
    parseElement(item, sender) 
    {

        sender.logTag(item);  

    } 

    /**
     * parseImport- Parse Import Tag
     * @param item
     */
    parseImport(item, sender) 
    {

       sender.logTag(item); 

    }

    /**
     * parseSimpleType - Parse SimpleType Tag
     * @param item
     */
    parseSimpleType(item, sender)
    {

       sender.logTag(item); 

    }

    /**
     * parseComplexType - Parse ComplexType Tag
     * @param item
     */
    parseComplexType(item, sender)
    {

       sender.logTag(item); 

    }

    /**
     * parseSequence - Parse Sequence Tag
     * @param item
     */
    parseSequence(item, sender)
    {

       sender.logTag(item); 

    }

    /**
     * parseRestriction - Parse Restriction Tag
     * @param item
     */
    parseRestriction(item, sender)
    {

       sender.logTag(item); 

    }

    /**
     * parseAnnotation - Parse Annotation Tag
     * @param item
     */
    parseAnnotation(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseDocumentation - Parse Documentation Tag
     * @param item
     */
    parseDocumentation(item, sender)
    {

      sender.logTag(item); 

    } 

    /**
     * parseEnumeration - Parse Enumeration Tag
     * @param item
     */
    parseEnumeration(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseMinInclusive - Parse MinInclusive Tag
     * @param item
     */
    parseMinInclusive(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseMaxInclusive - Parse MaxInclusive Tag
     * @param item
     */
    parseMaxInclusive(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseUnion - Parse Union Tag
     * @param item
     */
    parseUnion(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parsePattern - Parse Pattern Tag
     * @param item
     */
    parsePattern(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseWhiteSpace - Parse WhiteSpace Tag
     * @param item
     */
    parseWhiteSpace(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseMinLength - Parse MinLength Tag
     * @param item
     */
    parseMinLength(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * parseMaxLength - Parse MaxLength Tag
     * @param item
     */
    parseMaxLength(item, sender)
    {

      sender.logTag(item); 

    }

    /**
     * showItemLog - ShowLog
     * @param xsdItem
     */
    showItemLog(xsdItem) 
    {

        let xspace = "  ";
        for (let i = 0; i < xsdItem.level; i++) {
            xspace += "\t";
        }

        console.log(`${xspace}\x1b[0m\x1b[31m▓▓▓▓▓▓▓▓▓▓▓▓▓\x1b[0m`);
        process.stdout.write(`${xspace}\x1b[2m▓▓▓▓ \x1b[0m\x1b[2mL:${xsdItem.level} \x1b[2m▓▓▓▓\x1b[0m\x1b[31m⇢\x1b[0m `);

        if (xsdItem.children) {
            process.stdout.write(`\x1b[1m${xsdItem.name}`);

            if (xsdItem.attr.name) {
                process.stdout.write(` - ${xsdItem.attr.name}`);

                if (this.verbose) {
                    if (xsdItem.name === "xs:element") {    

                        var txmlItem = xsdItem.toString();
                        txmlItem = txmlItem.split("\n").join("");
                        txmlItem = txmlItem.split("<").join(xspace + `\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓\t \x1b[2m<`);

                        let pos1 = txmlItem.indexOf("<xs:documentation>");
                        if (pos1 > 0 ){
                            var pos2 = txmlItem.indexOf("</xs:documentation>");
                            txmlItem = txmlItem.substring(0, pos1) + "<xs:documentation> ..." + txmlItem.substring(pos2);
                        }

                        process.stdout.write(`\x1b[2m${txmlItem}`);
                    }
                }
            }

            process.stdout.write(`\n\x1b[2m${xspace}▓▓▓▓▓▓▓▓▓▓▓▓▓`); 
            if (xsdItem.xparent) {
                console.log(`\x1b[32m  parent ::\x1b[1m ${xsdItem.xparent.name}\x1b[0m`);

                if (xsdItem.xparent.attr.name) {
                    console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓ \x1b[0m\x1b[36m par.name ::\x1b[1m ${xsdItem.xparent.attr.name}\x1b[0m`);
                }
            }
        }

        if (xsdItem.level === 0) {
            console.log(" ");
        }

        process.stdout.write(`\x1b[2m${xspace}         ▒▒`); 
        if (!this.showLog) {
            console.log(" ");
        }

    }

}


module.exports = XSDWebFormParserTags;