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
  });
});