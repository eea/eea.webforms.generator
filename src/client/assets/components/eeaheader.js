'use strict';

app.component("eeaHeader", {
	template: `<style>
	.top-bar {
	    position: fixed;
	    display: block;
	    margin: 0;
	    padding: 0;
	    width: 100%;
	    top: 0;
	    z-index: 9999;
	    box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.3);
	    will-change: all;
	    transition: all 0.3s ease-out;
	}
	.top-bar,
	.top-bar ul {
	    background-color: #E6E6E6;
	}
	.top-bar,
	.top-bar a {
	    color: #fff;
	    font-size: 14px;
	}
	#tool-ribbon {
	    background-color: #ffffff;
	    border-bottom: 4px solid #6f7072;
	    color: #315076;
	    font-size: 80%;
	    height: 30px;
	    width: 100%;
	}
	#left-tools {
	    float: left;
	    height: 20px;
	    padding: 4px 0.5em;
	    text-align: left;
	    vertical-align: middle;
	}
	a#eealink {
	    background: url("http://www.eionet.europa.eu/styles/eionet2007/eeaicon.gif") no-repeat scroll left center rgba(0, 0, 0, 0);
	    padding-left: 18px;
	}
	#right-tools {
	    float: right;
	    text-align: right;
	    width: 60%;
	    font-size: 0.75rem;
	}
	a#printlink {
	    background: url("http://www.eionet.europa.eu/styles/eionet2007/print_icon.gif") no-repeat scroll left center rgba(0, 0, 0, 0);
	    padding: 3px 0.5em 1px 16px;
	    display: inline-block;
	    margin-left: 1.25rem;
	}
	#page-head {
	    border-top: 1px solid #4b5257;
	    clear: both;
	}
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
</div>`, controller: ['$http', '$translate', function($http, $translate) {
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
	}]
});
