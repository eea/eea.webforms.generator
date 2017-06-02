'use strict';

app.component("eeaHeader", {
	template: `<style>
	.tplarge {
	    height: 132px;
	}
	.tpsmall {
	    height: 80px;
	}
	.tplarge #network-title {
	    font-size: 200%;
	    padding-top: 20px;
	}
	.tpsmall #network-title {
	    font-size: 100%;
	    padding-top: 2px;
	}
	.tplarge #site-title {
	    font-size: 120%;
	}
	.tpsmall #site-title {
	    font-size: 100%;
	}
	.tplarge #page-head a {
	    font-size: 120%;
	    height: 101px;
	}
	.tpsmall #page-head a {
	    font-size: 100%;
	    height: 48px;
	}
	#page-head a {
	    background: url("http://www.eionet.europa.eu/styles/eionet2007/top_graphic.gif") no-repeat scroll left center transparent;
	    position: absolute;
	    right: 40px;
	    top: 31px;
	    width: 323px;
	    will-change: all;
	    transition: all 0.3s ease-out;
	}
	#formworkarea {
	    float: none;
	    margin: 0 auto;
	}
	#network-title {
	    color: #00446A;
	    font-size: 200%;
	    font-variant: small-caps;
	    font-weight: bold;
	    padding-left: 25px;
	    padding-top: 20px;
	    will-change: all;
	    transition: all 0.3s ease-out;
	}
	#site-title {
	    color: #006699;
	    font-size: 120%;
	    font-weight: bold;
	    padding-left: 25px;
	    will-change: all;
	    transition: all 0.3s ease-out;
	}
	</style>
	<div id="head" class="top-bar sticky tplarge">
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
