'use strict';

//var Version="0.2";

var app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', ['$eea', '$scope', '$http', '$timeout', '$window', '$translate', '$compile', WebFormAppCtrl]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($eea, $scope, $http, $timeout, $window, $translate, $compile) {

	$eea.init($scope);

	//examples - active js rest
	
	// js libraries
	//$eea.libraries.$.2.2
	//$eea.libraries.angular.1.6
	
	//$eea.data.destinations.json


	$scope.submit = function (frm, test) {
		return $eea.form.submit(frm, test, $scope);
	};
	
	$scope.addRow = function (frm, group) {
		$eea.group.addRow(frm, group, $scope);
	};
	
	$scope.deleteRow = function (frm, group, id) {
		$eea.group.deleteRow(frm, group, id, $scope);
	};
}

/**
/ eeaLoader
*/
var eeaLoader  = {
	getAllJS : function(scripts) {
		scripts.forEach(function(script) {
			eeaLoader.getJS(script);
		})
	},
	getJS : function(script) {
		var oXmlHttp = new XMLHttpRequest();
		oXmlHttp.onreadystatechange = function() {
			if (oXmlHttp.readyState == 4) {
				if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
					eeaLoader.includeJS(script, oXmlHttp.responseText);
			}
		}
		oXmlHttp.open('GET', script, false);
		oXmlHttp.send(null);
	},
	includeJS : function (fileUrl, source) {
		var script = document.createElement("script");
		script.language = "javascript";
		script.type = "text/javascript";
		script.defer = true;
		script.text = source;
		document.getElementsByTagName('HEAD').item(0).appendChild(script);
	}
}

eeaLoader.getAllJS([
	"./assets/services/eeawebformcore.min.js", 
	"./assets/components/eeaheader.min.js", 
	"./assets/components/eeamenu.min.js", 
	"./assets/components/eeafooter.min.js", 
	"./assets/components/eeaformtesting.min.js", 
	"./assets/components/eealanguage.min.js", 
	"./assets/components/eeatoolbar.min.js", 
	"./assets/components/eealookup.min.js", 
	"./assets/components/eeaformviewmode.min.js", 
	"./assets/components/eeabuildinfo.min.js"
]);


