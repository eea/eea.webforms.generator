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

getJS("./assets/components/eeaheader.min.js");
getJS("./assets/components/eeamenu.min.js");
getJS("./assets/components/eeafooter.min.js");
getJS("./assets/components/eeaformtesting.min.js");
getJS("./assets/components/eealanguage.min.js");
getJS("./assets/components/eeatoolbar.min.js");
getJS("./assets/components/eealookup.min.js");
getJS("./assets/components/eeaformviewmode.min.js");
getJS("./assets/components/eeabuildinfo.min.js");

function getJS(url) {
	var oXmlHttp = new XMLHttpRequest();
	oXmlHttp.onreadystatechange = function() {
		if (oXmlHttp.readyState == 4) {
			if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
				IncludeJS(url, oXmlHttp.responseText);
		}
	}
	oXmlHttp.open('GET', url, false);
	oXmlHttp.send(null);
}

function IncludeJS(fileUrl, source) {
	var script = document.createElement("script");
	script.language = "javascript";
	script.type = "text/javascript";
	script.defer = true;
	script.text = source;
	document.getElementsByTagName('HEAD').item(0).appendChild(script);
}

