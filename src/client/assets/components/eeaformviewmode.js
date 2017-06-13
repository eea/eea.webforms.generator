'use strict';

app.component("eeaFormViewmode", {
	bindings: {
		scp: '='
	},
	controller: [function($http, $translate, $location) {
		var parent = this;
		this.$onInit = function() {
				$(function() {
					setTimeout( function() {
						$("form.eeaform").each(function(){
							$(this).find('.formitem :input').each(function(index, item){
								var valToEnter = $(item).val();
								 
								if (!valToEnter || (item.type === "checkbox" && valToEnter === "on")) return;

								$(item).attr("readonly" , true);
								$(item).hide();

								var tb = $("<button class=\"formitemedit\"><i class=\"fa fa-pencil-square-o\"></i></button>");
								tb.inp =  $(this);
								tb.click(function(event) {
									event.preventDefault();
									$(item).show();
									$(item).attr("readonly" , false);
									$(this).hide();
									$(item).next(".formitemval").hide();
								});

								$(this).before(tb);
								
								 if (item.type === "select-one") {
									valToEnter = $(this).find(":selected").text();
								} 
								$(this).after("<span class=\"formitemval\">" + valToEnter + "</span>");
							});
						});
					}, 10);
				});
		};
		this.updateLookup = function() {
		};
	}]
});