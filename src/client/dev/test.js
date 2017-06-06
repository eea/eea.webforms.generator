'use strict';

import { expect } from 'chai';
import request from 'request';
import httpUtils from 'request-mocha';
import { xsdWebForm } from '..xsdwebform';

describe('Testing Form', function() {

	before(function() {
		
	});

	it('Test', function() {
		
		describe('[1]:', function() {
			return data.tester.test()
					.then(function(res) {
						describe("Build WCAG 2-AA Accessibility Checker:", function() {
							it("Returns: 'PASS'", function() {
								expect(res.status).to.equal("PASS");
							});
						});

					});
				done();
		});

	});
});