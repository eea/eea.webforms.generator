app.component("eeaLanguage",{
	template: '<select ng-model="language" ng-init="language=$ctrl.lang" ng-change="updateTranslations()" name="form-language" data-placeholder="{{$ctrl.chooselanguage}}" ng-options="item.code as item.label for item in $ctrl.data.CTCodelists.Languages.item" class="slanguage"  style="box-shadow: 0px!imporant;" required></select>',
	bindings: {
		data: '=',
		lang: '@',
		chooselanguage: '@',
	}
});