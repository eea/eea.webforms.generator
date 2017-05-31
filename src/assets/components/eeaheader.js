'use strict';

app.component("eeaHeader", {
	template: `<div id="head" class="top-bar sticky tplarge">

	<div id="tool-ribbon">
		<div id="left-tools">
			<a id="eealink" href="http://www.eea.europa.eu/">EEA</a>
		</div>
		<div id="right-tools">
				<a href="http://www.eea.europa.eu/">
					<b>European Environment Agency</b>
				</a>
				Kgs. Nytorv 6, DK-1050 Copenhagen K, Denmark - Phone: +45 3336 7100              
			<a id="printlink" href="javascript:this.print();" title="Print this page">
				<span>Print</span>
			</a>
		</div>
	</div>
	<div id="page-head">
		<a accesskey="1" href="/">
		</a>
		<div id="network-title">Eionet</div>
		<div id="site-title">European Environment Information and Observation Network</div>
	</div>
</div>`, controller: function($http, $translate) {
		var parent = this;
		this.$onInit = function() {				
			$(document).on("scroll", function () {
				if ($(document).scrollTop() > 40) {
					$("#head").removeClass("tplarge").addClass("tpsmall");
				} else {
					$("#head").removeClass("tpsmall").addClass("tplarge");
				}
			});
		}
	}
});
