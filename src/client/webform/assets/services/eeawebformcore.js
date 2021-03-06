// TODO: transfer Save, Print, Close functions from older forms. *needs server access
app.service('$eea', ['$http', '$compile', function($http, $compile) {
	return {
		test: function($scope) {
			return 'Test: ' + $scope;
		},
		init: function($scope) {
			//Preserialisation: all form fields will be available on $scope.field.form name.field name
			$scope.field = {};
			//Multiple Rows counter - It works only In case of different $scope for each form. TODO: same scope
			$scope.multipleIndex = 1;
			//Multiple Forms/Groups/Rows placeholder Object
			$scope.groups = groups;
			//Validation labels switch
			$scope.ValidationDisabled = false;
			//Default language
			$scope.selectedLanguage = "en";
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
					// Maybe an extra Commit button appearing in case server respond to last edit/save (and on form loading with saved data from server) that data are accepted and checked.
					// Is it possible to autogenerate the DB and REST services based on the XSD (or the other way around) so front-end and back-end automatch/autofunctioning together since they are constructed based on the same XSD file?
					// A kind of enviromental behaviour to tasks. If it can not be automated and just coexists transparently together with the other processes, then it doesn't do. Extra work and tickets every time.
					if (!$scope[form.name].$valid) {
						$("#" + form.name + " .ng-invalid").first().focus();
						return;
					}
				});
			},
			submit : function (frm, test, $scope) {
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
				}

				return false;
			}
		}
	};
}]);

//TODO(?):  Error Reporting Isolated Form Deactivating Component  in *WebFormCore. Report/Log errors @server