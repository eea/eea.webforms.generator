'use strict';
//TODO - Inform the form user regarding remaining fields to be completed and its requirements.
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
				}
				, ctimeout);
		};
		this.validate = function($translate) {
			$("#eeavalidation").html("");
			var content = '<b style="font-size:16px;margin-left:10px;margin-bottom:20px;">Remaining fields:</b><br><br><ul>';				
			$("form.eeaform").each(function($b, $a){
				$(this).find('.formitem :input').each(function(index, item) {
					var itype = item.type;
					if (!itype || itype === "submit") return;
					
					item = $(item);
					
					var val = item.val();
					if (val) return;
					
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

			$('.formitem :input').change( function() {
				parent.validate($translate);
			});
			$('.rowbutton').click(function() {
				parent.validate($translate);	
				setTimeout( function() {
					$('.deleterowbutton').click(function() {
						parent.validate($translate);	
					});
				}, 100);
			});		
			$('.deleterowbutton').click(function() {
				parent.validate($translate);	
			});	
		};
	}]
});