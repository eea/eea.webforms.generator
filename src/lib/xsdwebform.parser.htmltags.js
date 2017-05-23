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
			"radio": this.parseRadio,
			"checkbox": this.parseCheckbox,
			"radioorselect" : this.decideRadioCheck
		};

		this.XSD_HTML_TYPES = {
			"xs:integer": "number",
			"xs:decimal": "number",
			"NonNegativeIntegerType": "positivenumber",
			"xs:date": "date",
			"DateType": "date",
			"xs:string": "input",
			"xs:boolean": "radioorselect"
		};

		this.HTMLObjects = [];
		this.LabelContentObjects = [];
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
					this.reportError(err);
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

		let formEnd = "<button type=\"submit\" class=\"submitbutton btn btn-primary\">{{'submitform' | translate}}</button>";
		let formNum = sender.HTMLObjects.length + 1;
		var formObject = {
			name: 'form' + formNum ,
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
			xsdGroupTag = sender.getXSDComplexByGroupTag(item.attr.element, xsdItem, sender);
		} catch (ex) {
			sender.reportError(`Can not find "${item.attr.element}" element in XSD`);
		}

		try {
			xsdGroupProperties = sender.getXSDGroupProperties(item.attr.element, xsdItem, sender);
		} catch (ex) {
			sender.reportError(`Can not find type="${item.attr.element}" or  name="${item.attr.element}" element in XSD root element`, item);
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

			groupStart += `<div class="multiple-index medium-1"><span class="index">{{$index + 1}}</span></div>`;
			groupEnd += `<div class="row"><button type="button" class="rowbutton" maxOccurs="${maxOccurs}" ng-click="addRow('form${sender.HTMLObjects.length}', '${item.attr.element}')" ng-model="group.item['${item.attr.element + "'].item['add" + item.attr.element}']" group="${item.attr.element}" title="{{'addrow'  | translate}}"></button></div>`;
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
		
		let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		
		let XSDWFormItem, XSDWFormItemType;
		try {
			XSDWFormItem = sender.getItemByName(item.attr.element, itemInfo.groupBase.itemObject.xsdXML);
			
			if (!XSDWFormItem) {
				if (sender.getItemByRef(item.attr.element, itemInfo.groupBase.itemObject.xsdXML)) {
					XSDWFormItem = sender.getItemByName(item.attr.element, xsdItem);
					if (!XSDWFormItem.attr.type) {
						let subXSDWFormItem = XSDWFormItem.childNamed("xs:simpleType");
						if (!subXSDWFormItem) {
							XSDWFormItem = XSDWFormItem = sender.getItemByName("entireEntity", XSDWFormItem.childNamed("xs:complexType"));
						} else {
							XSDWFormItem = subXSDWFormItem.childNamed("xs:restriction");
							XSDWFormItem.attr.type = XSDWFormItem.attr.base;
						}
					}
				} else {
					sender.reportError(`Can not find name or ref "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
				}
			}
			XSDWFormItemType = XSDWFormItem.attr.type;
							
			if ((XSDWFormItemType in sender.XSD_HTML_TYPES)) {
				item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
				item.src = XSDWFormItem;
			} else {

				let subXSDWFormItem = sender.getItemByName(XSDWFormItemType, xsdItem).childNamed("xs:simpleContent");
				
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
			sender.reportError(`Can not find "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
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
				name:name + '${{$index + 1}}',
				id: name + '${{$index + 1}}',
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
					name: item.attr.element.replace("-", "") + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
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
					name: item.attr.element.replace("-", "") + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					type: "number",
					'ew-map': sender.getEwMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
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
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
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
				XSDWFormItem = sender.getItemByName(item.attr.element, itemInfo.groupBase.itemObject.xsdXML);
			} catch (ex) {
				sender.reportError(`Can not find "${item.attr.element}" element in group XSD`, itemInfo.groupBase.itemObject.xsdXML);
			}

			if (!XSDWFormItem) {
				try {
					XSDWFormItem = sender.getItemByName(item.attr.element, xsdItem);
				} catch (ex) {
					sender.reportError(`Can not find "${item.attr.element}" element in group XSD`, xsdItem);
				}
			}

			try {
				XSDWFormItemTypeData = sender.getItemByName(XSDWFormItem.childNamed("xs:simpleType").childNamed("xs:restriction").attr.type, xsdItem) 
				|| sender.getItemByName(XSDWFormItem.attr.type, xsdItem) ;
			} catch (ex) {
				sender.reportError(`Can not find "${XSDWFormItem.attr.type}" element in XSD`);
			}

			if (!XSDWFormItemTypeData)
				sender.reportError(`Can not find "${XSDWFormItem.attr.type}" element in XSD`);

			let enums = XSDWFormItemTypeData.childNamed("xs:restriction");
			if (!enums)
				sender.reportError(`Can not find xs:restriction for "${XSDWFormItem.attr.type}" element in XSD`, XSDWFormItemTypeData);

			let enumItems = [];
			enums.eachChild((enm) => {
				let value = enm.attr.value;
				let option, annotation;
				if (enm.name === "xs:enumeration") {
					annotation = enm.childNamed("xs:annotation");
					if (annotation) {
						option = annotation.childNamed("xs:documentation").val;
					} else {
						option = enm.attr.value;
					}
					enumItems.push({
						value:value,
						option: option
					});
				} else if (enm.name === "xs:minInclusive") {
					let maxInclusive = enums.childNamed("xs:maxInclusive");
					if (!maxInclusive)
						sender.reportError(`Found minInclusive but not maxInclusive for "${XSDWFormItem.attr.type}/${enums.name}" element in XSD`, enums);

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
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
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
			
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let XSDWFormItem, XSDWFormItemData;

			try {
				XSDWFormItem = sender.getItemByName(item.attr.element, xsdItem);
			} catch (ex) {
				sender.reportError(`Can not find "${item.attr.element}" element in group XSD`, itemInfo.groupBase.itemObject.xsdXML);
			}

			try {
				XSDWFormItemData = XSDWFormItem.childNamed("xs:complexType").childNamed("xs:sequence");
			} catch (ex) {
				sender.reportError(`Can not find "${item.attr.element}" sequence in XSD`);
			}

			if (!XSDWFormItemData)
				sender.reportError(`Can not find "${item.attr.element}" element in XSD`);

			let enumItems = [];
			XSDWFormItemData.eachChild((enm) => {
				if (enm.attr.ref) {
					XSDWebFormParserLog.logTODO("check radio reference : enm.attr.ref : " + enm.attr.ref);
				}
				if (enm.name === "xs:element") {
					enumItems.push({
						value: enm.attr.ref,
						name: item.attr.element,
						label: enm.attr.ref
					});
				}
			});
			
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'radio',
				tagclose: false,
				autoclose: false,
				hasLabel: true,
				noTag: true,
				options: enumItems,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
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
	 * parseCheckbox - Parse  Checkbox Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseCheckbox(item, xsdItem, sender) {

		XSDWebFormParserLog.logHtmlTag(item.name, sender);
		XSDWebFormParserLog.logTODO("CHECKBOX");

	}

	/**
	 * decideRadioCheck - Parse  Checkbox Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	decideRadioCheck(item, xsdItem, sender) {
		if (item.attr.element) {
			if (!sender.geTypeByName(item.attr.element, xsdItem)) 
				item.name = "checkbox";
			else 
				item.name = "radio";
		}		
		sender.parseHTMLItem(item, xsdItem);
	}

	/**
	 * geTypeByName
	 * @param itemname
	 * @param xsdItem
	 */
	geTypeByName(itemname, xsdItem) {
		let elements = xsdItem.childrenNamed("xs:simpleType");
		for (let i = 0, l = elements.length; i  < l; i++) {
			if (elements[i].attr.name === itemname) {
				return elements[i];
			}
		}
	}

	/**
	 * getItemByName
	 * @param itemname
	 * @param xsdItem
	 */
	getItemByName(itemname, xsdItem) {
		return xsdItem.childWithAttribute("name", itemname);
	}

	/**
	 * getItemByRef
	 * @param itemref
	 * @param xsdItem
	 */
	getItemByRef(itemref, xsdItem) {
		return xsdItem.childWithAttribute("ref", itemref);
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

		var parentName = sender.getItemByName(item.attr.element, groupBase.itemObject.xsdXML)
				|| sender.getItemByRef(item.attr.element, groupBase.itemObject.xsdXML);
		
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
		return sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.name + "['" + name.replace("-", "") + "$' + ($index + 1)]";
	}

	/**
	 * getXSDComplexByGroupTag - Find and get XSD complexType Type filtered by Group Tag name
	 * @param xsdItemName
	 * @param xsdItem
	 */
	getXSDComplexByGroupTag(xsdItemName, xsdItem, sender) {

		var XSDWFormComplexItems = sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:sequence") 
						|| sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:sequence")
						|| sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:all");
		
		if (!XSDWFormComplexItems) return "";

		return XSDWFormComplexItems;
	}

	/**
	 * getXSDGroupProperties - Find and get XSD Group Properties
	 * @param xsdItemName
	 * @param xsdItem
	 */
	getXSDGroupProperties(xsdItemName, xsdItem, sender) {
		var xsdGroupProperties;

		try {
			xsdGroupProperties = ( xsdItem.childNamed("xs:element").childNamed("xs:complexType").childNamed("xs:sequence") 
						|| xsdItem.childNamed("xs:element").childNamed("xs:complexType").childNamed("xs:all") 
						).childWithAttribute("type", xsdItemName, xsdItem);
		} catch (ex) {
			// console.log("No Group Type description in root")
		}

		if (!xsdGroupProperties) 
			xsdGroupProperties = sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:sequence") 
						|| sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:all");
		
		if (!xsdGroupProperties) return "";

		return xsdGroupProperties;
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
			sender.LabelContentObjects.push({
				label: this.name.replace("-", ""),
				text: this.name
			});
			outPut = `<label ng-bind="'labels.${this.name.replace("-", "")}' | translate" class="field-caption ng-binding"></label>`;
		}

		if (!this.noTag) {
			outPut += "\n\t\t<" + this.tag;
			for (let key in this.attrs) {
				outPut += " " + key + "=\"" + this.attrs[key] + "\"";
			}
			outPut += ">\n";
		}

		if (this.options) {
			if (this.tag === 'select') {
				outPut += this.options.map((option) => {
					let lbl = option.option.toString().toString().replace(/\W+/g, "");
					sender.TextContentObjects.push({
						label: lbl,
						text: option.option
					});
					return `\t\t\t<option value="${option.value}">{{'labels.text.${lbl}' | translate}}</option>\n`;
				}).join("");
			} else {
				outPut += '<div class="radioclass">' + this.options.map((option) => {
					let lbl = option.label.toString().toString().replace(/\W+/g, "");
					sender.TextContentObjects.push({
						label: lbl,
						text: option.label
					});
					let req = '';
					if (this.attrs.required) 
						req = 'required="1"';
					return `<label class="radio-label"><input type="radio" name="${option.name}" value="${option.value}" ${req}>{{'labels.text.${lbl}' | translate}}</label>`;
				}).join("") + '</div>';
			}
		}

		if (this.autoclose)
			outPut += "\t\t</" + this.tag + ">\n";

		if (this.attrs.required === 1) {
			outPut += `\t\t<span ng-show="${this.formModel}.$touched && ${this.formModel}.$invalid && !ValidationDisabled" class="required-msg"><b>{{'${this.name.replace("-", "")}' | translate}}</b> {{'isrequired' | translate}}</span>`;
		}

		return outPut;
	}

	/**
	 * reportError - Report error via  XSDWebFormParserError 
	 * @param bool
	 */
	reportError(msg, item) {
		XSDWebFormParserError.reportError(msg, item);
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
