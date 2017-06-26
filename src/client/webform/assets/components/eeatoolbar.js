'use strict';

app.component("eeaToolbar", {
	//source: 'HABIDES+ reporting tool' web form
	template: `<div class="menu-buttons" style="padding: 40px;">
            <div>
                <div style="float:left;margin-right:10px;">
                    <input type="button" ng-click="showMenu = !showMenu" value="<" class="btn btn-default menu-button" ng-init="showMenu=true" title="Hide menu">
                </div>
                <div class="animate-show" ng-show="showMenu" style="float:left;">
                    <span ng-show="currentDerogation" class="ng-hide">
                        <button type="button" ng-click="closeCurrentDerogation()" class="btn btn-success">
                            <span class="glyphicon glyphicon-arrow-left"></span>
                            <span translate="Back-to-List" class="ng-scope">Back to list</span>
                        </button>
                        <!--
                        <input type="button" ng-click="validationOnOff()" value="Turn validation {{status.submitted ? 'Off' : 'On'}}" class="btn btn-primary">
                        -->
                    </span>
                    <span ng-show="!currentDerogation" class="">
                        <input type="button" ng-click="$ctrl.saveInstance()" value="Save" class="btn btn-success">
                        <!--
                        <input type="button" ng-click="validationOnOff()" value="Turn validation {{status.submitted ? 'Off' : 'On'}}" class="btn btn-primary">
                        -->
                        <input type="button" ng-click="close()" value="Close" class="btn btn-default btn-primary">
                        <input type="button" ng-click="printPreview()" value="Print preview" class="btn btn-default btn-primary">
                    </span>
                </div>
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
	controller: [function() {
		var parent = this;
		this.$onInit = function() {

			//source: 'HABIDES+ reporting tool' web form
			//TODO
			// this.toggleValidation = function() {
			// 	parent.scp.ValidationDisabled = !parent.scp.ValidationDisabled;
			// };

			//source: 'HABIDES+ reporting tool' web form
			//TODO
			// this.printPreview = function() {
			// 	var conversionLink = [formApplicationUrl("/download/convert", urlProperties.baseURI, urlProperties.sessionID, urlProperties.fileID), "&conversionId=", HTMLconversionNumber].join("");
			// 	$window.open(conversionLink, '_blank');
			// }

			this.saveInstance = function(){
				parent.scp.save();
			};

			//source: 'HABIDES+ reporting tool' web form
			//TODO
			// this.close = function(){
			// 	if (urlProperties.baseURI == ''){
			// 			urlProperties.baseURI = "/";
			// 	};
			// 	 var windowLocation = (urlProperties.envelope && urlProperties.envelope.length > 0) ? urlProperties.envelope : urlProperties.baseURI;
			//     	if (parent.scp.Webform.$dirty){
			// 	        	if ($window.confirm('You have made changes in the questionnaire! \\n\\n Do you want to leave without saving the data?')){
			// 	 	           	window.location = windowLocation;
			// 	        	}
			//     	}
			//     	else {
			// 		window.location = windowLocation;
			// 	}
			// };
		};
	}]
});
