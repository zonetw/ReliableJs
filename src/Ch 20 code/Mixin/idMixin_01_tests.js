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
    });
  });
});