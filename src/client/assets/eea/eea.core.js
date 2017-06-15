'use strict';

/**
/ EEA Core
*/
var eea = {
	settings : {
		allow_external_includes : false,
		service_path : "./assets/services/",
		service_ext : ".min.js",
		component_path : "./assets/components/",
		component_ext : ".min.js",
		js_path : "./assets/js/",
		js_ext : ".min.js",
		css_path : "./assets/css/",
		css_ext : ".min.css"
	},	
	Services : {
		get : function(script) {
			eea.Loader.getJS(script, eea.settings.service_path, eea.settings.service_ext);
		},
		getAll : function(scripts) {
			eea.Loader.getAllJS(scripts, eea.settings.service_path, eea.settings.service_ext);
		},
	},
	Components : {
		get : function(script) {
			eea.Loader.getJS(script, eea.settings.component_path, eea.settings.component_ext);
		},
		getAll : function(scripts) {
			eea.Loader.getAllJS(scripts, eea.settings.component_path, eea.settings.component_ext);
		},
	},
	JS : {
		get : function(js, freeurl) {
			eea.Loader.getJS(js, eea.settings.js_path, eea.settings.js_ext, freeurl);
		},
		getAll : function(jss, freeurl) {
			eea.Loader.getAllJS(jss, eea.settings.js_path, eea.settings.js_ext, freeurl);
		},
	},
	CSS : {
		get : function(css, freeurl) {
			eea.Loader.getCSS(css, eea.settings.css_path, eea.settings.css_ext, eea.settings.css_type, freeurl);
		},
		getAll : function(csss, freeurl) {
			eea.Loader.getAllCSS(csss, eea.settings.css_path, eea.settings.css_ext, eea.settings.css_type, freeurl);
		},
	},
	Loader : {
		getJS : function(script, path, ext, freeurl) {
			var path  = path || "";
			var ext  = ext || "";

			var oXmlHttp = new XMLHttpRequest();
			oXmlHttp.onreadystatechange = function() {
				if (oXmlHttp.readyState == 4) {
					if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
						eea.Loader.includeJS(script, oXmlHttp.responseText);
				}
			}
			
			var url = (freeurl && allow_external_includes) ? script : path+ script + ext ;
			oXmlHttp.open('GET', url, false);
			oXmlHttp.send(null);
		},
		getAllJS : function(scripts, path, ext, freeurl) {
			var path  = path || "";
			var ext  = ext || "";
			
			scripts.forEach(function(script) {
				eea.Loader.getJS(script, path, ext, freeurl);
			})
		},
		includeJS : function (fileUrl, source) {
			var script = document.createElement("script");
			script.language = "javascript";
			script.type = "text/javascript";
			script.defer = true;
			script.text = source;
			document.getElementsByTagName('HEAD').item(0).appendChild(script);
		},
		getCSS : function(css, path, ext, freeurl) {
			var path  = path || "";
			var ext  = ext || "";
			
			var oXmlHttp = new XMLHttpRequest();
			oXmlHttp.onreadystatechange = function() {
				if (oXmlHttp.readyState == 4) {
					if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
						eea.Loader.includeCSS(css, oXmlHttp.responseText);
				}
			}
			
			var url = (freeurl && allow_external_includes) ? css : path+ css + ext ;
			oXmlHttp.open('GET', url, false);
			oXmlHttp.send(null);
		},
		getAllCSS : function(csss, path, ext) {
			var path  = path || "";
			var ext  = ext || "";

			csss.forEach(function(css) {
				eea.Loader.getCSS(css, path, ext);
			})
		},
		includeCSS : function (fileUrl, source) {
			var style = document.createElement("style");
			style.appendChild(document.createTextNode(source)); 
			document.getElementsByTagName('HEAD').item(0).appendChild(style);
		}
	}
}