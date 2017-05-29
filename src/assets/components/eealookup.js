app.component("ssslookup",{
	template: '<select ng-model="$ctrl.ngModel" ng-change="$ctrl.updateLookup()" name="$ctrl.name" ng-options="$ctrl.option as item.label for item in $ctrl.data" class="slookup"  style="box-shadow: 0px!imporant;" required></select>',
	bindings: {
		ngModel: '@',
		lookup: '@',
		name: '@',
		luValue : '@' ,
		luOption : '@' ,
		data: '@',
		scp: '='
	},
	controller: function($http, $translate) {
		var parent = this;
		this.$onInit = function() {
			(this.getCodeList = function() {
				$http.get(parent.ookup).then( function(response) {
					parent.data = response.data;
				});
			})();
			this.updateLookup = function() {
				console.log("IN");
			};

		}
		
	}
});