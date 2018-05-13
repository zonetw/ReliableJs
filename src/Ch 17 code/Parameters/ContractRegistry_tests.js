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
    
    it('throws if contractName is an empty string', function() {
      expect(function() {
        registry.define("",function() {});
      }).toThrow(new Error(ContractRegistry.messages.nameMustBeString));
    });
    
    it('throws if contractName is a blank string', function() {
      expect(function() { 
        registry.define(" ",function() {});
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
  
  describe('defineMultiple(contracts)', function() {
    it('throws if contracts is not an array of objects that have name and ' +
    'evaluator properties', function() {
      function expectThrow(contracts) {
        expect(function() {
          registry.defineMultiple(contracts);
        }).toThrow(new Error(ContractRegistry.messages.contractsArrayInvalid));
      }
      [ undefined,
        null,
        123,
        function(){},
        'a string',
        [{ 'an object with wrong properties': 0 }],
      ].forEach(expectThrow);
    });
    
    it('calls define(c.name, c.evaluator) for each element c in contracts', 
    function() {
      var contracts = [
        {name: 'abc', evaluator: function() {return true;}},
        {name: 'abc', evaluator: function() {return false;}},
      ];
      spyOn(registry,'define');
      registry.defineMultiple(contracts);
      expect(registry.define.calls.count()).toBe(2);
      contracts.forEach(function(c) {
        expect(registry.define).toHaveBeenCalledWith(c.name, c.evaluator);
      });
    });
    
    it('returns the registry, enabling chaining', function() {
      expect(registry.defineMultiple([])).toBe(registry); 
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
    
    it('trims the contract name before using it', function() {
      expect(registry.fulfills('  '+isArray+'  ',ary)).toBe(true);
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
    
    describe('when validator is an array',function() {
      function passOrFail(contractName, arg) {
        return contractName==='passes';
      }
      it('returns true if the array is empty', function() {
        expect(registry.multipleFulfills([],[1,2,3]))
          .toBe(true);
      });
      
      it('returns true if validator is a single-element array whose ' +
      'contracts all pass', function() {
        var validator=['passes,passes,passes'],
            args = [1,2,3];
        spyOn(registry,'fulfills').and.callFake(passOrFail);
        expect(registry.multipleFulfills(validator,args)).toBe(true);
        expect(registry.fulfills).toHaveBeenCalledWith('passes',1);
        expect(registry.fulfills).toHaveBeenCalledWith('passes',2);
        expect(registry.fulfills).toHaveBeenCalledWith('passes',3);
      });
      
      it('returns false if validator is a single-element array that ' +
      'contains one failing contract', function() {
        var validator=['passes,fails,passes'],
            args = [1,2,3];
        spyOn(registry,'fulfills').and.callFake(passOrFail);
        expect(registry.multipleFulfills(validator,args)).toBe(false);
        expect(registry.fulfills).toHaveBeenCalledWith('passes',1);
        expect(registry.fulfills).toHaveBeenCalledWith('fails',2);
        // Only 2 calls necessary because should have settled on false
        // after the failure on the second argument
        expect(registry.fulfills.calls.count()).toBe(2);  
      });
      
      it('evaluates no more contracts than necessary in a ' +
      'single-element array', function() {
        var validator=['passes,fails,passes'],
            args = [1,2,3];
        spyOn(registry,'fulfills').and.callFake(passOrFail);
        expect(registry.multipleFulfills(validator,args)).toBe(false);
        // Only 2 calls necessary because should have settled on false
        // after the failure on the second argument
        expect(registry.fulfills.calls.count()).toBe(2);        
      });
      
      it('ignores spaces surrounding commas in validator', function() {
        var validator=['a, b, c ,   d'],
            args = [1,2,3,4];
        spyOn(registry,'fulfills').and.returnValue(true);
        registry.multipleFulfills(validator,args);
        expect(registry.fulfills).toHaveBeenCalledWith('a',1);
        expect(registry.fulfills).toHaveBeenCalledWith('b',2);
        expect(registry.fulfills).toHaveBeenCalledWith('c',3);
        expect(registry.fulfills).toHaveBeenCalledWith('d',4);
      });
      
      it('skips validation of elements that correspond to consecutive ' +
      'commas in a validator element', function() {
        var validator=['a,, , d'],
            args=[1,2,3,4];
        spyOn(registry,'fulfills').and.returnValue(true);
        registry.multipleFulfills(validator,args);
        expect(registry.fulfills).toHaveBeenCalledWith('a',1);
        expect(registry.fulfills).toHaveBeenCalledWith('d',4);
        expect(registry.fulfills.calls.count()).toBe(2);
      });
      
      it('ignores extra arguments when evaluating a comma-separated ' +
      'string of contract names', function() {
        var validator=['a,b'],
            args=[1,2,3];
        spyOn(registry,'fulfills').and.returnValue(true);
        registry.multipleFulfills(validator,args);
        expect(registry.fulfills).toHaveBeenCalledWith('a',1);
        expect(registry.fulfills).toHaveBeenCalledWith('b',2);
        expect(registry.fulfills.calls.count()).toBe(2);
      });
      
      it('allows args to fulfill any one of the elements in the array ' +
      'of comma-separated strings of contract names', function() {
        var validator=[
              'passes,fails',
              'passes,passes',
              'fails,fails' 
            ],
            args = [1,2];
        spyOn(registry,'fulfills').and.callFake(passOrFail);
        expect(registry.multipleFulfills(validator,args)).toBe(true);
        expect(registry.fulfills.calls.count()).toBe(4);
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
  
  describe('multipleAssert(validator,args)', function() {
    it('throws if multipleFulfills(validator,args) return false', function() {
      var validator='contractName',
          args = [123];
      spyOn(registry,'multipleFulfills').and.returnValue(false); 
      expect(function() {
        registry.multipleAssert(validator,args);
      }).toThrow(new Error(ContractRegistry.messages.argsFailedContract));
      expect(registry.multipleFulfills).toHaveBeenCalledWith(validator,args);
    });
    
    it('does not throw if multipleFulfills(validator,args) return true',
    function() {
      var validator='contractName',
          args = [123];
      spyOn(registry,'multipleFulfills').and.returnValue(true); 
      registry.multipleAssert(validator,args); // does not throw
      expect(registry.multipleFulfills).toHaveBeenCalledWith(validator,args); 
    });
    
   it('returns the registry, enabling chaining', function() {
      expect(registry.multipleAssert(isArray,[])).toBe(registry);
    });    
  });
  
  describe('attachArgumentsValidator(funcName, funcObj, validator)', 
  function() {
    var funcName = 'func', 
        funcObj,
        isString = 'isString', isLetter = 'isLetter', hasLength='hasLength',
        contractNames = [isString, isLetter, hasLength];
        
    beforeEach(function() {
      funcObj = {};
      funcObj[funcName] = function() {
        return Array.prototype.slice.call(arguments,0);
      };
    });   
    describe('own arguments validation', function() {
      
      it('throws if  funcName is not a string', function() {
        function expectThrow(contractName) {
          expect(function() { 
            registry.attachArgumentsValidator(
              12345,funcObj,contractNames);
          }).toThrow(new Error(ContractRegistry.messages.funcNameMustBeString));
        }
        [undefined,function(){},123].forEach(expectThrow);
      });
      
      it('throws if funcObj is not an object', function() {
        function expectThrow(obj) {
          expect(function() {
            registry.attachArgumentsValidator(funcName,obj,contractNames);
          }).toThrow(new Error(ContractRegistry.messages.funcObjMustBeObject));
        }
        [undefined,'abc',123].forEach(expectThrow);      
      });
      
      it('throws if validator is not a string; an array of strings, ' +
      'or a function', function() {
        function expectThrow(names) {
          expect(function() {
            registry.attachArgumentsValidator(funcName,funcObj,names);
          }).toThrow(new Error(ContractRegistry.messages.validatorsInvalid));
        }
        [ undefined,
          null,
          123,
          ['xyz',0/*not a string*/],
          { 'an': 0, 'object': 1 }
        ].forEach(expectThrow);      
      });
    });
    
    describe('aspect functionality', function() {
      var obj;
      beforeEach(function() {
        obj = {
          prop: 123,
          func: function func() {
            return arguments[0]+arguments[1];
          }
       }; 
      });
      it('calls registry.multipleAssert(validator,arguments)', function() {
        function validator(args) {
          return this.prop === 123;
        }  
        registry.attachArgumentsValidator('func',obj,validator);
        spyOn(registry,'multipleAssert').and.callFake(function(val,args) {
          expect(val).toBe(validator);
          expect(args.length).toBe(2);
          expect(args[0]).toBe('a');
          expect(args[1]).toBe('b');
        });
        obj.func('a','b');
        expect(registry.multipleAssert).toHaveBeenCalled();
      });
      
      it('allows the function to execute and return normally', function() {
        function validator(args) {
          return true;
        }  
        registry.attachArgumentsValidator('func',obj,validator);
        spyOn(registry,'multipleAssert').and.returnValue(undefined);
        expect(obj.func('a','b')).toBe('ab');
      });
    });

    it('returns the registry, enabling chaining', function() {
      expect(registry.attachArgumentsValidator(funcName,funcObj,contractNames))
        .toBe(registry);
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