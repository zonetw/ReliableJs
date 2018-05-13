var Aspects = Aspects || {};

Aspects.returnValueCache = function(sharedCache){
 "use strict";
 
 var cache = sharedCache || Conference.simpleCache();
 
 return {

   advice: function(targetInfo){

     // use the arguments provided to the function as the cache key
     if(cache.hasKey(targetInfo.args)){
       return cache.getValue(targetInfo.args);
     }
     
     // retrieve and execute the decorated fcn, storing its
     // return value in the cache
     var returnValue = Aop.next(targetInfo);
     cache.setValue(targetInfo.args, returnValue);
     return returnValue;
   }
 };
};