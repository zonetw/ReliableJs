describe('Aop', function() {
  describe('Aop.around(fnName, advice, targetObj)', function() {
    it('causes a call to the target function to execute the advice', function() {
      var targetObj = {
        targetFn: function () {
        }
      };
      var executedAdvice = false;
      var advice = function() {
        executedAdvice = true;
      };
      Aop.around('targetFn', advice, targetObj);
      targetObj.targetFn();
      expect(executedAdvice).toBe(true);
    });
  });
});