var Conference = Conference || {};
Conference.caches = Conference.caches || {};

// Create a simpleCache (singleton) to use as a cache
// for the restaurantApi.getRestaurantsWithinRadius function
Conference.caches.RestaurantsWithinRadiusCache = (function(){
  "use strict";
  
  var instance = null;
  
  return {
    getInstance: function(){
      if(instance === null){
        instance = Conference.simpleCache();
      }
      return instance;
    }
  };
})();