
const app = angular.module('WebFormApp', ['pascalprecht.translate']);
app.controller('WebFormAppCtrl', WebFormAppCtrl);

app.config(["$translateProvider", function($translateProvider) {

	$translateProvider.useUrlLoader(langFile);
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage('en');

}]);

/**
* WebFormAppCtrl: Main controller
*/
function WebFormAppCtrl($scope, $http, $timeout, $window,  $translate) {
 
	$scope.field = {};  
	$scope.multipleIndex = 1;
	$scope.ValidationDisabled = false;
	$scope.selectedLanguage = "en";
	$scope.CodeLists;

	($scope.getCodeList = function() {
		$http.get('ct-codelists-en.json').then( function(response) {
				$scope.CodeLists = response.data;
				$scope.language = $scope.selectedLanguage;
			})
	})();

	$scope.updateTranslations = function() {
		alert($scope.language);
		// $translate.use(langKey);
	};

	$scope.toggleValidation = function() {
		$scope.ValidationDisabled = !$scope.ValidationDisabled;
	}

	$scope.submit = function(frm) {
		$scope.field[frm.$name].AEAPrice = 11;
		console.log(frm);
		return false;
	};

	$scope.printPreview = function() {
		var conversionLink = [formApplicationUrl("/download/convert", urlProperties.baseURI, urlProperties.sessionID, urlProperties.fileID), "&conversionId=", HTMLconversionNumber].join("");
		$window.open(conversionLink, '_blank');
	}

	$scope.toggleValidation = function() {
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

	$scope.totalRows = 1;
	$scope.addRow = function(frm, group) {
		$('#form-area-' + frm).append(`<div id="group-area-${++$scope.totalRows}-${group}" class="group-area">`+ $('#group-area-1-'+ group).html());
		$(`#group-area-${$scope.totalRows}-${group} .index`).html($scope.totalRows);
	};
}

$(document).on("scroll", function() {
	if ($(document).scrollTop() > 40) {
		$("#head").removeClass("tplarge").addClass("tpsmall");
	} else {
		$("#head").removeClass("tpsmall").addClass("tplarge");
	}
});