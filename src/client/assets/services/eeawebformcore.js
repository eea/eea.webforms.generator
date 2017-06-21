// TODO: transfer Save, Print, Close functions from older forms. *needs server access
app.service('$eea', ['$http', '$compile', function($http, $compile) {
    	return {
		test: function($scope) {
			return 'test' + $scope;
		},
		init: function($scope) {
			$scope.field = {};
			$scope.multipleIndex = 1;
			$scope.ValidationDisabled = false;
			$scope.selectedLanguage = "en";
			$scope.groups = groups;
		},
		group: {
			addRow: function(frm, group, $scope) {
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
		},
		form: {
			save : function ($scope) {
				$("form.eeaform").each(function(index, form){
						console.log("Testing form - Valid:", $scope[form.name].$valid);			
						//TODO: Maybe a DB status flag (same Table or Lookup for activity logging? or Status in main table and Activity Table for action/date/user logging) 
						//(i.e. 0 created/saved, 1 edited (+dateedited? extra field), 2 commited - leave it "open" for future statuses). In order to be Commited it needs to be valid. It can be saved without all elements completed but not commited.			    
						if (!$scope[form.name].$valid) {
							$("#" + form.name + " .ng-invalid").first().focus();
						}
				});
			},
			submit : function (frm, test, $scope) {

				// for (var form in $scope.field) {
					// if (frm) {
						// if (frm.$name !== form) continue;
					// }

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

				// }

				return false;
			}
		}
	}
}]);