describe('Aop', function() {
  var targetObj, 
      targetFnReturn = 123,
      executionPoints,  // An array of execution events     
      argPassingAdvice, // An advice that passes arguments to the target
      argsToTarget,     // Arguments passed to targetObj.targetFn.
  
      Target = function() {
        var self = this;
        this.targetFn = function() {
          expect(this).toBe(self);
        };
      };
      
  beforeEach(function() {
    targetObj = {
      targetFn: function() {
        executionPoints.push('targetFn');
        argsToTarget = Array.prototype.slice.call(arguments,0);
        return targetFnReturn;
      }
    };
    
    executionPoints = [];

    argPassingAdvice = function(targetInfo) {
      return targetInfo.fn.apply(this, targetInfo.args);
    };
    
    argsToTarget = [];
  });
  
  describe('Aop.around(fnName, advice, targetObj)', function() {

    it('causes a call to the target function to execute the advice', function(){
      var executedAdvice = false;
      var advice = function() {
        executedAdvice = true;
      };
      Aop.around('targetFn', advice, targetObj);
      targetObj.targetFn();
      expect(executedAdvice).toBe(true);
    });
    
    it('allows the advice to wrap a call the target', function() {
      var wrappingAdvice = function(targetInfo) {
        executionPoints.push('wrappingAdvice - begin');
        targetInfo.fn();
        executionPoints.push('wrappingAdvice - end');
      };
      Aop.around('targetFn', wrappingAdvice, targetObj);
      targetObj.targetFn();
      expect(executionPoints).toEqual(
        ['wrappingAdvice - begin','targetFn','wrappingAdvice - end']);
    });
    
    it('can chain, with the last one set up being executed around the others', 
    function() {
      var adviceFactory = function(adviceID) {
        return (function(targetInfo) {
          executionPoints.push('wrappingAdvice - begin '+adviceID);
          targetInfo.fn();
          executionPoints.push('wrappingAdvice - end '+adviceID);
        });
      };
      Aop.around('targetFn',adviceFactory('inner'),targetObj);
      Aop.around('targetFn',adviceFactory('outer'),targetObj);
      targetObj.targetFn();
      expect(executionPoints).toEqual([
        'wrappingAdvice - begin outer',
        'wrappingAdvice - begin inner',
        'targetFn',
        'wrappingAdvice - end inner',
        'wrappingAdvice - end outer']);
    });
    
    it('allows the advice to pass the normal arguments to the target', 
    function() {
      Aop.around('targetFn', argPassingAdvice, targetObj);
      targetObj.targetFn('a','b');
      expect(argsToTarget).toEqual(['a','b']);
    });
    
    it("makes the target's return value available to the advice", function() {
      Aop.around('targetFn', argPassingAdvice, targetObj);
      var returnedValue = targetObj.targetFn();
      expect(returnedValue).toBe(targetFnReturn);
    });
    
    it('executes the target function in the context of its object', function() {
      var Target = function() {
        var self = this;
        this.targetFn = function() {
          expect(this).toBe(self);
        };
      };
      var advice = function(targetInfo) {
        //targetInfo.fn();
        Aop.next.call(this,targetInfo);
      };
      var targetInstance = new Target();
      var spyOnInstance = spyOn(targetInstance,'targetFn').and.callThrough();
      Aop.around('targetFn',advice,targetInstance);
      targetInstance.targetFn();
      expect(spyOnInstance).toHaveBeenCalled();
    });
    
    it('executes the advice in the context of the target', function() {
      var advice = function() {
        expect(this).toBe(targetObj);
      };
      Aop.around('targetFn',advice,targetObj);
      targetObj.targetFn();
    });
  });
  
  describe('Aop.next(context,targetInfo)', function() {
    var advice = function(targetInfo) {
      return Aop.next.call(this,targetInfo);
    };
    var originalFn;
    beforeEach(function() {
      originalFn = targetObj.targetFn;
      Aop.around('targetFn',advice, targetObj);
    });
    it('calls the function in targetInfo.fn', function() {
      targetObj.targetFn(); 
      expect(executionPoints).toEqual(['targetFn']);
    });
    it('passes the arguments in targetInfo.args', function() {
      targetObj.targetFn('a','b');
      expect(argsToTarget).toEqual(['a','b']);
    });
    it("returns the value from targetInfo's function", function() {
      var ret = targetObj.targetFn();
      expect(ret).toEqual(targetFnReturn);
    });
    it('calls the target function in the given context', function() {
      var targetInstance = new Target();
      var spyOnInstance = spyOn(targetInstance,'targetFn').and.callThrough();
      Aop.around('targetFn',advice,targetInstance);
      targetInstance.targetFn();
      expect(spyOnInstance).toHaveBeenCalled();
    });
  });
  
  describe('Aop.before(fnName, advice, targetObj)', function () {
    describe('when advice succeeds', function() {
      
      it('causes a call to the target function to execute the advice ' +
      'followed by the target', function() {
        var advice = function() {
           executionPoints.push('successfulAdvice');
        };
        Aop.before('targetFn',advice,targetObj);
        targetObj.targetFn();
        expect(executionPoints).toEqual(['successfulAdvice','targetFn']);
      });
      
      it('provides the arguments to the advice', function() {
        var argsToAdvice;
        var advice = function() {
          argsToAdvice = Array.prototype.slice.call(arguments,0);
        };
        Aop.before('targetFn',advice,targetObj);
        targetObj.targetFn(11,22,33);
        expect(argsToAdvice).toEqual([11,22,33]);
      });
      
      it('provides the arguments to the target function', function() {
        Aop.before('targetFn',function() {},targetObj);
        targetObj.targetFn('a','b');
        expect(argsToTarget).toEqual(['a','b']);
      });
      
      it('can chain, with the last one set up executing first', function() {
        var adviceFactory = function(adviceID) {
          return (function() {
            executionPoints.push(adviceID);
          });
        };
        Aop.before('targetFn',adviceFactory('inner'),targetObj);
        Aop.before('targetFn',adviceFactory('outer'),targetObj);
        targetObj.targetFn();
        expect(executionPoints).toEqual(['outer','inner','targetFn']);
      });
      
      it("causes a call to the target to return its normal value", function() {
        Aop.before('targetFn',function() {}, targetObj);
        expect(targetObj.targetFn()).toEqual(targetFnReturn);
      });
      
      it('executes the advice in the context of the target', function() {
        var advice = function() {
          expect(this).toBe(targetObj);
        };
        Aop.before('targetFn',advice, targetObj);
        targetObj.targetFn();
      });
    });
    
    describe('when advice throws', function() {
      var badAdvice = function() {
        executionPoints.push('badAdvice');
        throw new Error('Failed!');
      };
      var goodAdvice = function() {
        executionPoints.push('goodAdvice');
      };
      var expectJustBadAdvice = function() {
        try {
          targetObj.targetFn();
        }
        catch (e){
        }
        expect(executionPoints).toEqual(['badAdvice']);
      };
      it('does not execute the next advice', function() {
        Aop.before('targetFn',goodAdvice,targetObj);
        Aop.before('targetFn',badAdvice,targetObj);
        expectJustBadAdvice();
      });
      it('does not execute the target', function() {
        Aop.before('targetFn',badAdvice,targetObj);
        expectJustBadAdvice();
      });      
    });

  });
  
  describe('Aop.after(fnName, advice, targetObj)', function () {
    
    describe('when target has succeeded', function() {
      it('executes after the target', function() {
        var advice = function() {
           executionPoints.push('advice');
        };
        Aop.after('targetFn',advice,targetObj);
        targetObj.targetFn();
        expect(executionPoints).toEqual(['targetFn','advice']);        
      });
      it("executes with the target's arguments", function() {
        var argsToAdvice;
        var advice = function() {
          argsToAdvice = Array.prototype.slice.call(arguments,0);
        };
        Aop.after('targetFn',advice,targetObj);
        targetObj.targetFn(11,22,33);
        expect(argsToAdvice).toEqual([11,22,33]);
      });
      it('executes in the context of the target', function() {
        var advice = function() {
          expect(this).toBe(targetObj);
        };
        Aop.after('targetFn',advice, targetObj);
        targetObj.targetFn();        
      });
      it('returns the return value of the target', function() {
        Aop.after('targetFn',function() {}, targetObj);
        expect(targetObj.targetFn()).toEqual(targetFnReturn);        
      });
      it('can chain, with the first one set up executing first', function() {
        var adviceFactory = function(adviceID) {
          return (function() {
            executionPoints.push(adviceID);
          });
        };
        Aop.after('targetFn',adviceFactory('first'),targetObj);
        Aop.after('targetFn',adviceFactory('second'),targetObj);
        targetObj.targetFn();
        expect(executionPoints).toEqual(['targetFn','first','second']);        
      });
    });
    
    describe('when target has thrown an exception', function() {
      it('does not execute', function() {
        var executedAdvice = false,
        badTarget = {
          badFn : function () {
            throw new Error('Oops!');
          }
        },
        advice = function() {
          executedAdvice = true;
        };
        
        Aop.after('badFn', advice, badTarget);

        try
        {
          badTarget.badFn(); // The test passes if this doesn't throw.
        }
        catch (e) {} 
        expect(executedAdvice).toBe(false);
      });
    });
  });
});