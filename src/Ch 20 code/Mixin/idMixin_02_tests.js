describe("Conference.mixins", function(){
  'use strict';
  
  var target,
      mixin;
  
  describe("idMixin()", function(){
    beforeEach(function(){
      target = {};
      mixin = Conference.mixins.idMixin();
      
      ReliableJavaScript.extend(target, mixin);
    });
    
    describe("when mixed in", function(){
      it("adds the expected properties to the target", function(){
        expect(Object.keys(target).sort()).toEqual(["getId", "id", "setId"]);
      });
      
      describe("getId() & setId(idValue)", function(){
        it("getId() returns undefined if setId(idValue) hasn't been called", 
        function(){
          expect(target.getId()).toBe(undefined);
        });
        
        it("getId() returns the value set by setId(idValue)", 
        function(){
          var id = "theId";
          target.setId(id);
          expect(target.getId()).toEqual(id);
        });
      });
    });
  });
});