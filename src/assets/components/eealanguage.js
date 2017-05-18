app.config(["$translateProvider", function($translateProvider) {
	$translateProvider.useUrlLoader(langFile);
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.fallbackLanguage('en');
	$translateProvider.determinePreferredLanguage();
}]);

app.component("eeaLanguage",{
	template: '<select ng-model="$ctrl.language" ng-change="$ctrl.updateTranslations()" name="form-language" data-placeholder="{{$ctrl.chooselanguage}}" ng-options="item.code as item.label for item in $ctrl.codeLists.CTCodelists.Languages.item" class="slanguage"  style="box-shadow: 0px!imporant;" required></select>',
	bindings: {
		lang: '@',
		chooselanguage: '@',
		scp: '='
	},
	controller: function() {
		var parent = this;
		this.$onInit = function() {
			(this.getCodeList = function() {
				$.get('ct-codelists-en.json').then( function(response) {
					parent.codeLists = response;
					parent.language = parent.lang;
				});
			})();

			this.updateTranslations = function(lng) {
				alert(parent.language);
				// $translate.use(langKey);
			};

		}
		
	}
});