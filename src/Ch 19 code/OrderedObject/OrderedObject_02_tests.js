describe('OrderedObject', function() { 
  'use strict';
  var orderedObject,
      result;
      
  function processKey(key, value) {
    if (typeof value !== 'function' ) {
      result = result * 100 + value;
    }
  }
  
  beforeEach(function() {
    orderedObject = new Conference.OrderedObject();
    result = 0;
  });
  
  describe('forEachKey(callbackFcn)', function() {
    
    it('calls the callback for each key in the object, in order', function() {
      orderedObject.c = 11;
      orderedObject.a = 22;
      orderedObject.b = 33;
      orderedObject.forEachKey(processKey);
      expect(result).toBe(223311);
    });
    
    it('can be borrowed', function() {
      var borrower = { c:11, a:22, b:33 };
      ReliableJavaScript.utilities.borrow(
        borrower, Conference.OrderedObject.prototype, 'forEachKey');
      borrower.forEachKey(processKey);
      expect(result).toBe(223311);
    });
  });
  
  describe('trackedForEachKey(callbackFcn)', function() {
    
    beforeEach(function() {
      orderedObject.c = 11;
      orderedObject.a = 22;
      orderedObject.b = 33;
    });
    
    describe('in original object', function() {
      
      it('calls the callback for each key in the object, in order', function(){
        orderedObject.trackedForEachKey(processKey); 
        expect(result).toBe(223311); 
      });
      
      it('tracks how many times each property was visited', function() {
        var times = 2;
        for (var ix=0; ix<times; ++ix) {
          orderedObject.trackedForEachKey(processKey); 
        }
        expect(orderedObject.getIterationCount('a')).toBe(times);
        expect(orderedObject.getIterationCount('b')).toBe(times);
        expect(orderedObject.getIterationCount('c')).toBe(times);
      });
    });
  });
});