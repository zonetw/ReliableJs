describe('forEach(callbackFcn, thisObj)',function() {
  'use strict';
  it('throws if not called from an object with a numeric length property',
  function(){
    var ix,
        obj,
        withNoGoodLength = [
          { a: 1 }, {length: "not a number"},
          {length: Infinity}, {length: -1}, {length: 1.5 }
        ];
      
    function expectThrow(obj) {
      expect(function() {
        obj.forEach(function() {/* do nothing*/});
      }).toThrow();
    }
    
    for (ix=0; ix<withNoGoodLength.length; ++ix) {
      obj = withNoGoodLength[ix];
      
      // Borrow the polyfill.
      obj.forEach = Conference.polyfills.arrayForEach;
      
      // Expect it not to work.
      expectThrow(obj);
    }
  });
});