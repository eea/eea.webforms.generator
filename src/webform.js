
var app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', WebFormAppCtrl);

// app.config(["$translateProvider", function($translateProvider) {
// 	$translateProvider.useUrlLoader(langFile);
// 	$translateProvider.useSanitizeValueStrategy('escapeParameters');
// 	$translateProvider.fallbackLanguage('en');
// 	$translateProvider.determinePreferredLanguage();
// }]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($scope, $http, $timeout, $window,  $translate, $compile) {
 
	$scope.field = {};  
	$scope.multipleIndex = 1;
	$scope.ValidationDisabled = false;
	$scope.selectedLanguage = "en";
	$scope.groups =  groups;

	$scope.submit = function(frm) {
		$scope.field[frm.$name].AEAPrice = 11;
		console.log(frm);
		return false;
	};
	
	$scope.addRow = function(frm, group) {
		$scope.groups[frm][group].push(++$scope.multipleIndex);
		$timeout ( () => {
			$(`#group-area-${$scope.multipleIndex}-${group}`).prepend( $compile(`<div class="row"><button type="button"  title="{{'deleterow' | translate}}"class="deleterowbutton" ng-click="deleteRow('${frm}', '${group}', '${$scope.multipleIndex}')"></button></div>`)($scope));
		}, 10);
	};

	$scope.deleteRow = function(frm, group, index) {
		alert(index);
		console.log("index", index);
	};

}

$(document).on("scroll", function() {
	if ($(document).scrollTop() > 40) {
		$("#head").removeClass("tplarge").addClass("tpsmall");
	} else {
		$("#head").removeClass("tpsmall").addClass("tplarge");
	}
});