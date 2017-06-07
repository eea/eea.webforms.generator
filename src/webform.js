'use strict';

//var Version="0.2";

var app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', ['$eea', '$scope', '$http', '$timeout', '$window', '$translate', '$compile', WebFormAppCtrl]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($eea, $scope, $http, $timeout, $window, $translate, $compile) {

	$eea.init($scope);
	
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

