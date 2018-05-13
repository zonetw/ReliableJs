var Aspects = Aspects || {};

Aspects.returnValueCache = function(){
  'use strict';
  
  var cache = {};

  return {
    advice: function(targetInfo){

      // use the arguments provided to the function as the cache key
      // (convert to a string so that string comparison, rather than
      // object reference comparison, can be used)
      var cacheKey = JSON.stringify(targetInfo.args);
     
      if(cache.hasOwnProperty(cacheKey)){
        return cache[cacheKey];
      }
     
      // retrieve and execute the decorated fcn, storing its
      // return value in the cache
      var returnValue = Aop.next(targetInfo);
      cache[cacheKey] = returnValue;
      return returnValue;
    }
  };
};