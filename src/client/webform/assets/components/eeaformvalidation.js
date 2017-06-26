'use strict';

app.component("eeaFormValidation", {
	template: '<div id="eeavalidation" style="position:fixed;right:0;bottom:0;z-index:999;background-color:#F0F4F5;width:400px;height:280px;padding:20px 0px;overflow-y:auto;font-size:12px;"></div>',
	bindings: {
		scp: '='
	},
	controller: ['$translate', function($translate) {
		var parent = this;
		this.$onInit = function() {
			var ctimeout = ($('eea-form-testing').length) ? 4000 : 10;
			setTimeout(
				function() {
					parent.validate($translate);
					$('.formitem :input').change(function() {
						parent.validate($translate, true);
					});
					$('.rowbutton').click(function() {
						parent.validate($translate);	
					});		
					$('.deleterowbutton').click(function() {
						parent.validate($translate, true);	
					});	
				}, ctimeout);
		};
		this.validate = function($translate, noval) {
			$("#eeavalidation").html("");
			var content = '<b style="font-size:16px;margin-left:10px;margin-bottom:20px;">Remaining fields:</b><br><br><ul>';				
			$("form.eeaform").each(function(){
				$(this).find('.formitem :input').each(function(index, fitem) {
					var itype = fitem.type;
					
					if (!itype || itype === "submit") return;
					
					var item = $(fitem);
					var val = item.val();
					
					if ((val && itype !== "checkbox") || (itype === "checkbox" && ! item.hasClass("ng-untouched") || item.is(':checked'))) {
						return;
					}

					if (!noval) {
						fitem.onchange = function(){ parent.validate($translate, true); };
					}
					
					var name = item.attr("name");
					var aname = name.split("$");
					var arr = aname[1];
					var nme = aname[0];
					
					content += "<li>Group <b>" + arr + "</b><br>";
					content += "<b style=\"font-size:14px\">" + $translate.instant('labels.' + nme) + "</b><br>";
					content += ($translate.instant(item.attr("def"))  || "" )+ "<br>";
					content += "<button style=\"padding:2px;min-width:auto;font-size:11px;width:24px;max-width:24px;height:24px;\" onclick='" + name + ".focus()'>Go</button><br><br>";
				});
				$("#eeavalidation").html(content + "</ul>");
			});

			if (noval) return;
			setTimeout(function() {
				$('.deleterowbutton').click(function() {
					parent.scp.$apply();
					parent.validate($translate, true);	
				});
			}, 10);
		};
	}]
});