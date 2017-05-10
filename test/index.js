import {expect} from 'chai';
import XSDWebForm from '../src/xsdwebform';


var xsdWebForm = new XSDWebForm();
console.log("xsdWebForm", xsdWebForm.baseFileName);

describe('xsdWebForm = ', function(){
  describe('new XSDWebForm()', function(){
    it('should return test.', function(){
      expect(xsdWebForm.baseFileName).to.be.equal('test.');
    });
  });

});