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

	//try dynamic loading in object - chain
	// eea.greece.athens.chalandri.getSomething()
	// eea.italy.rome.somewhere.getSomethingElse()
	// call $1.$2.$8.$3.ring()
	// eea.denmark.eea.getFunctionList()
	// eea.denmark.eea.streamChannel(120)
	// eea.denmark.eea.joinVideoConference("test")
	// eea.iot.api.client.connect()
	
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

eea.Services.get("eeawebformcore");
eea.Components.getAll([
	"eeaheader", 
	"eeamenu", 
	"eeafooter", 
	"eeaformtesting", 
	"eealanguage", 
	"eeatoolbar", 
	"eealookup", 
	"eeaformviewmode", 
	"eeabuildinfo"
]);
eea.JS.get("jquery");
eea.CSS.get("webform.all");