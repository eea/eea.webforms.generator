'use strict';

import { expect } from 'chai';
import request from 'request';
import httpUtils  from 'request-mocha';
import { xsdWebForm } from '../src/xsdwebform';

describe('Creating Class', function() {

	it('XSDWebForm CLASS', function() {
		return xsdWebForm
			.then(function(data) {
				
				describe("Web Server:", function() {
					new httpUtils(request).save('http://localhost:3001/' + data.baseFileName + 'html');
					it("Return Status: 200", function() {
						expect(this.err).to.equal(null);
						expect(this.res.statusCode).to.equal(200);
					});
				});

				describe('Filename:', function() {
					it('should return test.', function() {
						expect(data.baseFileName).to.be.equal('test.');
					});
				});


			});
	});
});