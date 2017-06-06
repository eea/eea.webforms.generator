'use strict';

app.component("eeaFormTesting", {
	template: `
<link rel="stylesheet" type="text/css" href="./assets/js/test/mocha.min.css"/>
<style>
#mocha {
	margin: 20px;
	font-family: inherit;
	z-index: 999;
}
#mocha h1 a { 
	font-size: 13px; 
	font-weight: 900;
}
#mocha-stats {
	position: absolute;
	top: 4px;
	right: 4px;
	border-radius: 5px;
	padding: 5px;
}
</style>
<div id="testd" style="height: 50%;overflow-y: auto;width: 540px;min-width: 540px; z-index: 999;position: fixed;bottom: 0; padding: 10px; margin: 4px; border: solid 1px #ccc;background-color: rgba(255, 255, 255, 0.99); box-shadow: 5px 5px 5px #888888;">	
 <div onclick="$('#testd').hide();" style="z-index: 999;border: 1px solid #333;user-select: none;background-color: #333;width: 30px; height: 30px;line-height: 24px;border-radius: 50%;color: #fff;position: fixed;font-size: 16px; font-weight: 900; text-align: center; left: 2px; bottom: 2px;cursor: pointer;">x</div>
<b>Testing Module</b><BR>
<div style="font-size:9px;padding: 5px 0;border-radius:5px;width: 150px;">Remove <b>&lt;eea-form-testing&gt;</b> component from page source to disable.</div>
 <div id="mocha"><div id="teststartingmsg">Test starting in {{$ctrl.timecnt / 1000}}''<div></div>
</div>
`,
	bindings: {
		scp: '='
	},
	controller: [function() {
		this.timecnt = 3000;
		var parent = this;
		this.$onInit = function() {
			$.getScript("./assets/js/test/mocha.min.js");
			$.getScript("./assets/js/test/chai.min.js");
			$(function() {
			setTimeout( function() {
				mocha.setup('bdd');
				var expect = chai.expect;
				var aflabel = " (eea-form-testing : autofilled)";
				$("#teststartingmsg").hide();
							
				describe("Testing eea form js library", function() {
					it('selected language should be "en"', function(done) {
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
					it('variable $ should be defined', function(done) {
						expect($).to.not.be.undefined;
						done();
					});
				});

				describe("Testing form. Performing autofill...", function() {
					$("form").each(function(){
						$(this).find(':input').each(function(index, item){
							var itype = item.type;
							if (!itype) return;
							
							item = $(item);
							
							var iname = item.attr("name");
							if (!iname) return;
							if (iname.indexOf('$')  > -1) {
								iname = iname.split('$')[0];
							}

							var valToEnter;
							switch(itype) {
							case "text" :
								valToEnter = Math.random().toString(36).replace(/[^a-z]+/g, '') + aflabel;
								item.val(valToEnter);
								break;
							case "number" :
								valToEnter = item.attr("min") || item.attr("max") || 1;
								item.val(valToEnter);
								break;
							case "date" :
								valToEnter = (function() {
										var today = new Date();
										var dd = today.getDate();
										var mm = today.getMonth()+1; 
										var yyyy = today.getFullYear();
										if(dd < 10)  dd = '0' + dd;
										if(mm < 10) mm = '0' + mm;
										return  yyyy +'-' + mm + '-' + dd;
									})();
								item.val(valToEnter);
								break;
							case "select-one":
								if (!item.val()) {
									var options = item.find('option');
									var sopt = options[Math.floor(Math.random() * (options.length - 1)) + 1];
									sopt.selected = true;
									valToEnter = $(sopt).text();
								} else{ 
									valToEnter = item.find(":selected").text();
								}
								
								break;
							case "checkbox":
								valToEnter = "on";
								item.prop("checked", true);
								break;
							default:
								
							}

							var valToEnternl = valToEnter.toString().replace(aflabel, "");
							it(iname + '  should be "' +  valToEnternl + '"', function(done) {
								item.trigger("input"); 
								item.trigger("change"); 
								var itemv
								if (itype === 'select-one')
									itemv = $(item).find("option:selected").text();
								else
									itemv = item.val();	
								expect(itemv).to.equal(valToEnter.toString());
								done();
							});
						});
					});
				});

				if ($('#Row').attr("multi") == 1) {
					describe("Multirow detected... Testing new row", function() {
						it('form should have two rows', function(done) {
							parent.scp.addRow('form1', 'Row');
							expect(parent.scp.groups.form1.Row.length).to.equal(2);
							done();
						});
					});
				}

				describe("Performing form submission emulation", function() {
					it('should log form elements below', function(done) {
						var fnc = parent.scp.submit(null, true);
						var objs = parent.scp.field;
						var objsStr = "<b>Form submission emulation data:</b><BR><BR>";
						for (var form in objs) {
							var frmObj = objs[form];
							for (var element in frmObj) {
								var elname = element;
								var elvalue = frmObj[element];
								elvalue = elvalue.toString().replace(aflabel, "");
								if (elname.indexOf('$')  > -1) {
									elname = elname.split('$')[0];
									aflabel
								}
								objsStr += "<b>" + elname + "</b> = " + elvalue + "<BR>";
							}
						};
						var pdiv = $("<div style=\"position:relative;background-color:#FFD700;color:#333;padding:20px;font-size:11px;\">" + objsStr + "</div>").appendTo('#mocha');
						expect(fnc).to.equal(false);
						done();
					});
				});

				mocha.run();
			}, parent.timecnt);
			});
		}
	}]
});