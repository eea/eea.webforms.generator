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
	$("ul.clvl").each(function (index) {

		var lvl = $(this).attr("lvl");
		var th = 16;			
		var prlvl = $(this).prevAll("ul.clvl[lvl="+lvl+"]");
		var prlvlP1 = $(this).prevAll("ul.clvl:first");
		
		var pos = $(this).offset();
		var parentPos = prlvl.offset();
		
		if (parentPos && prlvlP1.attr("lvl") >  lvl) {
			th = pos.top - parentPos.top - $(this).outerHeight();
			if (th < 0 ) th = 16;
		}
		$(this).prepend($("<div style=\\"margin-top: -" + th + "px; position: absolute; background-color: rgb(206, 220, 50); height: " + th + "px; width: 16px;\\"></div>"));
	});
});
</script>
<style>
body {
	 font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   	font-weight: 300;
}

li.xsdc {
    box-shadow: 3px 3px 3px #ccc;
    padding:4px 8px;font-size:15px;
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
			this.htmlOutput  += `<h2>HTML OBJECTS: </h2>\n`; 

			console.log("\x1b[0m\x1b[2m");
			this.htmlOutput  += `<ul>\n`; 
			sender.htmlOutput.HTMLObjects.forEach( (item) => {
				item.itemObject.groups.forEach( (gitem) => {
					gitem.itemObject.items.forEach( (eitem) => {
						console.log(eitem.toString().substring(0, 40) + "...");
						this.htmlOutput  += `<li>${eitem.toString().substring(0, 80) .replace(/</g, '&lt;').replace(/>/g, '&gt;')}..</li>\n`; 
					});
				});
			});
			this.htmlOutput  += `</ul>\n`; 
		} else {
			console.log("");
		}
		console.log("\x1b[0m");
		console.log(new Date());
		
		this.htmlOutput  += `<div style="font-size:14px;color:#555">${new Date()}</div>\n`; 

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

		this.htmlOutput  += `<h2><span style="font-size:14px;color:#777">XSD File:</span> ${xObject.xfile}</h2>\n`; 
	}

	/**
	 * logHTML 
	 * @param xObject
	 */
	logHTML(xObject) {
		console.log("\n\n\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m");
		console.log(`                                                             \x1b[1m\x1b[33mFILE : ${xObject.hfile} \x1b[0m\n`);
		console.log("\x1b[2m\x1b[33m__________________________________________________________________________________________________________________________________________________\n\x1b[0m\n\n");

		this.htmlOutput  += `<h2><span style="font-size:14px;color:#777">XML File:</span> ${xObject.hfile}</h2>\n`; 
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
		this.htmlOutput  += `<ul style="margin-left:${xsdItem.level * 140}px;" class="clvl" lvl="${xsdItem.level}"><div style="width:100px;padding:4px 8px;font-size:15px;color:#fff;background-color:#333;font-weight:700;">Level ${xsdItem.level}</div>`; 

		if (xsdItem.children) {
			process.stdout.write(`\x1b[1m${xsdItem.name}`);
			this.htmlOutput  += `<li class="xsdc" style="width:200px;color:#fff;background-color:#777;">${xsdItem.name}</li>\n`; 

			if (xsdItem.attr.name) {
				process.stdout.write(` - ${xsdItem.attr.name}`);
				this.htmlOutput  += `<li class="xsdc" style="width:300px;font-size:14px;color:#fff;background-color:#999;"><b>${xsdItem.attr.name}</b></li>\n`; 

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
				this.htmlOutput  += `<li class="xsdc"style="width:300px;font-size:14px;color:#fff;background-color:#aaa;"><b>${xsdItem.attr.value}</b></li>\n`; 
			} else if (xsdItem.attr.ref) {
				process.stdout.write(`\n${xspace}\x1b[2m▓▓▓▓▓▓▓▓▓▓▓▓▓  \x1b[2m\x1b[36mRef: \x1b[1m\x1b[36m${xsdItem.attr.ref}\x1b[0m`);
				this.htmlOutput  += `<li class="xsdc"style="width:300px;font-size:14px;color:#fff;background-color:#aaa;">Ref: ${xsdItem.attr.ref}</li>\n`; 
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
		this.htmlOutput  += `<div style="width:98%;z-index:-1;padding:4px 8px;font-size:12px;position:absolute;color:#333;background-color:#fafafa;">Found Tag >> ${item}</div>\n`; 
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
			this.htmlOutput  += `<div style="width:98%;z-index:-1;padding:4px 8px;font-size:12px;position:relative;color:#333;background-color:#f5f5f5;">Parsing HTML Tag >> <b>${item.name}</b> :: <b>${item.attr.element  || item.attr.name || ' '}</b></div>\n`; 
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