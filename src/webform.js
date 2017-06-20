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

eea.services.get("eeawebformcore");
eea.components.getAll([
	"eeaheader", 
	"eeamenu", 
	"eeafooter", 
	"eeaformtesting", 
	"eealanguage", 
	"eeatoolbar", 
	"eealookup", 
	"eeaformviewmode", 
	// "eeaformvalidation", 
	"eeabuildinfo"
]);
eea.css.get("webform.all");

/*

TOTEST
Enviromental Computing and Networking

 Try dynamic loading in object - chain

 // Use remote libraries and functions or get data instantly 
 eea.greece.athens.chalandri.getSomething()
 eea.italy.rome.somewhere.getSomethingElse()
 
 // Travel guide
 eea.italy.rome.somearea.tourism.list()

 // Shopping guide - get area shops
 eea.italy.rome.somearea.shopping.list()
 eea.italy.rome.somearea.shopping.shop1.listProducts()

 // Telephone system via internet
 // No cables and satelites
 call $1.$2.$8.$3.ring()

 // Check available public functionality - old BBS style
 eea.denmark.eea.getFunctionList()
 // Use the listed functionality
 // Local tv streaming - no atmosphere antenna transmissions and satelites 
 eea.denmark.eea.streamChannel(120)
 // Video Conference Channel
 eea.denmark.eea.joinVideoConference("test")
 // Connect your iot sensor
 eea.iot.api.client.connect()

	[eea root library] <--- bind library test eea.test (no downtime)
				 ^
				 |
				 /\
				/  \
   dynamic lib 1 eea.test.area1      dynamic lib 2 <-- eea.test.area2 
		      				 ^
						 |
						 /\
						/  \
					eea.test.area2.iot
	eea.test.area2.iot.device1.getData() 	   eea.test.area2.iot.device2.getData()


CANNOTTEST

Quantum spooky phenomenon
parallel interacted particles to digital
Example:
128 one side <--> 128 interacted other side 

*/
