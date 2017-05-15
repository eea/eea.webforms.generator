/**
 * @file xsdwebform.parser.htmltags.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */

import XSDWebFormParserLog from './xsdwebform.parser.log.js';
import XSDWebFormParserError from './xsdwebform.parser.error.js';

/**
 * Class XSDWebFormParserHTMLTags
 * Parser for XSD Schema Tags 
 * Static
 */
class XSDWebFormParserHTMLTags {
	/**
	 * Class constructor
	 */
	constructor() {
		this.HTML_TYPES = {
			"page": this.parsePage,
			"form": this.parseForm,
			"group": this.parseGroup,
			"item": this.parseItem,
			"input": this.parseInput,
			"text": this.parseText,
			"number": this.parseNumber,
			"positivenumber": this.parseNumberP,
			"date": this.parseDate,
			"select": this.parseSelect,
			"radio": this.parseRadio
		};

		this.XSD_HTML_TYPES = {
			"xs:integer": "number",
			"xs:decimal": "number",
			"NonNegativeIntegerType": "positivenumber",
			"xs:date": "date",
			"DateType": "date",
			"xs:string": "input",
			"xs:boolean": "radio"
		};

		this.HTMLObjects = [];
		this.TextContentObjects = [];
		this.showLog = false;
		this.verbose = false;
	}

