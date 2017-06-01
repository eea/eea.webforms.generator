'use strict';

app.component("eeaFormTesting",{
	template: `

<script src="./assets/js/test/mocha.min.js"></script>
<script src="./assets/js/test/chai.min.js"></script>
<link rel="stylesheet" type="text/css" href="./assets/js/test/mocha.min.css"/>

<div style="z-index: 999; position: fixed;bottom: 0; padding: 20px; margin: 4px; border: solid 1px #ccc;background-color:#fff; box-shadow: 5px 5px 5px #888888;">	
<h2>Testing Module</h2>
<h4>Remove &lt;eea-form-testing&gt; component to disable.</h4>
  <div id="mocha"></div>
  <div id="messages"></div>
  <div id="fixtures"></div>
  <script>

	mocha.setup('bdd');

	var expect = chai.expect;
	var assert = chai.assert;

	describe('Array', function() {
		alert(1);
	  it('should start empty', function() {
	    var arr = [];
	    assert.equal(arr.length, 0);
	  });
	});


mocha.run();

</script>
</div>
`,
	bindings: {
		scp: '='
	},
	controller: function() {
		this.$onInit = function() {
			
		}
	}
});