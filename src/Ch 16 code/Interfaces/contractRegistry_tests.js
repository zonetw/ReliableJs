describe('contractRegistry', function() {
  'use strict';
  var registry,
      isArray = 'isArray',
      ary = [1,2,3];
  
  beforeEach(function() {
    registry = ReliableJavaScript.contractRegistry();
    registry.define(isArray,Array.isArray);
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
    
    it('returns true if the object fulfills the named contract',function() {
      expect(registry.fulfills(isArray,ary)).toBe(true);
    });
    it('returns false if the object does not fulfill the contract', function() {
      expect(registry.fulfills(isArray,'not an array')).toBe(false);
    });
  });
  
  describe('assert(contractName, obj)', function() {
    it('is based on fulfills(contractName, obj)', function() {
      spyOn(registry,'fulfills').and.callThrough();
      registry.assert(isArray,ary);
      expect(registry.fulfills).toHaveBeenCalledWith(isArray,ary);
    });
    it('does not throw if obj fulfills contractName', function() {
      registry.assert(isArray,ary);
    });
    it('throws if obj does not fulfill contractName', function() {
      var notAnArray = 'abc';
      expect(function() {
        registry.assert(isArray,notAnArray);
      }).toThrow(new Error(
        registry.getMessageForFailedContract(isArray,notAnArray)));
    });
  });
  
  describe('attachReturnValidator(funcName, funcObj, contractName)',
  function() {
    var funcName = 'func', 
        funcObj,
        returnValue = [1,2,3];
        
    beforeEach(function() {
      funcObj = {},
      funcObj[funcName] = function() {
        return returnValue;
      };
    });
    describe('own argument validation', function() {
      
      it('throws if  funcName is not a string', function() {
        function expectThrow(contractName) {
          expect(function() { 
            registry.attachReturnValidator(
              12345,funcObj,isArray);
          }).toThrow(new Error(registry.messages.funcNameMustBeString));
        }
        [undefined,function(){},123].forEach(expectThrow);
      });
      
      it('throws if funcObj is not an object', function() {
        function expectThrow(obj) {
          expect(function() {
            registry.attachReturnValidator(funcName,obj,isArray);
          }).toThrow(new Error(registry.messages.funcObjMustBeObject));
        }
        [undefined,'abc',123].forEach(expectThrow);      
      });
      
      it('throws if contractName is not a string', function() {
        function expectThrow(name) {
          expect(function() {
            registry.attachReturnValidator(funcName,funcObj,name);
          }).toThrow(new Error(registry.messages.nameMustBeString));
        }
        [ undefined,
          123,
          function(){},
          []
        ].forEach(expectThrow);      
      });
    });
    
    describe('aspect functionality', function() {
      
      it('returns the return value if it fulfills the contract',function() {
        registry.attachReturnValidator(funcName,funcObj,isArray);
        expect(funcObj[funcName]()).toEqual(returnValue);
      });
      
      it('throws if the return value does not fulfill the contract',
      function(){
        
        var isNumber = 'isNumber';
        registry.define(isNumber, function isNumber(ret) {
          return typeof ret === 'number';           
        });
        registry.attachReturnValidator(funcName, funcObj, isNumber);
        expect(function() {
          funcObj[funcName]();
        }).toThrow(new Error(
          registry.getMessageForFailedContract(isNumber,returnValue)));
      });
    });    
  });
});