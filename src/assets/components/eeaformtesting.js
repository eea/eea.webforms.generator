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
			var assert = chai.assert;

			it('should have a properly working $scope', function(done) {
			   expect(parent.scp).to.not.be.undefined;
			    done();
			});

			mocha.run();
		}
	}
});