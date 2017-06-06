'use strict';

app.component("eeaToolbar", {
	template: `<style>
#toolbar {
    color: #666;
    font-size: 0.875rem;
    background-color: rgba(242, 242, 242, 0);
    border-top: 1px solid #E6E6E6;
    width: 100%;
    max-width: 100%;
    height: 30px;
    position: fixed!important;
    bottom: 0;
    display: table;
    user-select: none;
    z-Index: 999;
}

#toolbar > div.columns {
    display: table-cell;
    height: 100%;
    vertical-align: middle;
    float: none;
}

#toolbar .buttons button {
    display: inline-block;
    cursor: pointer;
    text-align: left;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: 1.25rem 50%;
    padding-left: 40px;
    color: #00446a;
    margin: 0;
    transition: background-color 300ms ease-out;
}

#toolbar .buttons button[ng-click="save()"] {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTggMTgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiMwMDQ0NkEiIGQ9Ik0xLjIyOCwxOGgxNS41NDhjMC42NzcsMCwxLjIyNy0wLjU1LDEuMjI3LTEuMjI3VjQuOTU0YzAtMC40ODctMC4xOTUtMC45NTctMC41NC0xLjNMMTMuODA3LDBoLTAuMDA0djYuODE4SDQuMDY3VjBoLTIuODRDMC41NTEsMCwwLDAuNTQ5LDAsMS4yMjZ2MTEuNTAzdjQuMDQ1QzAsMTcuNDUsMC41NTEsMTgsMS4yMjgsMTh6IE05LjcwNSwwaDIuNjExdjUuNDkxSDkuNzA1VjB6Ii8+PC9zdmc+);
}

#toolbar .buttons button[ng-click="printPreview()"] {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyMC41OHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAyMC41OCAxOCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAuNTggMTgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiMwMDQ0NkEiIGQ9Ik01LjE0NiwwaDEwLjI4OXYyLjU3Mkg1LjE0NlYweiBNMTkuMjk0LDMuODUxSDEuMjg2QzAuNTc5LDMuODUxLDAsNC40MzgsMCw1LjE0NXY2LjQzMmMwLDAuNzA3LDAuNTc5LDEuMjc4LDEuMjg2LDEuMjc4aDMuODU5VjE4aDEwLjI4OXYtNS4xNDZoMy44NTljMC43MDcsMCwxLjI4Ni0wLjU3MSwxLjI4Ni0xLjI3OFY1LjE0NUMyMC41OCw0LjQzOCwyMC4wMDEsMy44NTEsMTkuMjk0LDMuODUxeiBNMTQuMDI5LDEzLjQzOWMtMC4zMzEsMC4zMy0wLjgwNiwwLjM5MS0xLjA2NCwwLjEzMmwtMS40MjgtMS40M2MtMC40NTMsMC4xOTEtMC45NSwwLjI5Ni0xLjQ3LDAuMjk2Yy0yLjEwNCwwLTMuODA5LTEuNzA1LTMuODA5LTMuODA3YzAtMi4xMDMsMS43MDUtMy44MDgsMy44MDktMy44MDhjMi4xMDMsMCwzLjgwOCwxLjcwNSwzLjgwOCwzLjgwOGMwLDAuOTYyLTAuMzY5LDEuODMtMC45NTgsMi41bDEuMjQ0LDEuMjQ1QzE0LjQyMSwxMi42MzMsMTQuMzU5LDEzLjEwOCwxNC4wMjksMTMuNDM5eiBNMTguNjUsNi43MjFjLTAuNTE1LDAtMC45MzMtMC40MTgtMC45MzMtMC45MzRjMC0wLjUxNSwwLjQxOC0wLjkzMiwwLjkzMy0wLjkzMmMwLjUxNiwwLDAuOTMzLDAuNDE3LDAuOTMzLDAuOTMyQzE5LjU4Myw2LjMwMywxOS4xNjYsNi43MjEsMTguNjUsNi43MjF6IE0xMC4wNjcsNi40NmMtMS4xOTksMC0yLjE3MiwwLjk3Mi0yLjE3MiwyLjE3MXMwLjk3MywyLjE3LDIuMTcyLDIuMTdzMi4xNzEtMC45NzEsMi4xNzEtMi4xN1MxMS4yNjcsNi40NiwxMC4wNjcsNi40NnoiLz48L3N2Zz4=);
}

#toolbar .buttons button[ng-click="close()"] {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTggMTgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwb2x5Z29uIGZpbGw9IiMwMDQ0NkEiIHBvaW50cz0iMTgsMTUuMjI0IDExLjc3Nyw5LjAwMSAxOCwyLjc3NyAxNS4yMjMsMCA5LDYuMjIzIDIuNzc3LDAuMDAxIDAsMi43NzcgNi4yMjMsOSAwLDE1LjIyNCAyLjc3NywxOCA5LDExLjc3NyAxNS4yMjMsMTggIi8+PC9zdmc+);
}

#toolbar .buttons button:hover {
    background-color: #ccd9e1;
}

#toolbar p {
    margin: 0 0.5em;
    padding: 0.1em;
}

#toolbar .switch {
    display: table;
    top: 8px;
}

#toolbar input:checked~.switch-paddle {
    background: #f15a24;
}

#toolbar .switch > span {
    display: table-cell;
    padding: 0 4px 0 10px;
    vertical-align: middle;
    color: #666;
    font-size: 13px;
    font-weight: 400;
}

#toolbar label.vswitch {
    min-width: 40px;
}

#toolbar #switch {
    padding-top: 8px;
    display: table-cell;
}

#toolbar .vswitch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
}

#toolbar .vswitch input {
    display: none;
}

#toolbar .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

#toolbar .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
}

#toolbar input:checked + .slider {
    background-color: #f15a24;
}

#toolbar input:focus + .slider {
    box-shadow: 0 0 1px #f15a24;
}

#toolbar input:checked + .slider:before {
    transform: translateX(16px);
}

#toolbar .slider.round {
    border-radius: 14px;
}

#toolbar .slider.round:before {
    border-radius: 50%;
}
</style>
<div id="toolbar" class="row">
        <div class="col-sm-4">
            <div class="switch round tiny">
                <span>{{$ctrl.validation}}</span>
                <span ng-show="$ctrl.scp.ValidationDisabled" class="ng-hide">{{$ctrl.off}}</span>
                <span ng-show="!$ctrl.scp.ValidationDisabled">{{$ctrl.on}}</span>
                <div id="switch">
	                <label  for="validationSwitch" class="vswitch">
	  		<input type="checkbox"  id="validationSwitch" class="switch-input" checked ng-click="$ctrl.toggleValidation()" type="checkbox" data-toggle="toggle">
	  		<div class="slider round"></div>
		</label>
	</div>
            </div> 
        </div>
        <div class="col-md-8 text-right buttons">
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
    controller: [function() {
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
    }]
    
});
