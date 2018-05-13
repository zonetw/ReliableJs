describe("Conference.polyfills", function(){
  describe("arrayForEach(callbackFcn[, thisObj])", function(){
    'use strict';
    
    var originalForEach;
    
    beforeEach(function(){
      // retain a reference to the original forEach implementation
      originalForEach = Array.prototype.forEach;
      
      // replace the original forEach implementation (if any) with the
      // polyfill being tested
      Array.prototype.forEach = Conference.polyfills.arrayForEach;
    });
    
    afterEach(function(){
      // restore the original forEach
      Array.prototype.forEach = originalForEach;
    });
    
    it("throws if callbackFcn is not a function", function(){
      
      var i,
          nonFunction = [
            undefined,
            "",
            {}
          ];
      
      // it's tempting to use Array.prototype.forEach here!
      for(i = 0; i < nonFunction.length; i++){
        expect(function(){
          [].forEach(nonFunction[i]);
        }).toThrowError(nonFunction[i] + " is not a function");
      }
    });
  });
});