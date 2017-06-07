'use strict';

//var Vesrion="0.2";

var app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', ['$$', '$scope', '$http', '$timeout', '$window', '$translate', '$compile', WebFormAppCtrl]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($$, $scope, $http, $timeout, $window, $translate, $compile) {

	$scope.field = {};
	$scope.multipleIndex = 1;
	$scope.ValidationDisabled = false;
	$scope.selectedLanguage = "en";
	$scope.groups = groups;

	$scope.submit = function (frm, test) {

		for (var form in $scope.field) {
			if (frm) {
				if (frm.$name !== form) continue;
			}

			if (test) return false;
		
			var frmObj = $scope.field[form];
			var postContent = '';
			for (var element in frmObj) {
				postContent += "&" + encodeURIComponent(element) + "=" + encodeURIComponent(frmObj[element]);
			}

			$http({
				method: 'POST',
				url: $("#" + form).attr("eea-action"),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: postContent
			}).then(			
				function(response) {
					console.log("response", response.status);
				},
				function(error) {
					console.log("error", error.status);
				});

			if (frm) { break; }
		}

		return false;
	};

	$scope.addRow = function (frm, group) {
		$$.group.addRow(frm, group, $scope, $compile);
	};

	$scope.deleteRow = function (frm, group, id) {
		$$.group.deleteRow(frm, group, id, $scope);
	};
}

