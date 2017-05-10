'use strict';

import { expect } from 'chai';
import request from 'request';
import httpUtils  from 'request-mocha';
import openurl from 'openurl';
import { xsdWebForm } from '../src/xsdwebform';

var showCoverageHTML = false;

describe('Creating Class', function() {

	before(function() {
		process.argv.forEach(  (item, index) => {
					if (item == '-c') {
						showCoverageHTML = true;
						return;
					}
				});		
	});

	it('XSDWebForm CLASS', function() {
		return xsdWebForm
			.then(function(data) {
				
				describe('Form.xml Filename:', function() {
					it('should return test.', function() {
						expect(data.baseFileName).to.be.equal('test.');
					});
				});


				describe("Test web server:", function() {
					new httpUtils(request).save('http://localhost:3001/' + data.baseFileName + 'html');
					it("Return Status: 200", function() {
						expect(this.err).to.equal(null);
						expect(this.res.statusCode).to.equal(200);
					});
				});

				after(function() {
					if (showCoverageHTML)
						openurl.open(`file:///${__dirname}/../coverage/lcov-report/index.html`);
				});

			});		
	});
});