describe('contractRegistry', function() {
  'use strict';
  var registry;
  
  beforeEach(function() {
    registry = ReliableJavaScript.contractRegistry();
  });
  
  describe('define(contractName,evaluator)', function() {

    it('throws if contractName is not a string',function() {
      expect(function() {
        registry.define(undefined,function() {});
      }).toThrow(new Error(registry.messages.nameMustBeString));
    });
    
    it('throws if evaluator is not a function', function() {
      expect(function() {
        registry.define('myContract','not a function');
      }).toThrow(new Error(registry.messages.evaluatorMustBeFunction));
    });
        
    it('does not throw if contractName is a string and evaluator is a function', 
    function() {
      expect(function() {
        registry.define('myContract',function() {});
      }).not.toThrow();
    });
  });
  
  describe('fulfills(contractName,obj)', function() {

    it('throws if contractName is not in the registry',function() {
      function expectThrow(contractName) {
        expect(function() {
          registry.fulfills(contractName,{});
        }).toThrow(new Error(
          registry.getMessageForNameNotRegistered(contractName)));
      }
      [undefined,'abc'].forEach(expectThrow);
    });
  });
});