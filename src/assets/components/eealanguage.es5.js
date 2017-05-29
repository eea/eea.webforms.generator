'use strict';

app.config(function ($translateProvider, $translatePartialLoaderProvider) {
	$translatePartialLoaderProvider.addPart(langFile);
	$translateProvider.useLoader('$translatePartialLoader', {
		urlTemplate: 'lng/{part}{lang}.lang.json'
	});
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.fallbackLanguage('en');
	$translateProvider.preferredLanguage('en');
});

app.component("eeaLanguage", {
	template: '<select ng-model="$ctrl.language" ng-change="$ctrl.updateTranslations()" name="form-language" data-placeholder="{{$ctrl.chooselanguage}}" ng-options="item.code as item.label for item in $ctrl.codeLists.CTCodelists.Languages.item" class="slanguage"  style="box-shadow: 0px!imporant;" required></select>',
	bindings: {
		lang: '@',
		chooselanguage: '@',
		scp: '='
	},
	controller: function controller($http, $translate) {
		var parent = this;
		this.$onInit = function () {
			(function () {
				$http.get('lng/ct-codelists-en.json').then(function (response) {
					parent.codeLists = response.data;
					parent.language = parent.lang;
				});
			})();
			this.updateTranslations = function () {
				$translate.use(parent.language);
				$translate.refresh();
			};
		};
	}
});
