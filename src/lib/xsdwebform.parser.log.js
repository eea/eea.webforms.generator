/**
 * @file xsdwebform.parser.log.js
 * XSD Schema to HTML5 Web Form
 * @author George Bouris <gb@eworx.gr>
 * @copyright Copyright (C) 2017 EEA, Eworx, George Bouris. All rights reserved.
 */
'use strict';

/**
 * Class XSDWebFormParserLog
 * Parser for XSD Schema Tags
 * Static
 */
class XSDWebFormParserLog {
	/**
	 * Class constructor
	 */
	constructor() {
		this.htmlOutput = `<!DOCTYPE html>
<html>
<head>
<script src="../assets/js/jquery.min.js"></script>
<script>
$(function () {
	var cnt = 0;
	var objs = $("ul.clvl");
	var objsLength = $("ul.clvl").length;
	objs.each(function (index) {
		var th = 15;			
		if (objsLength < 1000) {
			var lvl = $(this).attr("lvl");
			var prlvl = $(this).prevAll("ul.clvl[lvl="+lvl+"]");
			var prlvlP1 = $(this).prevAll("ul.clvl:first");
			
			var pos = $(this).offset();
			var parentPos = prlvl.offset();

			if (parentPos && prlvlP1.attr("lvl") >  lvl) {
				th = pos.top - parentPos.top - $(prlvl).outerHeight() - 1;
				if (th < 0 ) th = 15;
			}
		}
		$(this).prepend($("<div style=\\"margin-top: -" + th + "px;position: absolute; background-color: #cc0000; height: " + th + "px; width: 16px;\\"></div>"));
	});
	$(".htmlo li.src .srvs:first").show();
});
function toggleTab(obj, did) {
	$(".tbtn").removeClass("active");
	$(".tabpanel").hide();
	$("#" + did).toggle();
	$(obj).addClass("active");
}
</script>
<style>
body {
	font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   	font-weight: 300;
   	background-color: #222;
   	color: #999;
   	padding: 0;
   	margin:  80px 0 0 0;
}
ul {
	list-style-type: none;
}
ul.clvl {
	user-select: none;
}
li.xsdc {
	box-shadow: 2px 1px 1px #ccc;
	padding: 4px 8px;font-size:14px;
	border-radius: 0 50% 50% 0;
	line-height: 25px;
	user-select: none;
}
li.xsdc span {
	color: #999;
	font-size: 11px;
	float: right;
	margin-right: 10px
}
.ftag {
	width: 98%;
	z-index: -2;
	padding: 4px 8px;
	font-size: 12px;
	position: absolute;
	color: #eee;
	background-color: #242424;
}
/*
.ftag:after {
        display: block;
        width: 92%;
        height: 1px;
        content: " ";
        sborder-top: 1px dashed #2a2a2a;
        margin-left: 120px;
        margin-top: -8px;
        position: absolute;
}*/
.phtmlt {
	width: auto;
	z-index: -1;
	padding: 8px 50px;
	font-size: 12px;
	position: relative;
	color: #fff;
	background-color: #222;
}
.lvlln {
	width:150px;
	min-width:150px;
	color: #eee;
}
.lvlln:after {
	content: " ";
	margin: 20px 4px 4px 4px;
	display: block;
        	height: 95%;
        	z-index: -1;
        	min-height: 95%;
        	position: fixed;
	border-left: 1px dashed #2a2a2a;
}
.htmlo li.svc {
	font-size: 13px;
	background-color: #006699;
	margin: 10px;   
	border-radius: 5px 5px 0 0;
	border: solid 5px rgba(154, 154, 154, 1);
	border-bottom: none;
	padding: 8px;
	color: #fff; 
	cursor: pointer;
	user-select: none;
}
.htmlo li.src {
	font-family: monospace;
	margin: -10px 10px 30px 10px;   
	border-radius: 0 0 5px 5px;
	border: solid 5px rgba(154, 154, 154, 1);
	border-top: none;
	color: #fff; 
	background-color: #006699;
}
.htmlo li.src .srvs {
	background-color: rgb(128, 128, 128);
	padding: 8px;
	display: none;
	border-radius: 35px;
	border: solid 20px rgba(154, 154, 154, 1);
	margin: 10px;
}
.svcimg {
   	width: 800px;
	text-align: center;
	border-radius: 5px;
	border: solid 15px rgba(154, 154, 154, 1);
	padding: 0;
	margin: 0 auto;
    	margin-bottom: 50px;
}
.svcimg img {
    	width: 800px;
    	margin-bottom: -4px;
}
.tbtn {
	text-align: center;
	cursor: pointer;
	width: 200px;
	background-color: #1c1c1c;
	color: #999;
	padding: 8px;
	font-weight: 900;
	user-select: none;
}
.tbtn:active {
	background-color: rgba(255, 255, 255, 0.8);
}
.tbtn.active {
	color: #fff;
}
.tabpanel {
	margin-left: 20px;
}
#xsltpanel {
	background-color: rgb(128, 128, 128);
	padding: 8px;
	display: none;
	border-radius: 35px;
	border: solid 20px rgba(154, 154, 154, 1);
	margin: 10px;
	color: #fff;
}
</style>
</head>
<body>
<div style="display: flex;margin-bottom: 30px;position: fixed; top: 0px;z-index: 999; background-color: #444;width: 100%;padding: 2px;">
	<div onclick="toggleTab(this, 'xsdpanel');" class="tbtn active">XSD</div>
	<div  onclick="toggleTab(this, 'xsltpanel')" class="tbtn">XSLT</div>
	<div  onclick="toggleTab(this, 'htmlpanel')" class="tbtn">HTML</div>
</div>

<div id="xsdpanel" class="tabpanel">
<div style="width:auto;display:flex;position:relative;top:0">
	<div style="width:194px;min-width:194px">&nbsp;</div>
	<div class="lvlln">0</div>
	<div class="lvlln">1</div>
	<div class="lvlln">2</div>
	<div class="lvlln">3</div>
	<div class="lvlln">4</div>
	<div class="lvlln">5</div>
	<div class="lvlln">6</div>
	<div class="lvlln">7</div>
	<div class="lvlln">8</div>
</div>


`;
	}
	/**
	 * showLog 
	 */
	showLogs(sender) {
		if (!sender.verbose)
			console.log("");

		if (sender.verbose) {
			console.log("\n\n\x1b[0m\x1b[32mHTML OBJECTS: \x1b[0m\x1b[36m");
			this.htmlOutput  += `<div style="background-color: #222;padding: 8px;font-size:12px;"><BR><BR><h2>HTML OBJECTS: </h2>\n\n<div class="svcimg"><img src="scrnsht.png"></div>\n<BR><p style="margin-left:50px;">DoubleClick for src</p>\n`; 

			console.log("\x1b[0m\x1b[2m");
			this.htmlOutput  += `\n<ul style="color: #fff;" class="htmlo">\n`; 
			sender.htmlOutput.HTMLObjects.forEach( (item, index1) => {
				item.itemObject.groups.forEach( (gitem, index2) => {
					gitem.itemObject.items.forEach( (eitem, index3) => {
						console.log(eitem.tag + "\t=>\t" + (eitem.label || eitem.name) );
						this.htmlOutput  += `<li class="svc" ondblclick="$('#src${index1}_${index2}_${index3}').slideToggle()">${eitem.label}</li>\n`; 
						this.htmlOutput  += `<li class="src"><div class="srvs" id="src${index1}_${index2}_${index3}" ><code>${eitem.tagToHtml(sender.htmlTagParser).toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<BR>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')}</code></div></li>\n`; 
					});
				});
			});
			this.htmlOutput  += `</ul>\n</div>\n`; 
		} else {
			console.log("");
		}
		console.log("\x1b[0m");
		console.log(new Date());
		
		this.htmlOutput  += `\n</div>\n<div id="xsltpanel" class="tabpanel" style="display: none;"><code>
${sender.xslt.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<BR>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')}
</code></div>`;
		this.htmlOutput  += `\n<div style="background-color: #222;font-size:12px;color:#777;margin: 20px; width: auto; text-align: center;"><BR><BR>${new Date()}</div>\n`; 

		console.log("\n\x1b[2m\x1b[33m==================================================================================================================================================\n\x1b[0m");
	}

