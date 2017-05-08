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
			"page"         			: this.parsePage,
			"form"          		: this.parseForm,
			"group"        			: this.parseGroup,
			"item"        			: this.parseItem,
			"input"         		: this.parseInput,
			"text"         			: this.parseText,
			"number"        		: this.parseNumber,
			"date"          		: this.parseDate,
			"select"        		: this.parseSelect,
			"lookup"        		: this.parseSelect
		};

		this.XSD_HTML_TYPES = {
			"xs:integer"			: "number",
			"xs:decimal"			: "number",
			"xs:date"				: "date",
			"xs:string"				: "text"
		}

		this.HTML_HEADER        	= '';
		this.HTML_FOOTER        	= '';
		this.HTML_TITLE        		= '';
		this.HTML_FORM_TITLE   		= '';
		this.HTMLObjects        	= [];
		this.TextContentObjects     = [];
		this.showLog            	= false;
		this.verbose            	= false;
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

				try {
					
					this.parseHTMLItem(htmlItem.children[i], xsdItem);
					this.htmlParse(htmlItem.children[i], xsdItem);

					this.setHeader(
						this.HTML_TITLE, 
						this.HTML_FORM_TITLE,
						this.TextContentObjects.map((label) => {
							return `${label.label} : '${label.text}',`;
					            }).join("\n\t\t\t\t")
					        );
					this.setFooter();
				} catch(err) {
					XSDWebFormParserError.reportError(err);
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
	parsePage(item, xsdItem, sender)
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);  

		if (!item.attr.title){
			XSDWebFormParserError.reportError(`Can not find Page Title (<page title="?" ..>)`);
		}

		sender.HTML_TITLE = item.attr.title;

	} 

	/**
	* parseForm - Parse Form Tag
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseForm(item, xsdItem, sender) 
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);  


		let formEnd = "<button type=\"submit\" class=\"submitbutton\">Submit Form</button>";


		var formObject = {
			name        		: item.attr.name,
			action      		: item.attr.action,
			tag         		: 'form',
			// tagclose    		: true,
			append      		: formEnd,
			attrs       		: {
						            name            	: item.attr.name,
						            id              	: item.attr.name.replace("-", ""),
						            'ew-action'     	: item.attr.action,
						            title           	: item.attr.title,
						            method         		: 'post',
						            class         		: 'ewform medium-12',
						            'ng-submit'     	: `submit(${item.attr.name})`
					        	},
			groups      		: [],
			tagToHtml   		:  XSDWebFormParserHTMLTags.tagToHtml
			}

		sender.HTML_FORM_TITLE = item.attr.title;

		sender.HTMLObjects.push({ type : "form", itemObject : formObject });

	}

	/**
	* parseGroup - Parse Group Tag
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

		let groupEnd = ''; 
		if (item.attr.multiple === "1") {
			let addRow = (item.attr.multiplelabel) ? item.attr.multiplelabel : 'Add Row';
			groupEnd += `<button type=\"button\" class="rowbutton" ng-click=\"addRow('${item.attr.element}')\" ng-model=\"group.item['${item.attr.element + "'].item['add" + item.attr.element}']\" group=\"${item.attr.element}\">${addRow}</button>`;
		}

		var groupObject = {
			name        		: item.attr.element,
			xsdName     		: xsdGroupTag.name,
			tag        			: 'fieldset',
			// tagclose   		: true,
			attrs       		: {
									'ew-map'  	: xsdGroupTag.name + "/" + item.attr.element,
									id        	: item.attr.element.replace("-", "")
					            },
			append      		: groupEnd,
			xsdXML      		: xsdGroupTag,
			items       		: [],
			tagToHtml   		: XSDWebFormParserHTMLTags.tagToHtml
		    }

		sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups.push({ type : "group", itemObject : groupObject });

	}

	/**
	* parseItem
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseItem(item, xsdItem, sender)
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);  

		let itemInfo = sender.getItemInfo(item, xsdItem, sender);

		let XSDWFormItemType;
		try {

			XSDWFormItemType = itemInfo.groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element).attr.type;
				
			if ((XSDWFormItemType in sender.XSD_HTML_TYPES)) {
				item.name = sender.XSD_HTML_TYPES[XSDWFormItemType];
			} else {
				item.name = "lookup";
			}

			sender.parseHTMLItem(item, xsdItem); 

		} catch (ex) {
			XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
		}		

	} 


	/**
	* parseInput - Parse Input Tag
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseInput(item, xsdItem, sender)
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);  

		let itemInfo = sender.getItemInfo(item, xsdItem, sender);

		var htmlItem = {
			name        		: item.attr.name,
			tag         		: 'input',
			tagclose    		: false,
			autoclose   		: false,
			hasLabel    		: true,
			attrs       		: {
									name        	: item.attr.name,
									id          	: item.attr.name.replace("-", ""),
									required    	: 1,
									type        	: 'text',
									'ng-model'  	: sender.getNgModel(item.attr.name, sender)
			            		},
			tagToHtml   		: XSDWebFormParserHTMLTags.tagToHtml
		            }

		sender.addItemToGroup(htmlItem, itemInfo, sender);

	} 

	/**
	* parseText - Parse Text Tag
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseText(item, xsdItem, sender) 
	{
		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {

			let itemInfo = sender.getItemInfo(item, xsdItem, sender);

			var htmlItem = {
				name 			: item.attr.element,
				tag 			: 'textarea',
				tagclose 		: false,
				autoclose 		: true,
				hasLabel 		: true,
				attrs 			: {
									name: item.attr.element,
									id: item.attr.element.replace("-", ""),
									required: 1,
									'ew-map': sender.getEwMap(item, itemInfo),
									'ng-model': sender.getNgModel(item.attr.element, sender)
								},
				tagToHtml		: XSDWebFormParserHTMLTags.tagToHtml
			}

			sender.addItemToGroup(htmlItem, itemInfo, sender);
		}

	} 

	/**
	* parseNumber - Parse Number Tag
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseNumber(item, xsdItem, sender) 
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);

		if (item.attr.element) {

			let itemInfo = sender.getItemInfo(item, xsdItem, sender);

			var htmlItem = {
				name 			: item.attr.element,
				tag 			: 'input',
				tagclose 		: false,
				autoclose		: false,
				hasLabel		: true,
				attrs			: {
									name: item.attr.element,
									id: item.attr.element.replace("-", ""),
									required: 1,
									type: "number",
									'ew-map': sender.getEwMap(item, itemInfo),
									'ng-model': sender.getNgModel(item.attr.element, sender)
								},
				tagToHtml		: XSDWebFormParserHTMLTags.tagToHtml
			}

			sender.addItemToGroup(htmlItem, itemInfo, sender);

		}

	} 

	/**
	* parseDate - Parse Date Tag
	* @param item
	* @param xsdItem
	* @param sender
	*/
	parseDate(item, xsdItem, sender) 
	{

		XSDWebFormParserLog.logHtmlTag(item.name, sender);    

		if (item.attr.element) {

			let itemInfo = sender.getItemInfo(item, xsdItem, sender);

			var htmlItem = {
				name 			: item.attr.element,
				tag 			: 'input',
				tagclose 		: false,
				autoclose 		: false,
				hasLabel 		: true,
				attrs			: {
									name: item.attr.element,
									id: item.attr.element.replace("-", ""),
									required: 1,
									type: "date",
									'ew-map': sender.getEwMap(item, itemInfo),
									'ng-model': sender.getNgModel(item.attr.element, sender)
								},
				tagToHtml 		: XSDWebFormParserHTMLTags.tagToHtml
			}

			sender.addItemToGroup(htmlItem, itemInfo, sender);
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

			let itemInfo = sender.getItemInfo(item, xsdItem, sender);

			let XSDWFormItem, XSDWFormItemTypeData;

			try {
				XSDWFormItem = itemInfo.groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element);
			} catch (ex) {
				XSDWebFormParserError.reportError(`Can not find "${item.attr.element}" element in XSD`, itemInfo.groupBase.itemObject.xsdXML);
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
			enums.eachChild((enm, index) => {

				if (enm.name === "xs:enumeration") {
					enumItems.push({ value: enm.attr.value, option: enm.attr.value });
				}

				if (enm.name === "xs:minInclusive") {
					let maxInclusive = enums.childNamed("xs:maxInclusive");
					if (!maxInclusive)
						XSDWebFormParserError.reportError(`Found minInclusive but not maxInclusive for "${XSDWFormItem.attr.type}/${enums.name}" element in XSD`, enums);

					let min = enm.attr.value;

					enumItems = Array(maxInclusive.attr.value - min + 1).fill(min).map((item, index) => {
						return { value: min, option: min++ };
					});

					return;
				}

			});

			var htmlItem = {
				name 			: item.attr.element,
				tag 			: 'select',
				tagclose 		: false,
				autoclose 		: true,
				hasLabel		: true,
				options 		: enumItems,
				attrs 			: {
									name: item.attr.element,
									id: item.attr.element.replace("-", ""),
									required: 1,
									'ew-map': sender.getEwMap(item, itemInfo),
									'ng-model': sender.getNgModel(item.attr.element, sender)
								},
				tagToHtml 		: XSDWebFormParserHTMLTags.tagToHtml
			}

			sender.addItemToGroup(htmlItem, itemInfo, sender);

		}

	} 

	/**
	* getItemInfo
	* @param item
	* @param xsdItem
	* @param sender
	*/
	getItemInfo(item, xsdItem, sender) 
	{
		var htmlBase = sender.HTMLObjects[sender.HTMLObjects.length - 1];
		var groupBase = htmlBase.itemObject.groups[htmlBase.itemObject.groups.length - 1];

		return {
			htmlBase 		: htmlBase,
			groupBase 		: groupBase,
			parentXsdName 	: groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element).name
		};

	}

	/**
	* getEwMap
	* @param item
	* @param itemInfo
	*/
	getEwMap(item, itemInfo) 
	{
		return itemInfo.groupBase.itemObject.xsdName + "/" + itemInfo.groupBase.itemObject.name + "/" + itemInfo.parentXsdName + "/" + item.attr.element;
	}

	/**
	* getNgModel
	* @param name
	* @param sender
	*/
	getNgModel(name, sender) 
	{
		return  "field." + sender.HTMLObjects[sender.HTMLObjects.length -1].itemObject.name + "." + name.replace("-", "");
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
	* addItemToGroup
	* @param htmlItem
	* @param itemInfo
	* @param sender
	*/
	addItemToGroup(htmlItem, itemInfo, sender)
	{
		itemInfo.htmlBase.itemObject.groups[itemInfo.htmlBase.itemObject.groups.length - 1].itemObject.items.push(htmlItem.tagToHtml(sender));
	}

	/**
	* tagToHtml
	*/
	static tagToHtml(sender) 
	{
		let outPut = '';

		if (this.hasLabel) {
			sender.TextContentObjects.push({ label: this.name.replace("-", ""), text: `${this.name}` });
			outPut = `<div class="field-caption ng-binding" ng-bind="'${this.name.replace("-", "")}' | translate"></div>`;
		}

		outPut += "<" + this.tag;

		for (let key in this.attrs) {
			outPut += " " + key + "=\"" + this.attrs[key] + "\"";
		}
		outPut += ">";

		if (this.options) {
			outPut += this.options.map((option, index) => {
				return `<option value="${option.value}">${option.option}</option>`;
			}).join("");
		}

		if (this.autoclose)
			outPut += "</" + this.tag + ">"

		return outPut;

	}


	/**
	* setHeaer
	* @param pageTitle
	*/

	setHeader(pageTitle, formTitle, labels) {

		this.HTML_HEADER = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${pageTitle}</title>

<script src="./assets/js/jquery.min.js"></script>
<script src="./assets/js/a/angular.min.js" ></script>
<script src="./assets/js/a/angular-translate.min.js" ></script>
<script src="./assets/js/a/angular-datepicker.min.js"></script>

<link rel="stylesheet" type="text/css" href="./assets/css/a/angular-datepicker.min.css"/>
<link rel="stylesheet" type="text/css" href="./assets/css/foundation.min.css"/>
<link rel="stylesheet" type="text/css" href="./assets/css/webform.css"/>

<link rel="shortcut icon" type="image/x-icon" href="./assets/img/favicon.ico"/>

<script type="text/javascript">

const app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', WebFormAppCtrl);

app.config(["$translateProvider",function($translateProvider){
  
  var TextContent = {
    	en : {
    		"language" 	: "Selected Language English",
    		"greeting" 	: "Welcome" ,
    		"number" 	: "#",
    		labels 		: {
    			${labels}
    		}
    	},
    	sp : {
    		"language" 	: "Selected Language Spanish",
    		"greeting" 	: "Bienvenida",
    		"number" 	: "#",
    		labels 		: {}  
    	}
  }
  
  $translateProvider.translations('en',TextContent.en);
  $translateProvider.translations('sp',TextContent.sp);
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.preferredLanguage('en');
  
}]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($scope, $http, $timeout, $window) {

	$scope.field = {};  
	$scope.multipleIndex = 1;

	$scope.toggleValidation = function(){
		$scope.ValidationDisabled = !$scope.ValidationDisabled;
	}

	$scope.submit = function(frm) {
		$scope.field[frm.$name].AEAPrice = 11;
		console.log(frm);
		console.log(frm['AEA-Price'].$$attr.ewMap);
		return false;
	};

	$scope.printPreview = function(){
		var conversionLink = [formApplicationUrl("/download/convert", urlProperties.baseURI, urlProperties.sessionID, urlProperties.fileID), "&conversionId=", HTMLconversionNumber].join("");
	$window.open(conversionLink, '_blank');
	}

	$scope.toggleValidation = function(){
		$scope.ValidationDisabled = !$scope.ValidationDisabled;
	}

	$scope.save = function(){
		dataRepository.saveInstance($scope.Webform);
	}

	$scope.close = function(){

		if (urlProperties.baseURI == ''){
				urlProperties.baseURI = "/";
		};
   	 	var windowLocation = (urlProperties.envelope && urlProperties.envelope.length > 0) ? urlProperties.envelope : urlProperties.baseURI;
    	if ($scope.Webform.$dirty){
        	if ($window.confirm('You have made changes in the questionnaire! \\n\\n Do you want to leave without saving the data?')){
            	window.location = windowLocation;
        	}
    	}
    	else {
       	 	window.location = windowLocation;
    	}

	}

	$scope.addRow = function() {
		alert('Row');
	};

}
</script>

</head>
<body ng-app="WebFormApp">

<div id="container" ng-controller="WebFormAppCtrl">

<div class="top-bar">
<div class="top-bar-left">
<ul class="menu">
    <li class="menu-text">EEA</li>
    <li><a href="#">One</a></li>
    <li><a href="#">Two</a></li>
    <li><a href="#">Three</a></li>
</ul>
</div>
</div>

<div class="callout small primary">
	<div class="row column text-center">
		<h1>EEA</h1>
		<h2 class="subheader">Web Form</h2>
	</div>
</div>

<div id="workarea" class="row collapse">
	
	<div class="row">
		<div class="multiple-index medium-1">{{'number' | translate}} <span class="index">{{multipleIndex}}</span></div>
		<div class="multiple-index-right medium-11"><h2>${formTitle}</h2></div>
	</div>

	<div class="row">
	`;       
	}


	/**
	* setFooter
	*/
	setFooter() {

		this.HTML_FOOTER = `
	</div>

</div>

	<div id="pagefoot" class="row">
        <div class="columns small-4">
            <div class="switch round tiny">
                <span>Validation </span>
                <span ng-show="ValidationDisabled" class="ng-hide">Off</span>
                <span ng-show="!ValidationDisabled">On</span>
                <div class="switch round tiny wfswitch">
                  <input id="validationSwitch" class="switch-input" checked ng-click="toggleValidation()" type="checkbox">
                  <label for="validationSwitch" class="switch-paddle"></label>
                </div>
                <label for="validationSwitch"></label>
            </div> 
        </div>
        <div class="columns small-8 text-right">
            <button ng-click="save()">Save</button>
            <button ng-click="printPreview()">Print Preview</button>
            <button ng-click="close()">Close</button>
        </div>
    </div>

</div>

<footer class="footer">
<div class="footer-wrapper">
${new Date()}
</div>
</footer>

</body>
</html>
`;
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