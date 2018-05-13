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
      var targetInstance = new Target();
      var spyOnInstance = spyOn(targetInstance,'targetFn').and.callThrough();
      Aop.around('targetFn',argPassingAdvice,targetInstance);
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
});