	/**
	 * logXSD 
	 * @param xObject
	 */
	logXSD(xObject) {
		console.log("\n\n\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
		console.log(`                                                             \x1b[1m\x1b[36mFILE : ${xObject.xfile} \x1b[0m\n`);
		console.log("\x1b[2m\x1b[36m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

		this.htmlOutput  += `<h2><span style="color:#777;background-color: #222;">XSD File:</span> ${xObject.xfile}</h2>\n`; 
	}

	/**
	 * logHTML 
	 * @param xObject
	 */
	logHTML(xObject) {
		console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
		console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xObject.hfile} \x1b[0m\n`);
		console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

		this.htmlOutput  += `\n</div>\n<div id="htmlpanel" class="tabpanel" style="display:none;">\n<h2 style="background-color: #222;margin: 0;"><span style="color:#777;">XML File:</span> ${xObject.hfile}</h2>\n`; 
	}

	/**
	 * showItemLog - ShowLog
	 * @param xsdItem
	 */
	showItemLog(xsdItem, verbose) {

		let xspace = "  ";
		for (let i = 0; i < xsdItem.level; i++) {
			xspace += "\t";
		}

		console.log(`${xspace}\x1b[0m\x1b[31m▓▓▓▓▓▓▓▓▓▓▓▓▓\x1b[0m`);
		process.stdout.write(`${xspace}\x1b[2m▓▓▓▓ \x1b[0m\x1b[2mL:${xsdItem.level} \x1b[2m▓▓▓▓\x1b[0m\x1b[31m⇢\x1b[0m `);
		this.htmlOutput  += `<ul style="margin-left:${(xsdItem.level +1) * 150}px;" class="clvl" lvl="${xsdItem.level}"><div style="width:100px;padding:4px 8px;font-size:14px;color:#fff;background-color:#006699;font-weight:700;">Level ${xsdItem.level}</div>`; 

		if (xsdItem.children) {
			process.stdout.write(`\x1b[1m${xsdItem.name}`);
			this.htmlOutput  += `<li class="xsdc" style="width:200px;color:#006699;background-color:#fff;">${xsdItem.name}\t<span>line ${xsdItem.line}</span></li>\n`; 

			if (xsdItem.attr.name) {
				process.stdout.write(` - ${xsdItem.attr.name}`);
				this.htmlOutput  += `<li class="xsdc" style="border-radius:0;width:300px;font-size:13px;color:#cc0000;background-color:#fafafa;"><b>${xsdItem.attr.name}</b></li>\n`; 

				if (verbose) {
					if (xsdItem.name === "xs:element") {
						let txmlItem = xsdItem.toString();
						txmlItem = txmlItem.split("\n").join("");
						txmlItem = txmlItem.split("<").join(xspace + `\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓  \x1b[2m<`);

						let pos1 = txmlItem.indexOf("<xs:documentation>");
						if (pos1 > 0) {
							let pos2 = txmlItem.indexOf("</xs:documentation>");
							txmlItem = txmlItem.substring(0, pos1) + "<xs:documentation> ..." + txmlItem.substring(pos2);
						}
						process.stdout.write(`\x1b[2m${txmlItem}`);
					}
				}
			} else if (xsdItem.attr.value) {
				process.stdout.write(`\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓  \x1b[2m${xsdItem.attr.value}\x1b[0m`);
				this.htmlOutput  += `<li class="xsdc"style="border-radius:0;width:300px;font-size:11px;color:#333;background-color:#dcedf4;"><b>${xsdItem.attr.value}</b></li>\n`; 
			} else if (xsdItem.attr.ref) {
				process.stdout.write(`\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓  \x1b[2m\x1b[36mRef: \x1b[1m\x1b[36m${xsdItem.attr.ref}\x1b[0m`);
				this.htmlOutput  += `<li class="xsdc"style="border-radius:0;width:300px;font-size:11px;color:#333;background-color:#dcedf4;">Ref: ${xsdItem.attr.ref}</li>\n`; 
			}

			process.stdout.write(`\n\x1b[2m${xspace}▓▓▓▓▓▓▓▓▓▓▓▓▓`);

			if (xsdItem.name === "xs:documentation" && xsdItem.xparent.name === "xs:annotation") {
				let txmlItem = xsdItem.val.toString().trim();
				if (txmlItem.length > 60) 
					txmlItem = txmlItem.substring(0, 60) + "...";
				process.stdout.write(` \x1b[2m\x1b[37m ${txmlItem}\x1b[0m\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓`);	
			}

			if (xsdItem.xparent) {
				console.log(`\x1b[2m\x1b[32m  parent ::\x1b[1m ${xsdItem.xparent.name}\x1b[0m`);
				if (xsdItem.xparent.attr.name) {
					console.log(`${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓ \x1b[2m\x1b[32m par.name ::\x1b[1m ${xsdItem.xparent.attr.name}\x1b[0m`);
				}
			}
		}

		if (xsdItem.level === 0)
			console.log(" ");

		this.htmlOutput  += `</ul>`; 

		process.stdout.write(`\x1b[2m${xspace}         ▒▒`);
	}

	/**
	 * logXsdTag - Log XSD Element Tag
	 * @param item
	 */
	logXsdTag(item) {
		console.log(`\x1b[0m\x1b[31m⇣\x1b[2m Found Tag \x1b[33m${item}\x1b[0m`);
		this.htmlOutput  += `<div class="ftag"># ${item}</div>\n`; 
	}

	/**
	 * logTODO - Log XSD Element Tag
	 * @param msg
	 */
	logTODO(msg) {
		console.log(`\x1b[1m\x1b[31mTODO: \x1b[0m${msg}\x1b[0m`);
	}

	/**
	 * logHtmlTag - Log HTML Element Tag
	 * @param item
	 */
	logHtmlTag(item, sender) {
		if (sender.verbose) {
			console.log(`\x1b[0m\x1b[31m⇣\n\x1b[2mParsing HTML Tag ⇢ \x1b[33m${item.name}\x1b[0m\n`);
			this.htmlOutput  += `<div class="phtmlt"># <b>${item.name}</b> :: <b>${item.label  || item.attr.element  || item.attr.name || ' '}</b></div>\n`; 
		}
	}

	/**
	 * getHtmlLog
	 */
	getHtmlLog() {
		return this.htmlOutput  + `
</body>
</html> `;
	}

}


module.exports = XSDWebFormParserLog;