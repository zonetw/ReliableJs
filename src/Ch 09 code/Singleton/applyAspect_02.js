// Apply memoization to getRestaurantsWithinRadius

Aop.around(
  'restaurantApi',
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo){
    
    // Original API returned from ThirdParty.restaurantApi().
    var api =  Aop.next.call(this, targetInfo);
    
    // Retrieve the singleton cache instance
    var cache = Conference.caches.RestaurantsWithinRadiusCache.getInstance();
    
    // decorate the getRestaurantsWithinRadius function to add
    // memoization (with a shared cache) to it
    Aop.around('getRestaurantsWithinRadius',
      Aspects.returnValueCache(cache).advice, api);
        
    // Return the revised API.
    return api;
  },
  ThirdParty
);