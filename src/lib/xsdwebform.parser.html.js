/**
 * @file xsdwebform.parser.html.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

import XSDWebFormParserError from './xsdwebform.parser.error.js';

/**
 * Class XSDWebFormParserHTMLTags
 * Parser for XSD Schema Tags 
 */
class XSDWebFormParserHTMLTags {
	/**
	 * Class constructor
	 */
	constructor() {
		this.HTMLObjects = [];
		this.LabelContentObjects = [];
		this.TextContentObjects = [];
		this.showLog = false;
		this.verbose = false;

		this.HTML_TYPES = {
			"page": this.parsePage,
			"form": this.parseForm,
			"group": this.parseGroup,
			"subgroup": this.parseSubGroup,
			"item": this.parseItem,
			"input": this.parseInput,
			"text": this.parseText,
			"number": this.parseNumber,
			//TODO: "decimal": this.parseDecimal,
			"positivenumber": this.parseNumberP,
			"date": this.parseDate,
			"select": this.parseSelect,
			"lookup": this.parseLookup,
			"radio": this.parseRadio,
			"checkbox": this.parseCheckbox,
			"radioorselect" : this.decideRadioCheck
		};

		this.XSD_HTML_TYPES = {
			"xs:integer": "number", //TODO: pattern ? totalDigits
			"xs:decimal": "number", //TODO: decimal, pattern="[0-9]+([\.,][0-9]+)?" step="0.01"(?) https://stackoverflow.com/questions/15303940/how-to-handle-floats-and-decimal-separators-with-html5-input-type-number
			"NonNegativeIntegerType": "positivenumber",
			"xs:date": "date",
			"DateType": "date",
			"xs:string": "input",
			"xs:boolean": "radioorselect"
		};//TODO: Array of Types ? (minOccurs maxOccurs)

		this.XSD_PROPERTIES = {
			"minInclusive": (inp) => { return `min="${inp}"`; },
			"maxInclusive": (inp) => { return `max="${inp}"`; },
			"minLength": (inp) => { return `minlength="${inp}"`; },
			"maxLength": (inp) => { return `maxlength="${inp}"`; },
			"multiValueDelim":  (inp) => { return `placeholder="use ${inp} as separator (e.g. text${inp}text)"`; },
			"minOccurs": () => {},
			"maxOccurs": () => {},
			"totalDigits": (inp) => { return `pattern="[0-9]{1,${inp}}"`; },
		};
		
		//DD Custom Properties
		this.XSD_DD_PROPERTIES = {
			"Methodology": (item, inp) => { 
				let lbl = (item.attr.element || item.attr.name) + "_title";
				this.TextContentObjects.push({
					label: lbl,
					text: inp.replace(/\"/g, "&quot;")
				});
				return `title="{{'labels.text.${lbl}' | translate}}"`; 
			},
			"Definition": (item, inp) => {
				let lbl = (item.attr.element || item.attr.name) + "_def";
				this.TextContentObjects.push({
					label: lbl,
					text: inp.replace(/\"/g, "&quot;")
				});
				return `def="{{'labels.text.${lbl}' | translate}}"`; 
			}
		};
	}

	/**
	 * htmlParse - Parse inner XML Document
	 * @param htmlItem
	 * @param xsdItem
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
			// Execute hash value=>function
			// i.e. HTML_TYPES["item"] => (this.parseItem)(item, xsdItem, this)
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
		sender.logger.logHtmlTag(item, sender);

		sender.LabelContentObjects.push({
			label: "pagetitle",
			text: item.attr.title || ""
		});
	}

	/**
	 * parseForm - Parse Form Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseForm(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);

		sender.LabelContentObjects.push({
			label: "formtitle",
			text: item.attr.title || ""
		});
		let formNum = sender.HTMLObjects.length + 1;
		var formObject = {
			name: 'form' + formNum ,
			action: item.attr.action,
			tag: 'form',
			attrs: {
				name: 'form' + formNum,
				id: 'form' + formNum,
				'eea-action': item.attr.action,
				method: 'post',
				class: 'eeaform medium-12',
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
		sender.logger.logHtmlTag(item, sender);

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
				'xsd-map': xsdGroupTag.name + "/" + item.attr.element,
				id: item.attr.element.replace("-", ""),
				multi: canAddRows
			},
			prepend: groupStart,
			append: groupEnd,
			xsdXML: xsdGroupTag,
			subgroups: [],
			items: [],
			tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
		};
		sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups.push({
			type: "group",
			itemObject: groupObject
		});
	}

	/**
	 * parseSubGroup - Parse SubGroup Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseSubGroup(item, xsdItem, sender) {
		let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		item.inactive = true;
		var subGroupObject = {
			name: 'subgroup',
			tag: 'fieldset',
			autoclose: false,
			hasLabel: false,
			hideFromLog: true,
			noDiv: true,
			appendAfter: item.childrenNamed("item").length + (item.childrenNamed("subgroup").length * 2) + item.childrenNamed("input").length,
			appendAfterContent: "</fieldset>",
			attrs: {
				class: "subgroup"
			},
			tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
		};

		sender.addItemToGroup(subGroupObject, itemInfo);
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
			
			// Check for properties
			sender.getXSDProperties(item,  itemInfo.groupBase.itemObject.xsdXML, XSDWFormItem, xsdItem, sender);
			// Check for and get Label
			sender.getLabel(item, xsdItem, sender);

			// Check if Lookup
			if (item.attr.lookup) {
				item.name = "lookup";
				sender.parseHTMLItem(item, xsdItem);
				return;
			}

			XSDWFormItemType = XSDWFormItem.attr.type;

			if ((XSDWFormItemType in sender.XSD_HTML_TYPES)) {
				item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
			} else {
				let subXSDWFormItem = sender.getItemByName(XSDWFormItemType, xsdItem).childNamed("xs:simpleContent");
				if (subXSDWFormItem) {
					subXSDWFormItem = subXSDWFormItem.childNamed("xs:extension");

					if (subXSDWFormItem.attr.base) {
						XSDWFormItemType = subXSDWFormItem.attr.base;
						item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
					}
				}
				
				if (!(XSDWFormItemType in sender.XSD_HTML_TYPES)) {
					item.name = "select";
				}
			}
			
			if (XSDWFormItemType === "xs:integer" && item.xsdAttrs.src.minInclusive && item.xsdAttrs.src.maxInclusive) {
				item.name = "select";
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
		sender.logger.logHtmlTag(item, sender);

		let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		let name = (item.attr.name) ? item.attr.name : item.attr.element;
		let itemFormModel = sender.getFullFormName(name, sender);
		name = name.replace("-", "");
		
		var htmlItem = {
			name: name,
			tag: 'input',
			autoclose: false,
			xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
			hasLabel: true,
			label: item.label, 
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
		sender.addItemToGroup(htmlItem, itemInfo);
	}

	/**
	 * parseText - Parse Text Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseText(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element.replace("-", ""),
				tag: 'textarea',
				autoclose: true,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element.replace("-", "") + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
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
		sender.logger.logHtmlTag(item, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'input',
				autoclose: false,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element.replace("-", "") + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					type: "number",
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			
			if (positive) {
				htmlItem.attrs.min = 0;
			}

			sender.addItemToGroup(htmlItem, itemInfo);
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
		sender.logger.logHtmlTag(item, sender);

		if (item.attr.element) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element.replace("-", ""),
				tag: 'input',
				autoclose: false,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					type: "date",
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
		}
	}

	/**
	 * parseSelect - Parse Select Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseSelect(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);

		if (item.attr.element) {
		
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
			let XSDWFormItem, XSDWFormItemTypeData;

			XSDWFormItem = sender.getItemByName(item.attr.element, itemInfo.groupBase.itemObject.xsdXML) || sender.getItemByName(item.attr.element, xsdItem);
			try {
				XSDWFormItemTypeData = sender.getItemByName((XSDWFormItem.attr.type || XSDWFormItem.childNamed("xs:simpleType").childNamed("xs:restriction").attr.type), xsdItem) || XSDWFormItem.childNamed("xs:simpleType");
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
				autoclose: true,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				options: enumItems,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
		}
	}

	/**
	 * parseLookup - Parse  Lookup Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseLookup(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);
		
		if (item.attr.lookup) {
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'lookup',
				autoclose: true,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				hide: '!h__' + item.attr.element + '${{$index + 1}}',
				formModel: itemFormModel,
				attrs: {
					name: "_" + item.attr.element + '${{$index + 1}}',
					id: "_" + item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					lookup: item.attr.lookup,
					scp: "this",
					'lu-data': item.attr['lu-data'],
					'lu-value': item.attr['lu-value'],
					'lu-option': item.attr['lu-option'],
					'lu-name': item.attr.element + '${{$index + 1}}',
					'lu-order': item.attr['lu-order'],
					autoselect: item.attr.autoselect,
					hideonautoselect: item.attr.hideonautoselect,
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'parent-ng-model': 'field.' + itemFormModel
				},
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
		}

	}
	
	/**
	 * parseRadio - Parse  Radio Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseRadio(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);

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
					sender.logger.logTODO("check radio reference : enm.attr.ref : " + enm.attr.ref);
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
				autoclose: false,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				noTag: true,
				options: enumItems,
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					required: 1,
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				itemPrepend: "<div class=\"radioclass\">",
				itemAppend: "</div>",
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
		}
	}

	/**
	 * parseCheckbox - Parse  Checkbox Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	parseCheckbox(item, xsdItem, sender) {
		sender.logger.logHtmlTag(item, sender);
		
		if (item.attr.element) {
			
			let itemInfo = sender.getItemInfo(item, xsdItem, sender);
		
			let itemFormModel = sender.getFullFormName(item.attr.element, sender);
			var htmlItem = {
				name: item.attr.element,
				tag: 'input',
				autoclose: false,
				xsdAttrs: (item.xsdAttrs) ? item.xsdAttrs .html : [],
				hasLabel: true,
				label: item.label, 
				formModel: itemFormModel,
				attrs: {
					name: item.attr.element + '${{$index + 1}}',
					id: item.attr.element.replace("-", "") + '${{$index + 1}}',
					type: "checkbox",
					'xsd-map': sender.getXsdMap(item, itemInfo),
					'ng-model': 'field.' + itemFormModel
				},
				itemPrepend: "\n\t\t\t\t<div class=\"checkboxclass\">",
				itemAppend: "\t\t\t\t</div>",
				tagToHtml: XSDWebFormParserHTMLTags.tagToHtml
			};
			sender.addItemToGroup(htmlItem, itemInfo);
		}

	}

	/**
	 * decideRadioCheck - Parse  Checkbox Tag
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	decideRadioCheck(item, xsdItem, sender) {
		if (item.attr.element) {
			if (!sender.getTypeByName(item.attr.element, xsdItem)) 
				item.name = "checkbox";
			else 
				item.name = "radio";
		}		
		sender.parseHTMLItem(item, xsdItem);
	}

	/**
	 * getXSDProperties - Parse XSD Properties
	 * @param item
	 * @param groupxsdItem
	 * @param xsdsimpletype
	 * @param xsdItem
	 * @param sender
	 */
	getXSDProperties(item, groupxsdItem, xsdsimpletype, xsdItem, sender) {
		// Create an XML element attributes/properties placeholder object
		item.xsdAttrs = { src : {}, html : [] };
		
		// Get XSD Element properties in group root
		let XSDWFormItem = sender.getItemByName(item.attr.element, groupxsdItem) || sender.getItemByRef(item.attr.element, groupxsdItem) ;
		
		for (let attr in XSDWFormItem.attr) {
			let rattr = attr.split(':')[1] || attr;
			if (rattr in this.XSD_PROPERTIES) {
				item.xsdAttrs.src[rattr] = XSDWFormItem.attr[rattr];
				let htmlVal = (this.XSD_PROPERTIES[rattr])(XSDWFormItem.attr[attr]);
				if (htmlVal)
					item.xsdAttrs.html.push(htmlVal);
			}
		}
		
		// Get XSD Element properties in simpleType
		xsdsimpletype.eachChild((el) =>  {
			let rname = el.name.split(':')[1] || el;
			if (rname in this.XSD_PROPERTIES)  {
				item.xsdAttrs.src[rname] = el.attr.value;
				let htmlVal = (this.XSD_PROPERTIES[rname])(el.attr.value);
				if (htmlVal)
					item.xsdAttrs.html.push(htmlVal);
			}
		});

		let XSDWFormItemInfo = sender.getItemByName(item.attr.element, xsdItem);
		if (XSDWFormItemInfo) {
			XSDWFormItemInfo = XSDWFormItemInfo.childNamed("xs:annotation");
			if (XSDWFormItemInfo) {
				XSDWFormItemInfo = XSDWFormItemInfo.childNamed("xs:documentation");
				XSDWFormItemInfo.eachChild((el) =>  {
					let rname = el.name.split(':')[1] || el;
					if (rname in this.XSD_DD_PROPERTIES)  {
						item.xsdAttrs.src[rname] = el.val;
						let htmlVal = (this.XSD_DD_PROPERTIES[rname])(item, el.val);
						if (htmlVal)
							item.xsdAttrs.html.push(htmlVal);
					}
				});
			}
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

		var parentName = sender.getItemByName(item.attr.element, groupBase.itemObject.xsdXML)
				|| sender.getItemByRef(item.attr.element, groupBase.itemObject.xsdXML);
		
		return {
			htmlBase: htmlBase,
			groupBase: groupBase,
			parentXsdName: parentName.name
		};
	}

	/**
	 * getXsdMap
	 * @param item
	 * @param itemInfo
	 */
	getXsdMap(item, itemInfo) {
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
		
		return XSDWFormComplexItems;
	}

	/**
	 * getXSDGroupProperties - Find and get XSD Group Properties
	 * @param xsdItemName
	 * @param xsdItem
	 */
	getXSDGroupProperties(xsdItemName, xsdItem, sender) {
		var xsdGroupProperties;

		if (!xsdGroupProperties)  {
			try {
				xsdGroupProperties = ( xsdItem.childNamed("xs:element").childNamed("xs:complexType").childNamed("xs:sequence") 
							|| xsdItem.childNamed("xs:element").childNamed("xs:complexType").childNamed("xs:all") 
							).childWithAttribute("type", xsdItemName, xsdItem);
			} catch (ex) {
				// console.log("No Group Type description in root")
			}
		}
		
		if (!xsdGroupProperties) 
			xsdGroupProperties = sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:sequence") 
						|| sender.getItemByName(xsdItemName, xsdItem).childNamed("xs:complexType").childNamed("xs:all");
		
		if (!xsdGroupProperties.attr.maxOccurs) 
			xsdGroupProperties.attr.maxOccurs =  xsdItem.childWithAttribute("name", xsdItemName).attr.maxOccurs;

		return xsdGroupProperties;
	}

	/**
	 * addItemToGroup
	 * @param htmlItem
	 * @param itemInfo
	 * @param sender
	 */
	addItemToGroup(htmlItem, itemInfo) {
		itemInfo.htmlBase.itemObject.groups[itemInfo.htmlBase.itemObject.groups.length - 1].itemObject.items.push(htmlItem);
	}

	/**
	 * getLabel - Check for and get Label
	 * @param item
	 * @param xsdItem
	 * @param sender
	 */
	getLabel(item, xsdItem, sender) {
		let XSDWFormItemLabel = sender.getItemByName(item.attr.element, xsdItem);
		let lval = sender.xxQuery("xs:annotation/xs:documentation/(.*?):Name", XSDWFormItemLabel, sender);
		if (lval)
			item.label = lval.val;
	}

	/**
	 * xxQuery
	 * @param xstr
	 * @param xsdItem
	 * @param sender
	 */
	xxQuery(xstr, xsdItem, sender) {
		if (!xsdItem) return;

		var xstrArr = xstr.split("/");
		var xsdElement = xsdItem;
		xstrArr.forEach((item) => {
			xsdElement = sender.getItemByNameRegex(item, xsdElement);
			if (!xsdElement) return;
		});

		return xsdElement;
	}

	/**
	 * getTypeByName
	 * @param itemname
	 * @param xsdItem
	 */
	getTypeByName(itemname, xsdItem) {
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
	 * getItemByNameRegex 
	 * @param itemname
	 * @param xsdItem
	 */
	getItemByNameRegex(itemname, xsdItem) {
		if (!xsdItem) return;
		for (var i = 0, l = xsdItem.children.length; i < l; i++) {
			var child = xsdItem.children[i];
			if (child.type === "element")
				if (child.name.match(itemname)) return child;
		}
		return undefined;
	}

	/**
	 * tagToHtml
	 */
	static tagToHtml(sender, tabs = 4) {
		let outPut = '';
		let tabspace = Array(tabs + 1).join("\t");

		if (this.hasLabel) {
			sender.LabelContentObjects.push({
				label: this.name.replace("-", ""),
				text: this.label || this.name
			});
			outPut += `<label ng-bind="'labels.${this.name.replace("-", "")}' | translate" class="field-caption ng-binding"></label>`;
		}

		if (this.itemPrepend) {
			outPut += this.itemPrepend;
		}

		if (!this.noTag) {
			outPut +=  "\n" + tabspace + "<" + this.tag;
			for (let key in this.attrs) {
				if (this.attrs[key]) outPut += " " + key + "=\"" + this.attrs[key] + "\"";
			}
			if (this.xsdAttrs) {
				this.xsdAttrs.forEach((item) => {
					outPut += " " + item;
				});
			}
			outPut += ">\n";
		}

		if (this.options) {
			if (this.tag === 'select') {
				outPut += tabspace + "\t<option value=\"\"></option>\n";
				outPut += this.options.map((option) => {
					let lbl = option.option.toString().replace(/\W+/g, "");
					sender.TextContentObjects.push({
						label: lbl,
						text: option.option
					});
					return `${tabspace}\t<option value="${option.value}">{{'labels.text.${lbl}' | translate}}</option>\n`;
				}).join("");
			} else {
				outPut += this.options.map((option) => {
					let lbl = option.label.toString().replace(/\W+/g, "");
					sender.TextContentObjects.push({
						label: lbl,
						text: option.label
					});
					let req = '';
					if (this.attrs.required) 
						req = 'required="1"';
					return `<label class="radio-label"><input type="radio" name="${option.name}" value="${option.value}" ${req}>{{'labels.text.${lbl}' | translate}}</label>`;
				}).join("");
			}
		}

		if (this.itemAppend) {
			outPut += this.itemAppend;
		}

		if (this.autoclose)
			outPut += tabspace + "</" + this.tag + ">\n";

		if (this.attrs.required === 1) {
			//TODO: Try transfer  Validation Checking Labels in EEA Form Validation Component
			outPut += `${tabspace}<span ng-show="${this.formModel}.$touched && ${this.formModel}.$invalid && !ValidationDisabled" class="required-msg"><em>{{'${this.name.replace("-", "")}' | translate}}</em> {{'isrequired' | translate}}</span>`;
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
	 * setLogger
	 * @param logger
	 */
	setLogger(logger) {
		this.logger = logger;
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
