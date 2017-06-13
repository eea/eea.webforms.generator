'use strict';

app.component("eeaViewMode", {
	bindings: {
		scp: '='
	},
	controller: [function($http, $translate, $location) {
		var parent = this;
		this.$onInit = function() {
				$(function() {
					setTimeout( function() {
						$("form").each(function(){
							$(this).find('.formitem :input').each(function(index, item){
								var itype = item.type;
								$(this).attr("readonly" , true);
								$(this).hide();

								var tb = $("<button class=\"formitemedit\"><i class=\"fa fa-pencil-square-o\"></i></button>");
								tb.inp =  $(this);
								tb.click(function(event) {
									event.preventDefault();
									$(item).show();
									$(this).hide();
									$(item).next(".formitemval").hide();
								});

								$(this).before(tb);
								var valToEnter;
								 if (itype === "select-one") {
									valToEnter = $(this).find(":selected").text();
								} else {
									valToEnter = $(this).val();
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