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
	services : {
		get : function(script) {
			eea.loader.getJS(script, eea.settings.service_path, eea.settings.service_ext);
		},
		getAll : function(scripts) {
			eea.loader.getAllJS(scripts, eea.settings.service_path, eea.settings.service_ext);
		},
	},
	components : {
		get : function(script) {
			eea.loader.getJS(script, eea.settings.component_path, eea.settings.component_ext);
		},
		getAll : function(scripts) {
			eea.loader.getAllJS(scripts, eea.settings.component_path, eea.settings.component_ext);
		},
	},
	js : {
		get : function(js, freeurl) {
			eea.loader.getJS(js, eea.settings.js_path, eea.settings.js_ext, freeurl);
		},
		getAll : function(jss, freeurl) {
			eea.loader.getAllJS(jss, eea.settings.js_path, eea.settings.js_ext, freeurl);
		},
	},
	css : {
		get : function(css, freeurl) {
			eea.loader.getCSS(css, eea.settings.css_path, eea.settings.css_ext, eea.settings.css_type, freeurl);
		},
		getAll : function(csss, freeurl) {
			eea.loader.getAllCSS(csss, eea.settings.css_path, eea.settings.css_ext, eea.settings.css_type, freeurl);
		},
	},
	loader : {
		getJS : function(script, path, ext, freeurl) {
			path  = path || "";
			ext  = ext || "";

			var oXmlHttp = new XMLHttpRequest();
			oXmlHttp.onreadystatechange = function() {
				if (oXmlHttp.readyState == 4) {
					if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
						eea.loader.includeJS(script, oXmlHttp.responseText);
				}
			};
			
			var url = (freeurl && eea.settings.allow_external_includes) ? script : path + script + ext;
			oXmlHttp.open('GET', url, false);
			oXmlHttp.send(null);
		},
		getAllJS : function(scripts, path, ext, freeurl) {
			path  = path || "";
			ext  = ext || "";
			
			scripts.forEach(function(script) {
				eea.loader.getJS(script, path, ext, freeurl);
			});
		},
		includeJS : function (fileUrl, source) {
			var script = document.createElement("script");
			script.language = "javascript";
			script.type = "text/javascript";
			script.defer = true;
			script.text = source;
			document.getElementsByTagName('head').item(0).appendChild(script);
		},
		getCSS : function(css, path, ext, freeurl) {
			path  = path || "";
			ext  = ext || "";
			
			var oXmlHttp = new XMLHttpRequest();
			oXmlHttp.onreadystatechange = function() {
				if (oXmlHttp.readyState == 4) {
					if (oXmlHttp.status == 200 || oXmlHttp.status == 304)
						eea.loader.includeCSS(css, oXmlHttp.responseText);
				}
			};
			
			var url = (freeurl && eea.settings.allow_external_includes) ? css : path + css + ext;
			oXmlHttp.open('GET', url, false);
			oXmlHttp.send(null);
		},
		getAllCSS : function(csss, path, ext) {
			path  = path || "";
			ext  = ext || "";

			csss.forEach(function(css) {
				eea.loader.getCSS(css, path, ext);
			});
		},
		includeCSS : function (fileUrl, source) {
			var style = document.createElement("style");
			style.appendChild(document.createTextNode(source)); 
			document.getElementsByTagName('head').item(0).appendChild(style);
		}
	}
};