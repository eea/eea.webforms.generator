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
            "page"          : this.parsePage,
            "form"          : this.parseForm,
            "group"         : this.parseGroup,
            "input"         : this.parseInput,
            "text"          : this.parseText,
            "number"        : this.parseNumber,
            "date"          : this.parseDate,
            "select"        : this.parseSelect
        };

        this.HTML_HEADER = '';
        this.HTML_FOOTER = '';
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

                try {
                    this.parseHTMLItem(htmlItem.children[i], xsdItem);
                    this.htmlParse(htmlItem.children[i], xsdItem);
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

        sender.setHeader(item.attr.title);
        sender.setFooter();

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
                    name        : item.attr.name,
                    action      : item.attr.action,
                    tag         : 'form',
                    // tagclose    : true,
                    append      : formEnd,
                    attrs       : {
                                    name            : item.attr.name,
                                    id              : item.attr.name.replace("-", ""),
                                    'ew-action'     : item.attr.action,
                                    method          : 'post',
                                    'ng-submit'     : `submit(${item.attr.name})`
                                },
                    groups      : [],
                    tagToHtml   :  XSDWebFormParserHTMLTags.tagToHtml
                }

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
            groupEnd += `<button type=\"button\" class="rowbutton" ng-click=\"addRow('${item.attr.element}')\" ng-model=\"group.item['${item.attr.element + "'].item['add" + item.attr.element}']\" group=\"${item.attr.element}\"></button>`;
        }
        
        var groupObject = {
                    name        : item.attr.element,
                    xsdName     : xsdGroupTag.name,
                    tag         : 'fieldset',
                    // tagclose    : true,
                    attrs       : {
                                    'ew-map'  : xsdGroupTag.name + "/" + item.attr.element,
                                    id        : item.attr.element.replace("-", "")
                                },
                    append      : groupEnd,
                    xsdXML      : xsdGroupTag,
                    items       : [],
                    tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
                }
         
        sender.HTMLObjects[sender.HTMLObjects.length - 1].itemObject.groups.push({ type : "group", itemObject : groupObject });

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
                            name        : item.attr.name,
                            tag         : 'input',
                            tagclose    : false,
                            autoclose   : false,
                            hasLabel    : true,
                            attrs       : {
                                            name        : item.attr.name,
                                            id          : item.attr.name.replace("-", ""),
                                            type        : 'text',
                                            'ng-model'  : sender.getNgModel(item.attr.name, sender)
                                        },
                            tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
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
                                name        : item.attr.element,
                                tag         : 'textarea',
                                tagclose    : false,
                                autoclose   : true,
                                hasLabel    : true,
                                attrs       : {
                                                name        : item.attr.element,
                                                id          : item.attr.element.replace("-", ""),
                                                'ew-map'    : sender.getEwMap(item, itemInfo),
                                                'ng-model'  : sender.getNgModel(item.attr.element, sender)
                                            },
                                tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
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
                                name        : item.attr.element,
                                tag         : 'input',
                                tagclose    : false,
                                autoclose   : false,
                                hasLabel    : true,
                                attrs       : {
                                                name        : item.attr.element,
                                                id          : item.attr.element.replace("-", ""),
                                                type        : "number",
                                                'ew-map'    : sender.getEwMap(item, itemInfo),
                                                'ng-model'  : sender.getNgModel(item.attr.element, sender)
                                            },
                                tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
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
                                name        : item.attr.element,
                                tag         : 'input',
                                tagclose    : false,
                                autoclose   : false,
                                hasLabel    : true,
                                attrs       : {
                                                name        : item.attr.element,
                                                id          : item.attr.element.replace("-", ""),
                                                type        : "date",
                                                'ew-map'    : sender.getEwMap(item, itemInfo),
                                                'ng-model'  : sender.getNgModel(item.attr.element, sender)
                                            },
                                tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
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
            
            var htmlItem = {
                                name        : item.attr.element,
                                tag         : 'select',
                                tagclose    : false,
                                autoclose   : true,
                                hasLabel    : true,
                                attrs       : {
                                                name        : item.attr.element,
                                                id          : item.attr.element.replace("-", ""),
                                                'ew-map'    : sender.getEwMap(item, itemInfo),
                                                'ng-model'  : sender.getNgModel(item.attr.element, sender)
                                            },
                                tagToHtml   : XSDWebFormParserHTMLTags.tagToHtml
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
        var groupBase = htmlBase.itemObject.groups[htmlBase.itemObject.groups.length -1];

        return {
                htmlBase        : htmlBase,
                groupBase       : groupBase,
                parentXsdName   : groupBase.itemObject.xsdXML.childWithAttribute("name", item.attr.element).name
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
        itemInfo.htmlBase.itemObject.groups[itemInfo.htmlBase.itemObject.groups.length - 1].itemObject.items.push(htmlItem.tagToHtml());
    }

    /**
    * tagToHtml
    */
    static tagToHtml() 
    {
        let outPut = '';

        if (this.hasLabel) 
            outPut = `<div class="field-caption ng-binding" ng-bind="Labels.labels.${this.name.replace("-", "")}"></div>`;

        outPut += "<" + this.tag;

        for (let key in this.attrs) {
            outPut += " " + key + "=\"" + this.attrs[key] +"\""; 
        }
        outPut += ">";

        if (this.autoclose)
            outPut += "</" + this.tag + ">"
        
        return outPut;
    }


    /**
     * setHeaer
     * @param pageTitle
     */
    
    setHeader(pageTitle) {

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
    <script src="./assets/js/a/angular-datepicker.min.js"></script>

    <link rel="stylesheet" type="text/css" href="./assets/css/a/angular-datepicker.min.css"/>
    <link rel="stylesheet" type="text/css" href="./assets/css/foundation.min.css"/>
    <link rel="stylesheet" type="text/css" href="./assets/css/webform.css"/>

    <link rel="shortcut icon" type="image/x-icon" href="./assets/img/favicon.ico"/>

    <script type="text/javascript">

    const app = angular.module('WebFormApp', []);
    app.controller('WebFormAppCtrl', WebFormAppCtrl);

    /**
     * WebFormAppCtrl: Main controller
     */
    function WebFormAppCtrl($scope, $http, $timeout) {
    
        $scope.field = {};  
        $scope.Labels = {
            labels : {}
        };  

        $scope.Labels.labels.AEA = "Test Label";

        $scope.submit = function(frm) {
            $scope.field[frm.$name].AEAPrice = 11;
            console.log(frm);
            console.log(frm['AEA-Price'].$$attr.ewMap);
            return false;
        };
 

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
     
    <div class="callout large primary">
        <div class="row column text-center">
            <h1>EEA</h1>
            <h2 class="subheader">Web Form</h2>
        </div>
    </div>

    <div class="row">
        <div class="text-center medium-offset-3 medium-6">
            <h2>Test</h2>
        </div>
    </div>
     
    <div id="workarea" class="row collapse">
       
`;       
    }


    /**
     * setFooter
     */
    
    setFooter() {

        this.HTML_FOOTER = `
      
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