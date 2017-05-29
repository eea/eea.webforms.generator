app.component("lookup",{
	template: '<select ng-model="$ctrl.ngModel" ng-change="$ctrl.updateLookup()" name="$ctrl.name" ng-options="option{{$ctrl.luValue}} as option{{$ctrl.luOption}} for option in $ctrl.data" class="slookup"  style="box-shadow: 0px!imporant;" required></select>',
	bindings: {
		ngModel: '@',
		lookup: '@',
		name: '@',
		luValue : '@' ,
		luOption : '@' ,
		luData: '@',
		scp: '='
	},
	controller: function($http, $translate) {
		var parent = this;
		this.$onInit = function() {
			(function() {
				$http.get(parent.lookup).then( function(response) {
					parent.data = response.data[parent.luData];
				});
			})();
			this.updateLookup = function() {
				console.log("IN");
			};

		}
		
	}
});