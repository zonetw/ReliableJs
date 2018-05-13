var ReliableJavaScript = ReliableJavaScript || {};
ReliableJavaScript.extend = function(target, mixin){
  'use strict';
  
  if(!target || typeof(target) !== "object"){
    throw new Error(ReliableJavaScript.extend.messages.targetNotObject);
  }
  
  if(!mixin || typeof(mixin) !== "object"){
    throw new Error(ReliableJavaScript.extend.messages.mixinNotObject);
  }
  
  for(var item in mixin){
    if(mixin.hasOwnProperty(item)){
      if(!(item in target)){
        target[item] = mixin[item];
      } else {
        throw new 
          Error(ReliableJavaScript.extend.messages.triedToReplace + item);
      }
    }
  }
};
ReliableJavaScript.extend.messages = {
  targetNotObject: "target is not an object",
  mixinNotObject: "mixin is not an object",
  triedToReplace: "mixin attempted to replace the existing property: "
};