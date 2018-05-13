describe('returnValueSimpleCache', function(){
  "use strict";
  
  var testObject,
      testValue,
      args,
      spyReference;
  
  // Helper function to create a test object.  Includes adding the spy to
  // testFunction, and storing a reference to the spy in the spyReference 
  // property of the returned object.
  function createATestObject(){
    var obj = {
      testFunction : function(arg){
        return testValue;
      }
    };
    spyOn(obj, 'testFunction').and.callThrough();
    
    // Hold on to a reference to the spy, since it won't be directly accessible
    // once the aspect has been applied to it.
    obj.spyReference = obj.testFunction;
    
    return obj;
  }
    
  beforeEach(function(){
    testObject = createATestObject();
    
    // Decorate the testObject.testFunction with the returnValueSimpleCache aspect
    Aop.around('testFunction', 
      Aspects.returnValueCache().advice, testObject);
    
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
      expect(testObject.spyReference.calls.count()).toBe(1);
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
        expect(testObject.spyReference.calls.count()).toBe(keyValues.length);
    });
    
    it('may share an injected cache between instances', function(){
      // Create a simpleCache shared cache object
      var sharedCache = Conference.simpleCache(),
          object1 = createATestObject(),
          object2 = createATestObject();
          
      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice,
        object1);
      
      Aop.around('testFunction', 
        new Aspects.returnValueCache(sharedCache).advice,
        object2);
        
      object1.testFunction(args);
      
      // Call to object2's testFunction should make use of the cached result
      // of the call to object1's testFunction.
      expect(object2.testFunction(args)).toBe(testValue);
      
      // Thus, object2's testFunction should not be executed
      expect(object2.spyReference.calls.count()).toBe(0);
    });
  });
});