
app.component("eeaToolbar", {
	template: `<div id="pagefoot" class="row">
        <div class="columns small-4">
            <div class="switch round tiny">
                <span>{{$ctrl.validation}}</span>
                <span ng-show="ValidationDisabled" class="ng-hide">{{$ctrl.off}}</span>
                <span ng-show="!ValidationDisabled">{{$ctrl.on}}</span>
                <div class="round tiny">
                  <input id="validationSwitch" class="switch-input" checked ng-click="toggleValidation()" type="checkbox">
                  <label for="validationSwitch" class="switch-paddle"></label>
                </div>
                <label for="validationSwitch"></label>
            </div> 
        </div>
        <div class="columns small-8 text-right buttons">
            <button ng-click="save()">{{$ctrl.save}}</button>
            <button ng-click="printPreview()">{{$ctrl.printpreview}}</button>
            <button ng-click="close()">{{$ctrl.close}}</button>
        </div>
    </div>`,
    bindings: {
    		validation: '@',
		on: '@',
		off: '@',
		save: '@',
		printpreview: '@',
		close: '@',
	}
});
