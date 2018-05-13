describe("Conference.polyfills", function(){
  'use strict';
  
  describe("arrayForEach(callbackFcn[, thisObj])", function(){    
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
    
    describe("without thisObj", function(){
      
      it("executes callbackFcn with an undefined context", function(){
        var helper = {
          expectThisToBeWindow : function(){
            expect(this).toBe(window);
          }
        };
        
        // spy on the helper so we can ensure it was called
        spyOn(helper, "expectThisToBeWindow").and.callThrough();
        
        // execute on a single element array
        [1].forEach(helper.expectThisToBeWindow);
        
        expect(helper.expectThisToBeWindow).toHaveBeenCalled();
      });
    });
  });
  
});