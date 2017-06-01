'use strict';

app.component("eeaFormTesting",{
	template: `
<script src="./assets/js/test/mocha.min.js"></script>
<script src="./assets/js/test/chai.min.js"></script>
<link rel="stylesheet" type="text/css" href="./assets/js/test/mocha.min.css"/>
<style>
#mocha-stats {
	position: absolute;
	top: 4px;
	right: 4px;
	border-radius: 5px;
	padding: 5px;
}
</style>
<div id="testd" style="width: 30%;min-width: 350px; z-index: 999; position: fixed;bottom: 0; padding: 10px; margin: 4px; border: solid 1px #ccc;background-color: rgba(255, 255, 255, 0.99); box-shadow: 5px 5px 5px #888888;">	
 <div onclick="$('#testd').hide();" style="border: 1px solid #333;user-select: none;background-color: #333;width: 30px; height: 30px;line-height: 24px;border-radius: 50%;color: #fff;position: absolute;font-size: 16px; font-weight: 900; text-align: center; left: -2px; top: -20px;cursor: pointer;">x</div>
<b>Testing Module</b><BR>
<div style="font-size:11px;padding:10px;border-radius:5px;">Remove <b>&lt;eea-form-testing&gt;</b> component<BR>from page source to disable.</div>
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
			
			describe("Testing eea form js library", function() {
				it('selected langauge should be "en"', function(done) {
				   expect(parent.scp.selectedLanguage).to.equal("en");
				    done();
				});
			});

			describe("Testing angular", function() {
				it('document should have a $scope', function(done) {
				   expect(parent.scp).to.not.be.undefined;
				    done();
				});
			});
			
			describe("Testing jquery", function() {
				it('document should acknowledge the variable $', function(done) {
				   expect($).to.not.be.undefined;
				    done();
				});
			});

			mocha.run();
		}
	}
});