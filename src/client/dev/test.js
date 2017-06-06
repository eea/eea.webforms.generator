'use strict';

import { expect } from 'chai';
import request from 'request';
import httpUtils from 'request-mocha';
import wcag from 'wcag';

var URL_TO_TEST = "http://webq2test.eionet.europa.eu/";

describe('Testing Form', function() {

	before(function() {
		
	});

	describe('WCAG 2-AA Accessibility Checker ' + URL_TO_TEST, function() {
		
		it('Test', function() {
			return test().then(function(res) {
				it("Returns: 'PASS'", function() {
					expect(res.status).to.equal("PASS");
					done();
				});
			});
		});

	});
});

function test() {
	return new Promise((resolve, reject) => {
		var tester = new XSDWebFormParserTestAccessibility(URL_TO_TEST);
		tester.test().then ((res) => {
			let cres = "\x1b[32m ✓\x1b[1m ";
			let cresPlus = "";
			if (res.status !== 'PASS') {
				cres = "\x1b[31mx ";
				cresPlus += "\n\x1b[37m\x1b[1mErrors: \x1b[2m" + res.errors.map((item) => {
					return `\n\tLine: ${item.line}, Column: ${item.column}\n\t\x1b[31m\x1b[1m${item.message}\n\t\x1b[0m\x1b[37m${item.solution}\n\x1b[2m`
				}).join("");
				cresPlus += "\n\x1b[37m\x1b[1m\nPotential Problems: \x1b[2m" + res.potentialProblems.map((item) => {
					return `\n\tLine: ${item.line}, Column: ${item.column}\n\t\x1b[31m\x1b[1m${item.message}\n\t\x1b[0m\x1b[37m${item.source}\n\x1b[2m`
				}).join("");
			}
			console.log(`\x1b[1m\x1b[37mWCAG 2-AA Accessibility checking: \x1b[1m${cres}${res.status} ${cresPlus}\n\x1b[0m\x1b[37mcheck ${URL_TO_TEST} Form Testing Component for Onsite testing results\n\n`);
			resolve();
		});
	});
}

class XSDWebFormParserTestAccessibility {
	constructor(url) {
		this.url = url;
		this.acblt = { 
			options : {
				id: 'cb8b45b1bf19ff2d3c5a7f270e571e7acc055084',
				uri: url,
				guide: 'WCAG2-AA'
			}
		};
	}

	test() {
		return new Promise( (resolve, reject) => {
			wcag(this.acblt.options, function(error, data) {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});
	}
}

