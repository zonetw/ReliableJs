// Apply memoization to getRestaurantsWithinRadius

Aop.around(
  // Function whose return value should be modified.
  'restaurantApi', 
  
  // Function that modifies the return value
  function addMemoizationToGetRestaurantsWithinRadius(targetInfo){
    
    // Original API returned from ThirdParty.restaurantApi().
    var api =  Aop.next.call(this, targetInfo);
    
    // decorate the getRestaurantsWithinRadius function to add
    // memoization to it
    Aop.around('getRestaurantsWithinRadius',
      Aspects.returnValueCache().advice, api);
        
    // Return the revised API.
    return api;
  },
  
  // Namespace of the function whose return value should be modified
  ThirdParty
);

// Add member getRestaurantsNearConference to ThirdParty.restaurantApi().

Aop.around(
  // Function whose return value should be modified.
  'restaurantApi', 
  
  // Function that modifies the return value
  function addGetRestaurantsNearConference(targetInfo){
    
    // Original API returned from ThirdParty.restaurantApi().
    var api =  Aop.next.call(this, targetInfo);
    
    // Function to add to the API
    function getRestaurantsNearConference(cuisine) {
      return api.getRestaurantsWithinRadius(
        '415 Summer St, Boston, MA 02210', 2.0, cuisine);
    }
    
    // Add the function if it's not already there.
    api.getRestaurantsNearConference = 
      api.getRestaurantsNearConference || getRestaurantsNearConference;
      
    // Return the revised API.
    return api;
  },
  
  // Namespace of the function whose return value should be modified
  ThirdParty
);