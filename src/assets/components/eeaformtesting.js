'use strict';

app.component("eeaFormTesting",{
	template: `
<script src="./assets/js/test/mocha.min.js"></script>
<script src="./assets/js/test/chai.min.js"></script>
<link rel="stylesheet" type="text/css" href="./assets/js/test/mocha.min.css"/>

<div style="width: 30%; min-width: 300px; z-index: 999; position: fixed;bottom: 0; padding: 20px; margin: 4px; border: solid 1px #ccc;background-color:#fff; box-shadow: 5px 5px 5px #888888;">	
<b>Testing Module</b><BR>
<small>Remove &lt;eea-form-testing&gt; component to disable.</small>
 <div id="mocha"></div>
</div>
`,
	bindings: {
		scp: '='
	},
	controller: function() {
		var parent = this;
		this.$onInit = function() {
			mocha.setup('bdd');
			var expect = chai.expect;
			
			describe("Testing angular", function() {
				it('should have a $scope', function(done) {
				   expect(parent.scp).to.not.be.undefined;
				    done();
				});
			});
			
			describe("Testing jquery", function() {
				it('should acknowledge the variable $', function(done) {
				   expect($).to.not.be.undefined;
				    done();
				});
			});

			describe("Testing eea form js library", function() {
				it('selected langauge should be "en"', function(done) {
				   expect(parent.scp.selectedLanguage).to.equal("en");
				    done();
				});
			});

			mocha.run();
		}
	}
});