
app.component("eeaToolbar", {
	template: `<div id="pagefoot" class="row">
        <div class="columns small-4">
            <div class="switch round tiny">
                <span>{{$ctrl.validation}}</span>
                <span ng-show="$ctrl.scp.ValidationDisabled" class="ng-hide">{{$ctrl.off}}</span>
                <span ng-show="!$ctrl.scp.ValidationDisabled">{{$ctrl.on}}</span>
                <div class="round tiny">
                  <input id="validationSwitch" class="switch-input" checked ng-click="$ctrl.toggleValidation()" type="checkbox">
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
		scp: '='
	},
    controller: function() {
    	var parent = this;
    	this.$onInit = function() {

    		this.toggleValidation = function() {
			parent.scp.ValidationDisabled = !parent.scp.ValidationDisabled;
		}

		this.printPreview = function() {
			var conversionLink = [formApplicationUrl("/download/convert", urlProperties.baseURI, urlProperties.sessionID, urlProperties.fileID), "&conversionId=", HTMLconversionNumber].join("");
			$window.open(conversionLink, '_blank');
		}

		this.save = function(){
			dataRepository.saveInstance($scope.Webform);
		}

		this.close = function(){
			if (urlProperties.baseURI == ''){
					urlProperties.baseURI = "/";
			};
			 	var windowLocation = (urlProperties.envelope && urlProperties.envelope.length > 0) ? urlProperties.envelope : urlProperties.baseURI;
		    	if (parent.scp.Webform.$dirty){
			        	if ($window.confirm('You have made changes in the questionnaire! \\n\\n Do you want to leave without saving the data?')){
			 	           	window.location = windowLocation;
			        	}
		    	}
		    	else {
		       	 	window.location = windowLocation;
		    	}
		}

	}

    }
});
