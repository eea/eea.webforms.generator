'use strict';

app.component("eeaFormBuild",{
	template: 'Build date:  {{$ctrl.date}}<br>{{$ctrl.diff}} ago<br>by {{$ctrl.user}}',
	bindings: {
		date: '@',
		user: '@'
	},
	controller: function() {
		this.$onInit = function() {
			var delta = Math.abs(new Date().getTime() - new Date(this.date).getTime()) / 1000;

			var days = Math.floor(delta / 86400);
			delta -= days * 86400;

			var hours = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;

			var minutes = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;

			var seconds = Math.floor(delta % 60);

			this.diff = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " sec.";
		}
	}
});