	/**
	 * htmlParse - Parse inner XML Document
	 * @param htmlItem
	 * @param xsdItem
	 * @returns HTMLObjects[]
	 */
	htmlParse(htmlItem, xsdItem) {
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

				try {
					this.parseHTMLItem(htmlItem.children[i], xsdItem);
					this.htmlParse(htmlItem.children[i], xsdItem);
				} catch (err) {
					XSDWebFormParserError.reportError(err);
				}
			}
		}
	}

	/**
	 * parseHTMLItem - Parse HTML Tag
	 * @param item
	 * @param xsdItem
	 */
	parseHTMLItem(item, xsdItem) {
		if ((item.name in this.HTML_TYPES)) {
			(this.HTML_TYPES[item.name])(item, xsdItem, this);
		} else {
			console.log(`\n************* Unknown HTML Tag {${item.name}} *************\n`);
			process.stdout.write('\x07');
		}
	}

	/**
	 * parsePage - Parse Page Info
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parsePage(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);
		sender.HTML_FORM_TITLE = "{{'formtitle' | translate}}";
	}

	/**
	 * parseForm - Parse Form Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseForm(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		let formEnd = "<button type=\"submit\" class=\"submitbutton\">{{'submitform' | translate}}</button>";
		let formNum = sender.HTMLObjects.length + 1;
		var formObject = {
			name: 'form' + formNum,
			action: item.attr.action,
			tag: 'form',
			append: formEnd,
			attrs: {
				name: 'form' + formNum,
				id: 'form' + formNum,
				'ew-action': item.attr.action,
				method: 'post',
				class: 'ewform medium-12',
				'ng-submit': `submit(form${formNum})`
			},
			groups: [],
			tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
		};
		sender.HTMLObjects.push({
			type: "form",
			itemObject: formObject
		});
	}

	/**
	 * parseGroup - Parse Group Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseGroup(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		let xsdGroupTag, xsdGroupProperties;
		try {
			xsdGroupTag = sender.getXSDComplexByGroupTag(item.attr.element, xsdItem);
		} catch (ex) {
			XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in XSD`);
		}

		try {
			xsdGroupProperties = xsdItem.childNamed("xs:element").childNamed("xs:complexType").childNamed("xs:sequence").childWithAttribute("type", item.attr.element, xsdItem);
		} catch (ex) {
			XSDWebFormParserError.reportError(`Can not find type="${item.attr.element}" element in XSD root element`, item);
		}

		if (!xsdGroupProperties) {
			try {
				xsdGroupProperties = xsdItem.childWithAttribute("name", item.attr.element, xsdItem).childNamed("xs:complexType").childNamed("xs:sequence");
			} catch (ex) {
				XSDWebFormParserError.reportError(`Can not find name="${item.attr.element}" element in XSD root element`, item);
			}			
		}

		let groupStart= '', groupEnd = '', canAddRows = 0;
		if (xsdGroupProperties.attr.maxOccurs) {
			let maxOccurs = '';
			if (isNaN(xsdGroupProperties.attr.maxOccurs))  {
				if ( xsdGroupProperties.attr.maxOccurs === 'unbounded')  {
					maxOccurs = '0';
				}
			} else {
				maxOccurs = xsdGroupProperties.attr.maxOccurs;
			}
			canAddRows = 1;

			groupStart += `<div class="multiple-index medium-1"><span class="index">{{multipleIndex}}</span></div>`;
			groupEnd += `<div class="row"><button type=\"button\" class="rowbutton" maxOccurs="${maxOccurs}" ng-click=\"addRow('form${sender.HTMLObjects.length}', '${item.attr.element}')\" ng-model=\"group.item['${item.attr.element + "'].item['add" + item.attr.element}']\" group=\"${item.attr.element}\">{{'addrow'  | translate}}</button></div>`;
		}
		
		var groupObject = {
			name: item.attr.element.replace("-", ""),
			xsdName: xsdGroupTag.name,
			tag: 'fieldset',
			attrs: {
				'ew-map': xsdGroupTag.name + "/" + item.attr.element,
				multi: canAddRows,
				id: item.attr.element.replace("-", "")
			},
			prepend: groupStart,
			append: groupEnd,
			xsdXML: xsdGroupTag,
			items: [],
			tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
		};
		sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups.push({
			type: "group",
			itemObject: groupObject
		});
	}

	/**
	 * parseItem - Find XSD Element and its type
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseItem(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		
		let XSDWFormItem, XSDWFormItemType;

		try {
			XSDWFormItem = itemInfo.groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element);
			
			if (!XSDWFormItem) {
				if (itemInfo.groupBase.itemObject.xsdXML.childWithAttribute("ref", item.attr.element)) {
					XSDWFormItem =  xsdItem.childWithAttribute("name", item.attr.element);

					if (!XSDWFormItem.attr.type) {

						let subXSDWFormItem = XSDWFormItem.childNamed("xs:simpleType");

						if (!subXSDWFormItem) {
							XSDWFormItem = XSDWFormItem.childNamed("xs:complexType").childWithAttribute("name", "entireEntity");
						} else {
							XSDWFormItem = subXSDWFormItem.childNamed("xs:restriction");
							XSDWFormItem.attr.type = XSDWFormItem.attr.base;
						}
					}
				} else {
					XSDWebFormParserError.reportError(`Can not find name or ref "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
				}
			}
			XSDWFormItemType = XSDWFormItem.attr.type;
							
			if ((XSDWFormItemType in sender.XSD_HTML_TYPES)) {
				item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
				item.src = XSDWFormItem;
			} else {

				let subXSDWFormItem = xsdItem.childWithAttribute("name", XSDWFormItemType).childNamed("xs:simpleContent");
				
				if (subXSDWFormItem) {
					subXSDWFormItem= subXSDWFormItem.childNamed("xs:extension");

					if (subXSDWFormItem.attr.base) {
						XSDWFormItemType = subXSDWFormItem.attr.base;
						item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
						item.src = XSDWFormItem;
					}
				}
				
				if (!(XSDWFormItemType in sender.XSD_HTML_TYPES)) {
					item.name = "select";
				}
			}


			sender.parseHTMLItem(item, xsdItem);
		} catch (ex) {
			console.log("ex", ex);
			XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
		}
	}

	/**
	 * parseInput - Parse Input Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseInput(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		let name = (item.attr.name) ? item.attr.name : item.attr.element;
		let itemFormModel = sender.getFullFormName(name, sender);
		name = name.replace("-", "");
		
		var htmlItem = {
			name: name,
			tag: 'input',
			tagclose: false,
			autoclose: false,
			hasLabel: true,
			formModel: itemFormModel,
			attrs: {
				name:name,
				id: name,
				required: 1,
				type: 'text',
				'ng-model': 'field.' + itemFormModel
			},
			tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
		};
		sender.addItemToGroup(htmlItem, itemInfo, sender);
	}

	/**
	 * parseText - Parse Text Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseText(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element.replace("-", ""),
				tag: 'textarea',
				tagclose: false,
				autoclose: true,
				hasLabel: true,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element.replace("-", ""),
					id: item.attr.element.replace("-", ""),
					required: 1,
					'ew-map': sender.getEwMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo, sender);
		}
	}

	/**
	 * parseNumber - Parse Number Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 * @param positive
	 */
	parseNumber(item, xsdItem, sender, positive) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'input',
				tagclose: false,
				autoclose: false,
				hasLabel: true,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element.replace("-", ""),
					id: item.attr.element.replace("-", ""),
					required: 1,
					type: "number",
					'ew-map': sender.getEwMap(item, itemInfo),
					'ng-model': 'field.' +itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			
			if (positive) {
				htmlItem.attrs.min = 0;
			}

			sender.addItemToGroup(htmlItem, itemInfo, sender);
		}
	}
	/**
	 * parseNumberP - Parse Positive Number Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseNumberP(item, xsdItem, sender) {
		sender.parseNumber(item,  xsdItem, sender, true);
	}

	/**
	 * parseDate - Parse Date Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseDate(item, xsdItem, sender) {
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element.replace("-", ""),
				tag: 'input',
				tagclose: false,
				autoclose: false,
				hasLabel: true,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element,
					id: item.attr.element.replace("-", ""),
					required: 1,
					type: "date",
					'ew-map': sender.getEwMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo, sender);
		}

	}

	/**
	 * parseSelect - Parse Select Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseSelect(item, xsdItem, sender) {

		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {

			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let XSDWFormItem, XSDWFormItemTypeData;

			try {
				XSDWFormItem = itemInfo.groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element);
			} catch (ex) {
				XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in group XSD`, itemInfo.groupBase.itemObject.xsdXML);
			}

			try {
				XSDWFormItemTypeData = xsdItem.childWithAttribute("name", XSDWFormItem.attr.type);
			} catch (ex) {
				XSDWebFormParserError.reportError(`Can not find "${XSDWFormItem.attr.type}" element in XSD`);
			}

			if (!XSDWFormItemTypeData)
				XSDWebFormParserError.reportError(`Can not find "${XSDWFormItem.attr.type}" element in XSD`);

			let enums = XSDWFormItemTypeData.childNamed("xs:restriction");
			if (!enums)
				XSDWebFormParserError.reportError(`Can not find xs:restriction for "${XSDWFormItem.attr.type}" element in XSD`, XSDWFormItemTypeData);

			let enumItems = [];
			enums.eachChild((enm) => {
				if (enm.name === "xs:enumeration") {
					enumItems.push({
						value: enm.attr.value,
						option: enm.attr.value
					});
				}
				if (enm.name === "xs:minInclusive") {
					let maxInclusive = enums.childNamed("xs:maxInclusive");
					if (!maxInclusive)
						XSDWebFormParserError.reportError(`Found minInclusive but not maxInclusive for "${XSDWFormItem.attr.type}/${enums.name}" element in XSD`, enums);

					let min = enm.attr.value;
					enumItems = Array(maxInclusive.attr.value - min + 1).fill(min).map(() => {
						return {
							value: min,
							option: min++
						};
					});
					return;
				}
			});

			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'select',
				tagclose: false,
				autoclose: true,
				hasLabel: true,
				options: enumItems,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element,
					id: item.attr.element.replace("-", ""),
					required: 1,
					'ew-map': sender.getEwMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo, sender);
		}
	}
	
	/**
	 * parseRadio - Parse  Radio Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseRadio(item, xsdItem, sender) {

		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {
			console.log("TO DO: RADIO ");
		}
	}

	/**
	 * getItemInfo
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	getItemInfo(item, xsdItem, sender) {
		var htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];
		var groupBase = htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1];
		var parentName = groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element);
		if (! parentName) {
			parentName = groupBase.itemObject.xsdXML.childWithAttribute("ref", item.attr.element);
		}

		return {
			htmlBase: htmlBase,
			groupBase: groupBase,
			parentXsdName: parentName.name
		};
	}

	/**
	 * getEwMap
	 * @param item
	 * @param itemInfo
	 */
	getEwMap(item, itemInfo) {
		return itemInfo.groupBase.itemObject.name + "::" + itemInfo.groupBase.itemObject.xsdName + "/" + itemInfo.parentXsdName + "/" + item.attr.element ;
	}

	/**
	 * getFullFormName
	 * @param name
	 * @param sender
	 */
	getFullFormName(name, sender) {
		return sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.name + "." + name.replace("-", "");
	}


	/**
	 * getXSDComplexByGroupTag - Find and get XSD complexType Type filtered by Group Tag name
	 * @param xsdItemName
	 * @param xsdItem
	 */
	getXSDComplexByGroupTag(xsdItemName, xsdItem) {

		var XSDWFormComplexItems = xsdItem.childWithAttribute("name", xsdItemName).childNamed("xs:sequence");
		if (!XSDWFormComplexItems) {
			XSDWFormComplexItems = xsdItem.childWithAttribute("name", xsdItemName).childNamed("xs:complexType").childNamed("xs:sequence");
		}
		if (!XSDWFormComplexItems) return "";

		return XSDWFormComplexItems;
	}

	/**
	 * addItemToGroup
	 * @param htmlItem
	 * @param itemInfo
	 * @param sender
	 */
	addItemToGroup(htmlItem, itemInfo, sender) {
		itemInfo.htmlBase.itemObject.groups[itemInfo.htmlBase.itemObject.groups.length - 1].itemObject.items.push(htmlItem.tagToHtml(sender));
	}

	/**
	 * tagToHtml
	 */
	static tagToHtml(sender) {
		let outPut = '';

		if (this.hasLabel) {
			sender.TextContentObjects.push({
				label: this.name.replace("-", ""),
				text: `${this.name}`
			});
			outPut = `<div ng-bind="'${this.name.replace("-", "")}' | translate" class="field-caption ng-binding"></div>`;
		}

		outPut += "<" + this.tag;
		for (let key in this.attrs) {
			outPut += " " + key + "=\"" + this.attrs[key] + "\"";
		}
		outPut += ">";

		if (this.options) {
			outPut += this.options.map((option) => {
				return `<option value="${option.value}">${option.option}</option>`;
			}).join("");
		}

		if (this.autoclose)
			outPut += "</" + this.tag + ">";

		if (this.attrs.required === 1) {
			outPut += `<span ng-show="${this.formModel}.$touched && ${this.formModel}.$invalid && !ValidationDisabled" class="required-msg"><b>${this.attrs.id}</b> {{'isrequired' | translate}}</span>`;
		}

		return outPut;
	}

	/**
	 * setLog - Show Log 
	 * @param bool
	 */
	setLog(bool) {
		this.showLog = bool;
	}

	/**
	 * getVerbose
	 */
	getVerbose() {
		return this.verbose;
	}

	/**
	 * setLog - Show Log 
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

}


module.exports = XSDWebFormParserHTMLTags;
