describe("Conference.mixins", function(){
  'use strict';
  
  var target;
  
  describe("addId()", function(){
    beforeEach(function(){
      target = {};
    });
    
    it("throws if target.getId already exists", function(){
      target.getId = function getId(){ };
      expect(function shouldThrow(){
        Conference.mixins.addId.call(target);
      }).toThrowError(
        Conference.mixins.addId.messages.triedToReplace + "getId"
      );
    });
    
    it("throws if target.setId already exists", function(){
      target.setId = function setId(){ };
      expect(function shouldThrow(){
        Conference.mixins.addId.call(target);
      })
      .toThrowError(
        Conference.mixins.addId.messages.triedToReplace + "setId"
      );
    });
    
    describe("when mixed in to a single object", function(){
      beforeEach(function(){
        // execute addId with this bound to target
        Conference.mixins.addId.call(target);
      });
    
      it("adds the expected properties to the target", function(){
        expect(Object.keys(target).sort()).toEqual(["getId", "setId"]);
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