'use strict';

import { expect } from 'chai';
import request from 'request';
import { xsdWebForm } from '../src/xsdwebform';
var httpUtils = require('request-mocha')(request);


// var otest = xsdWebForm.test();
// console.log("xsdWebForm.test()", otest);
// otest.then ( (resp) => {
// 	console.log(resp);
// 	describe('xsdWebForm ', function() {
// 		describe('baseFileName', function() {
// 			it('should return test.', function() {
// 				expect(xsdWebForm.baseFileName).to.be.equal('test.');
// 			});
// 		});
// 	});
// });
it('xsdWebForm', function() {
	return xsdWebForm
		.then(function(data) {
			console.log("data", data.baseFileName);
			
			describe('baseFileName', function() {
				it('should return test.', function() {
					expect(data.baseFileName).to.be.equal('test.');
				});
		});


		});
});

// otest.then( (resp) => {

// 	console.log(xsdWebForm);


//     console.log("resp", resp);

// 	describe('xsdWebForm ', function() {
				
// 		describe('baseFileName', function() {
// 			it('should return test.', function() {
// 				expect(xsdWebForm.baseFileName).to.be.equal('test.');
// 			});
// 		});

// 		describe("Web Server", function() {

// 			httpUtils.save('http://localhost:3001/' + xsdWebForm.baseFileName + 'html');
// 			it("return status", function() {
// 				// console.log("-------------xsdWebForm", xsdWebForm.errorS);

// 				expect(this.err).to.equal(null);
// 	    			expect(this.res.statusCode).to.equal(200);

// 	    			// expect(this.body).to.equal('Hello World!');

// 				// request.get(url, function(error, response, body) {
// 					// console.log("response.statusCode", response.statusCode);
// 					// expect(response.statusCode).to.be.equal(200);
// 					// done();
// 				// });
// 			});

// 			// it("returns the color in hex", function() {
// 			// 	request(url, function(error, response, body) {
// 			// 		expect(body).to.equal("ffffff");
// 			// 	});
// 			// });

// 		});
// 	});

// });