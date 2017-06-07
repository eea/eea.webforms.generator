app.service('$$', function() {
	return {
		test: function($scope) {
			return 'test' + $scope;
		},
		ui: {
			addRow: function(frm, group, $scope, $compile) {
				$scope.multipleIndex = $scope.groups[frm][group].length;
				var id = ++$scope.multipleIndex;
				$scope.groups[frm][group].push(id);
				setTimeout(function() {
					$scope.$apply();
					$('#group-area-' + $scope.multipleIndex + '-' + group).prepend($compile('<div class="row"><button type="button"  title="{{\'deleterow\' | translate}}"class="deleterowbutton" ng-click="deleteRow(\'' + frm + '\', \'' + group + '\', ' + id + ')"></button></div>')($scope));
				}, 10);
			},
			deleteRow: function(frm, group, id, $scope) {
				$scope.groups[frm][group][$scope.groups[frm][group].indexOf(id)] = -1;
				$("#group-area-" + id + "-" + group).html("");
			}
		}
	}
});