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
		$(this).prepend($("<div style=\\"margin-top: -" + th + "px;position: absolute; background-color: rgb(204, 0, 0); height: " + th + "px; width: 16px;\\"></div>"));
	});
});
</script>
<style>
body {
	font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   	font-weight: 300;
   	background-color: #222;
   	color: #999;
}
ul {
	list-style-type: none;
}
li.xsdc {
	box-shadow: 2px 1px 1px #ccc;
	padding: 4px 8px;font-size:15px;
	border-radius: 0 50% 50% 0;
	line-height: 25px;
}
li.xsdc span {
	color: #999;
	font-size: 11px;
	float: right;
}
.ftag {
	width: 98%;
	z-index: -1;
	padding: 4px 8px;
	font-size: 13px;
	position: absolute;
	color: #eee;
	background-color: #242424;
}
.phtmlt {
	width: auto;
	z-index: -1;
	padding: 8px 50px;
	font-size: 13px;
	position: relative;
	color: #fff;
	/*background-color: rgb(204, 0, 0);*/
}
</style>
</head>
<body>
`;
	}
	/**
	 * showLog 
	 */
	showLogs(sender) {
		if (!sender.verbose)
			console.log("");

		// process.stdout.write(sender.htmlOutput.HTMLObjects[0]);
		if (sender.verbose) {
			console.log("\n\n\x1b[0m\x1b[32mHTML OBJECTS: \x1b[0m\x1b[36m");
			this.htmlOutput  += `<BR><BR><h2>HTML OBJECTS: </h2>\n`; 

			console.log("\x1b[0m\x1b[2m");
			this.htmlOutput  += `<div style="/*background-color: rgb(0, 51, 153);*/padding: 8px;font-size:13px;color: #fff;">\n<ul>\n`; 
			sender.htmlOutput.HTMLObjects.forEach( (item) => {
				item.itemObject.groups.forEach( (gitem) => {
					gitem.itemObject.items.forEach( (eitem) => {
						console.log(eitem.toString().substring(0, 40) + "...");
						this.htmlOutput  += `<li style="padding: 8px;">${eitem.toString().substring(0, 80) .replace(/</g, '&lt;').replace(/>/g, '&gt;')}..</li>\n`; 
					});
				});
			});
			this.htmlOutput  += `</ul>\n</div>\n`; 
		} else {
			console.log("");
		}
		console.log("\x1b[0m");
		console.log(new Date());
		
		this.htmlOutput  += `\n<BR><BR><div style="font-size:14px;color:#777">${new Date()}</div>\n`; 

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

		this.htmlOutput  += `<h2><span style="color:#777">XSD File:</span> ${xObject.xfile}</h2>\n`; 
	}

	/**
	 * logHTML 
	 * @param xObject
	 */
	logHTML(xObject) {
		console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
		console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xObject.hfile} \x1b[0m\n`);
		console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

		this.htmlOutput  += `<BR><BR><h2><span style="color:#777">XML File:</span> ${xObject.hfile}</h2>\n`; 
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
		this.htmlOutput  += `<ul style="margin-left:${(xsdItem.level +1) * 150}px;" class="clvl" lvl="${xsdItem.level}"><div style="width:100px;padding:4px 8px;font-size:15px;color:#fff;background-color:rgb(0, 51, 153);font-weight:700;">Level ${xsdItem.level}</div>`; 

		if (xsdItem.children) {
			process.stdout.write(`\x1b[1m${xsdItem.name}`);
			this.htmlOutput  += `<li class="xsdc" style="width:200px;color:rgb(0, 51, 153);background-color:#fff;">${xsdItem.name}\t<span>line ${xsdItem.line}</span></li>\n`; 

			if (xsdItem.attr.name) {
				process.stdout.write(` - ${xsdItem.attr.name}`);
				this.htmlOutput  += `<li class="xsdc" style="border-radius:0;width:300px;font-size:14px;color:rgb(204, 0, 0);background-color:#fafafa;"><b>${xsdItem.attr.name}</b></li>\n`; 

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
				this.htmlOutput  += `<li class="xsdc"style="border-radius:0;width:300px;font-size:12px;color:#333;background-color:#dee6f7;"><b>${xsdItem.attr.value}</b></li>\n`; 
			} else if (xsdItem.attr.ref) {
				process.stdout.write(`\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓  \x1b[2m\x1b[36mRef: \x1b[1m\x1b[36m${xsdItem.attr.ref}\x1b[0m`);
				this.htmlOutput  += `<li class="xsdc"style="border-radius:0;width:300px;font-size:12px;color:#333;background-color:#dee6f7;">Ref: ${xsdItem.attr.ref}</li>\n`; 
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

		this.htmlOutput  += `</ul>\n`; 

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
			this.htmlOutput  += `<div class="phtmlt"># <b>${item.name}</b> :: <b>${item.attr.element  || item.attr.name || ' '}</b></div>\n`; 
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