describe("ReliableJavaScript.extend(target, mixin)", function(){
  'use strict';
  
  var notObjects = ["", null, undefined, 1];
  
  it("throws if the target argument is not an object", function(){
    notObjects.forEach(function(notObj){
      expect(function shouldThrow(){
        ReliableJavaScript.extend(notObj, {});
      }).toThrowError(ReliableJavaScript.extend.messages.targetNotObject);
    }); 
  });
  
  it("throws if the mixin argument is not an object", function(){
    notObjects.forEach(function(notObj){
      expect(function shouldThrow(){
        ReliableJavaScript.extend({}, notObj);
      }).toThrowError(ReliableJavaScript.extend.messages.mixinNotObject);
    }); 
  });
});