describe('returnValueCache', function(){
  'use strict';

  var testObject,
      testValue,
      args,
      spyReference,
      testFunctionExecutionCount;
    
  beforeEach(function(){
    // reset the execution count before each test
    testFunctionExecutionCount = 0;
    testValue = {};
    testObject = {
      testFunction:function(arg){
        return testValue;   
      }
    };
    
    spyOn(testObject, 'testFunction').and.callThrough();
    
    // Hold on to a reference to the spy, since it won't be directly accessible
    // once the aspect has been applied to it.
    spyReference = testObject.testFunction;
    
    // Decorate the testObject.testFunction with the returnValueCache aspect
    Aop.around('testFunction', Aspects.returnValueCache().advice, testObject);
    
    args = [{key:"value"}, "someValue"];
  });
  
  describe('advice(targetInfo)', function(){
    it('returns the value returned by the decorated function on 1st execution',  
    function(){
      var value = testObject.testFunction.apply(testObject, args);
      expect(value).toBe(testValue);
    });
    
    it('returns the value returned by the decorated function when executed ' + 
    'multiple times', function(){
      var iterations = 3;
      
      for(var i = 0; i < iterations; i++){
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
    });
    
    it('only executes the decorated function once when executed ' +
    'multiple times with the same key value', function(){
      var iterations = 3;
      
      for(var i = 0; i < iterations; i++){
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
      expect(spyReference.calls.count()).toBe(1);
    });
    
    it('executes the decorated function once for each unique key value',
    function(){
        var keyValues = ["value1", "value2", "value3"];
            
        keyValues.forEach(function iterator(arg){
          var value = testObject.testFunction(arg);
        });
        
        // Execute each request again; results should be loaded
        // from cache, thus not executing the decorated function
        keyValues.forEach(function iterator(arg){
          var value = testObject.testFunction(arg);
        });
        
        // Decorated function should be executed only once per unique value
        expect(spyReference.calls.count()).toBe(keyValues.length);
    });
    
    // Additional tests that verify cache keys are calculated correctly, etc.
  });
});