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
     * logTag - Log Element Tag
     * @param item
     */
    static logTag(item) 
    {
        console.log("\n\tFound Tag : =====> " + item);
    }

    /**
     * parseElement- Parse Element Tag
     * @param item
     */
    static parseElement(item) 
    {

         XSDWebFormParserTags.logTag(item);  

    } 

    /**
     * parseImport- Parse Import Tag
     * @param item
     */
    static parseImport(item) 
    {

        XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseSimpleType - Parse SimpleType Tag
     * @param item
     */
    static parseSimpleType(item)
    {

        XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseComplexType - Parse ComplexType Tag
     * @param item
     */
    static parseComplexType(item)
    {

        XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseSequence - Parse Sequence Tag
     * @param item
     */
    static parseSequence(item)
    {

        XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseRestriction - Parse Restriction Tag
     * @param item
     */
    static parseRestriction(item)
    {

        XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseAnnotation - Parse Annotation Tag
     * @param item
     */
    static parseAnnotation(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseDocumentation - Parse Documentation Tag
     * @param item
     */
    static parseDocumentation(item)
    {

       XSDWebFormParserTags.logTag(item); 

    } 

    /**
     * parseEnumeration - Parse Enumeration Tag
     * @param item
     */
    static parseEnumeration(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseMinInclusive - Parse MinInclusive Tag
     * @param item
     */
    static parseMinInclusive(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseMaxInclusive - Parse MaxInclusive Tag
     * @param item
     */
    static parseMaxInclusive(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseUnion - Parse Union Tag
     * @param item
     */
    static parseUnion(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parsePattern - Parse Pattern Tag
     * @param item
     */
    static parsePattern(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

    /**
     * parseWhiteSpace - Parse WhiteSpace Tag
     * @param item
     */
    static parseWhiteSpace(item)
    {

       XSDWebFormParserTags.logTag(item); 

    }

}


module.exports = XSDWebFormParserTags;