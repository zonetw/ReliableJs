describe('ContractRegistry', function() {
  var ContractRegistry = ReliableJavaScript.ContractRegistry,
      registry,
      isArray = 'isArray',
      ary = [1,2,3];
  
  beforeEach(function() {
    registry = new ReliableJavaScript.ContractRegistry();
    registry.define(isArray,Array.isArray);
  });
  
  describe('construction', function() {
    it('requires new', function() {
      expect(function() {
        ContractRegistry();
      }).toThrow(new Error(ContractRegistry.messages.newRequired));
    });
  });
  
  describe('define(contractName,evaluator)', function() {

    it('throws if contractName is not a string',function() {
      expect(function() {
        registry.define(undefined,function() {});
      }).toThrow(new Error(ContractRegistry.messages.nameMustBeString));
    });

    it('throws if evaluator is not a function', function() {
      expect(function() {
        registry.define('myContract','not a function');
      }).toThrow(new Error(ContractRegistry.messages.evaluatorMustBeFunction));
    });
        
    it('does not throw if contractName is a string and evaluator is a function', 
    function() {
      expect(function() {
        registry.define('myContract',function() {});
      }).not.toThrow();
    });
    
    it('returns the registry, enabling chaining', function() {
      expect(registry.define('x',Array.isArray)).toBe(registry);
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
    it('is based on fulfills(contractName, obj', function() {
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
       
    it('returns the registry, enabling chaining', function() {
      expect(registry.assert(isArray,ary)).toBe(registry);
    });
  });
  
  describe('multipleFulfills(validator,args)', function() {
    
    describe('argument validation', function() {
      
      it('throws if validator is not a string, array of strings, or function',
      function() {
        function expectThrow(badValidator) {
          expect(function() {
            registry.multipleFulfills(badValidator,[]);
          }).toThrow(new Error(ContractRegistry.messages.validatorsInvalid));
        }
        [ undefined,
          null,
          123,
          ['xyz',0/*not a string*/],
          { 'an': 0, 'object': 1 }
        ].forEach(expectThrow); 
      });
      
      it('throws if args is not array-like',
      function() {
        function expectThrow(badArgs) {
          expect(function() {
            registry.multipleFulfills(function(){},badArgs);
          }).toThrow(new Error(ContractRegistry.messages.argsMustBeArrayLike));
        }
        [ undefined,
          null,
          123,
          function(){},
          'a string',
          { 'an': 0, 'object': 1 },
        ].forEach(expectThrow); 
      });
    });    
        
    describe('when validator is a string',function() {
      it('returns result of fulfills(validator,args)', 
      function() {
        var validator='aContractName',
            args = ['a','b'],
            returnFromFulfills = 'this could be true or false';
        spyOn(registry,'fulfills').and.returnValue(returnFromFulfills);
        expect(registry.multipleFulfills(validator,args))
          .toBe(returnFromFulfills);
        expect(registry.fulfills).toHaveBeenCalledWith(validator,args);
      });
    });
    
    describe('when validator is a function',function() {
      var args = ['a','b']; 
      
      it('returns the result of the validator called on args', function() {
        function isLength2() {
          return arguments.length === 2;
        }
        function isLength3() {
          return arguments.length === 3;
        }
        expect(registry.multipleFulfills(isLength2,args)).toBe(true);
        expect(registry.multipleFulfills(isLength3,args)).toBe(false);
      });
      
      it('calls validator with the registry as the context',function() {
        function calledOnRegistry() {
          expect(this).toBe(registry);
        }
        registry.multipleFulfills(calledOnRegistry,args);
      });
    });
  });
  
  describe('attachReturnValidator(funcName, funcObj, contractName)',
  function() {
    var funcName = 'func', 
        funcObj,
        returnValue = [1,2,3];
        
    beforeEach(function() {
      funcObj = {};
      funcObj[funcName] = function() {
        return returnValue;
      };
    });
    
    it('returns the registry, enabling chaining', function() {
      expect(registry.attachReturnValidator(funcName,funcObj,isArray))
        .toBe(registry);
    });
    
    describe('own argument validation', function() {
      
      it('throws if  funcName is not a string', function() {
        function expectThrow(contractName) {
          expect(function() { 
            registry.attachReturnValidator(
              12345,funcObj,isArray);
          }).toThrow(new Error(ContractRegistry.messages.funcNameMustBeString));
        }
        [undefined,function(){},123].forEach(expectThrow);
      });
      
      it('throws if funcObj is not an object', function() {
        function expectThrow(obj) {
          expect(function() {
            registry.attachReturnValidator(funcName,obj,isArray);
          }).toThrow(new Error(ContractRegistry.messages.funcObjMustBeObject));
        }
        [undefined,'abc',123].forEach(expectThrow);      
      });
      
      it('throws if contractName is not a string', function() {
        function expectThrow(name) {
          expect(function() {
            registry.attachReturnValidator(funcName,funcObj,name);
          }).toThrow(new Error(ContractRegistry.messages.nameMustBeString));
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