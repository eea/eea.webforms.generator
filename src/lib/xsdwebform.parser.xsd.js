/**
 * @file xsdwebform.parser.xsd.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

import XSDWebFormParserError from './xsdwebform.parser.error.js';

/**
 * Class XSDWebFormParserTags
 * Parser for XSD Schema Tags
 *
 * import { XmlDocument } from 'xmldoc';
 * import XSDWebFormParserLog from './xsdwebform.parser.log.js';
 * import XSDWebFormParserTags from './xsdwebform.parser.xsd.js';
 *
 * var myXml = new XmlDocument(XML TEXT);
 * var myXmlParser = new XSDWebFormParserTags();
 * myXmlParser.xsdParse(myxml)
 */
class XSDWebFormParserTags {
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
			"xs:all": this.parseAll,
			"xs:attribute": this.parseAttribute,
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
			"xs:maxLength": this.parseMaxLength,
			"xs:totalDigits": this.parseTotalDigits,
			"dd:multiValueDelim": this.parseMultiValueDelim,
			"dd2:Keyword": this.parseKeyword,
			"dd2:Definition": this.parseDefinition,
			"dd3:Methodology": this.parseMethodology
		};
		this.showLog = true;
		this.verbose = true;

		//this.logger = new XSDWebFormParserLog();
	}

	/**
	 * xsdParse - Parse inner XML Document
	 * @param xsdItem
	 */
	xsdParse(xsdItem) {
		if (this.showLog)
			this.logger.showItemLog(xsdItem, this.verbose);
		// Loop through Tag's childNodes
		if (xsdItem.children) {
			for (let i = 0, l = xsdItem.children.length; i < l; i++) {
				if (xsdItem.children[i].type === "element") {
					try {
						// Parse Tag Tag
						this.parseXSDItem(xsdItem.children[i].name);
						xsdItem.children[i].xparent = xsdItem;
						xsdItem.children[i].level = xsdItem.level + 1;
						// Recursive call - Send Children nodes to the same function(xsdParse) => Send their Children to xsdParse and so on
						/* 
						XML ( Markup Language : [boxes] [box1/][box2/][/boxes] )
						 <xml>
							<item name="test1"/>  <-- child 1
							<item name="test2"/>  <-- child 2
							<item name="test3">  <-- child 3
								<subitem name="stest1"/> <-- child 1 of Child 3
							</item>
						</xml>

						Tree Representation:
							              [ XML ]
							           /       |       \
							Child 1	Child 2  Child 3
									   |
									child 1
						*/
						this.xsdParse(xsdItem.children[i]);
					} catch (err) {
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
	parseXSDItem(item) {
		if ((item in this.ELEMENT_TYPES)) {
			/*
			 Execute hash value=>function
			
			 i.e. ELEMENT_TYPES["xs:element"] => (this.parseElement)(item, this)
			 Parse XML => Look for xs:element => Execute task this.parseElement(item<- xml node, this<-sender)
			 in this.parseElement():
			 
			 Attributes: Find the attributes. e.g. <xs:element name="CountryCode"> | item.attr.name = CountryCode
			 Value: Find the value e.g. <xs:element name="CountryCode">My Value</xs:element> | item.val = My Value
			
			 Or
			
			 Attributes: Find the attributes. e.g. <xs:element name="CountryCode" value="My Value"> | item.attr.name = CountryCode, item.attr.value = My Value
			 Then, expand
			 this.CountryCodes =  {
				"My Value" : this.executeTaskMyValue,				
				"Another Value" : this.executeTaskAnotherValue,
			 }
			
			 Or
			 this.executeTask(item.attr.value, sender)
			 executeTask(whatToExecute, sender)
			 */
			(this.ELEMENT_TYPES[item])(item, this);
		} else {
			console.log(`\n\x1b[1m\x1b[31m************* Unknown Tag {${item}} *************\x1b[0m\n`);
			process.stdout.write('\x07');
		}
	}

	/**
	 * parseElement- Parse Element Tag
	 * @param item
	 * @param sender
	 */

	parseElement(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseImport- Parse Import Tag
	 * @param item
	 * @param sender
	 */
	parseImport(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseSimpleType - Parse SimpleType Tag
	 * @param item
	 * @param sender
	 */
	parseSimpleType(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}
	
	/**
	 * parseComplexType - Parse ComplexType Tag
	 * @param item
	 * @param sender
	 */
	parseComplexType(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseSequence - Parse Sequence Tag
	 * @param item
	 * @param sender
	 */
	parseSequence(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseAll - Parse All Tag
	 * @param item
	 * @param sender
	 */
	parseAll(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseAttribute - Parse Attribute Tag
	 * @param item
	 * @param sender
	 */
	parseAttribute(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseRestriction - Parse Restriction Tag
	 * @param item
	 * @param sender
	 */
	parseRestriction(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}
	/**
	 * parseAnnotation - Parse Annotation Tag
	 * @param item
	 * @param sender
	 */

	parseAnnotation(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}
	/**
	 * parseDocumentation - Parse Documentation Tag
	 * @param item
	 * @param sender
	 */

	parseDocumentation(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseEnumeration - Parse Enumeration Tag
	 * @param item
	 * @param sender
	 */
	parseEnumeration(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMinInclusive - Parse MinInclusive Tag
	 * @param item
	 * @param sender
	 */
	parseMinInclusive(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMaxInclusive - Parse MaxInclusive Tag
	 * @param item
	 * @param sender
	 */
	parseMaxInclusive(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseUnion - Parse Union Tag
	 * @param item
	 * @param sender
	 */
	parseUnion(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parsePattern - Parse Pattern Tag
	 * @param item
	 * @param sender
	 */
	parsePattern(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseWhiteSpace - Parse WhiteSpace Tag
	 * @param item
	 * @param sender
	 */
	parseWhiteSpace(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMinLength - Parse MinLength Tag
	 * @param item
	 * @param sender
	 */
	parseMinLength(item, sender) {
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMaxLength - Parse MaxLength Tag
	 * @param item
	 * @param sender
	 */
	parseMaxLength(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseTotalDigits - Parse TotalDigits Tag
	 * @param item
	 * @param sender
	 */
	parseTotalDigits(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMultiValueDelim - Parse MultivalueDelim Tag
	 * @param item
	 * @param sender
	 */
	parseMultiValueDelim(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseKeyword - Parse Keyword Tag
	 * @param item
	 * @param sender
	 */
	parseKeyword(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseDefinition - Parse Definition Tag
	 * @param item
	 * @param sender
	 */
	parseDefinition(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * parseMethodology - Parse Methodology Tag
	 * @param item
	 * @param sender
	 */
	parseMethodology(item, sender) {
		
		if (sender.showLog)
			sender.logger.logXsdTag(item);
	}

	/**
	 * setLogger
	 * @param logger
	 */
	setLogger(logger) {
		this.logger = logger;
	}

	/**
	 * setLog  - Show Log
	 * @param bool
	 */
	setLog(bool) {
		this.showLog = bool;
	}

	/**
	 * setVerbose - Show Log verbose
	 * @param bool
	 */
	setVerbose(bool) {
		this.verbose = bool;
	}

	/**
	 * getLog - Show Log
	 */
	getLog() {
		return this.showLog;
	}

	/**
	 * getLog - Show Log
	 */
	getVerbose() {
		return this.verbose;
	}
	

}


module.exports = XSDWebFormParserTags;