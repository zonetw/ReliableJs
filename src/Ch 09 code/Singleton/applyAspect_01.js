var Conference = Conference || {};
Conference.caches = Conference.caches || {};

// Create an object literal (singleton) to use as a cache
// for the restaurantApi.getRestaurantsWithinRadius function
Conference.caches.restaurantsWithinRadiusCache = {};

// Apply memoization to getRestaurantsWithinRadius

Aop.around(
  'restaurantApi',
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo){
    
    // Original API returned from ThirdParty.restaurantApi().
    var api =  Aop.next.call(this, targetInfo);
    
    // decorate the getRestaurantsWithinRadius function to add
    // memoization (with a shared cache) to it
    Aop.around('getRestaurantsWithinRadius',
      Aspects
      .returnValueCache(Conference.caches.restaurantsWithinRadiusCache).advice, 
        api);
        
    // Return the revised API.
    return api;
  },
  ThirdParty
);
