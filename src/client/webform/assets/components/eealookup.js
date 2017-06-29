'use strict';

app.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: false
	});
}]);

/*
app.provider('data', function() {
// Lookup Component. AutoGrouping in case more than once instances have the same attributes & Lookup Component. When adding row, get data from existing instance
//  Store returned REST/Json data to a Hash Array lookup/url+lu-data etc and check the Hash for existing data e.g. (app.config?) Data[crc32(url string) + "-" + crc32(lu-data string)] (unique?) = json data
//var DATA_STORAGE = {};
	this.pushData = function(srv) {
		srv.url, srv.dataset, srv.data
	};

	this.$get = function() {
		return function(DSsrv) {
			
		};
	};
});
*/

app.component("lookup", {
	template: '<select ng-model="$ctrl.parentNgModel" ng-change="$ctrl.updateLookup()" name="{{$ctrl.luName}}"  id="{{$ctrl.luName}}" def="{{$ctrl.def}}" ng-options="option{{$ctrl.luValue}} as option{{$ctrl.luOption}} for option in $ctrl.data | orderBy:\'{{$ctrl.luOrder}}\'" class="slookup" required><option value=""></option></select>',
	bindings: {
		parentNgModel: '=',
		lookup: '@',
		luName: '@',
		name: '@',
		luValue : '@' ,
		luOption : '@' ,
		luOrder : '@' ,
		luData: '@',
		def : '@' ,
		autoselect: '@',
		hideonautoselect: '@',
		scp: '='
	},
	controller: ['$http', '$translate', '$location', function($http, $translate, $location) {
		var parent = this;
		this.$onInit = function() {
			if (!parent.luOption.toString().startsWith('[')) {
				parent.luOption = '.' + parent.luOption;
			}
			if (!parent.luValue.toString().startsWith('[')) {
				parent.luValue = '.' + parent.luValue;
			} else {
				parent.luValueStr = parent.luValue.replace(/(\[|\'|\])/g, "");
			}
			if (parent.luOrder) {
				parent.luOrder = parent.luOrder.toString().replace(/'/g, "\\\'");
			}
			$http.get(parent.lookup).then(function(response) {
				parent.data = response.data[parent.luData];
				if (parent.autoselect) {
					let qs = $location.search()[parent.autoselect];
					let fdata = parent.data.filter(function (item) {
						if (item[parent.luValueStr] === qs) return true;
					});
					if (fdata.length > 0) {
						parent.parentNgModel = qs;	
						if (parent.hideonautoselect == 1 && $location.search()[parent.autoselect]){
							parent.scp['h_' + parent.name] = 1;
						}
					}
				}
			}, function error(response) {
				console.error("response", response);
			});
		};
	}]
});