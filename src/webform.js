'use strict';

//var Vesrion="0.2";

var app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', ['$$', '$scope', '$http', '$timeout', '$window', '$translate', '$compile', WebFormAppCtrl]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($$, $scope, $http, $timeout, $window, $translate, $compile) {

	$$.init($scope);

	$scope.submit = function (frm, test) {
		return $$.form.submit(frm, test, $scope);
	};

	$scope.addRow = function (frm, group) {
		$$.group.addRow(frm, group, $scope, $compile);
	};

	$scope.deleteRow = function (frm, group, id) {
		$$.group.deleteRow(frm, group, id, $scope);
	};
}

