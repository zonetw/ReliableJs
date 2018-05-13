describe('Aop', function() {
  var targetObj, 
      executionPoints;  // An array of execution events  
      
  beforeEach(function() {
    targetObj = {
      targetFn: function() {
        executionPoints.push('targetFn');
      }
    };
    executionPoints = [];
  });
  
  describe('Aop.around(fnName, advice, targetObj)', function() {

    it('causes a call to the target function to execute the advice', function() {
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
  });
});