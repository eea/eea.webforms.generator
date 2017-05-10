'use strict';

import { expect } from 'chai';
import request from 'request';
import { xsdWebForm } from '../src/xsdwebform';
var httpUtils = require('request-mocha')(request);

describe('Creating Class', function() {

	it('xsdWebForm', function() {
		return xsdWebForm
			.then(function(data) {
				
				describe('Filename', function() {
					it('should return test.', function() {
						expect(data.baseFileName).to.be.equal('test.');
					});
				});

				describe("Web Server", function() {
					httpUtils.save('http://localhost:3001/' + data.baseFileName + 'html');
					it("Return Status: 200", function() {
						expect(this.err).to.equal(null);
						expect(this.res.statusCode).to.equal(200);
					});
				});

			});
	});
});