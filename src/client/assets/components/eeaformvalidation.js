'use strict';
//TODO - Inform the form user regarding remaining fields to be completed and its requirements.
app.component("eeaValidation", {
	template: '<div></div>',
	bindings: {
		date: '@',
		user: '@'
	},
	controller: function() {
		this.$onInit = function() {
		}
	}
});