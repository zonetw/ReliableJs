// Add member getRestaurantsNearConference to ThirdParty.restaurantApi().

Aop.around(
  // Function whose return value should be modified.
  'restaurantApi', 
  
  // Function that modifies the return value
  function addGetRestaurantsNearConference(targetInfo){
    'use strict';
    
    // Original API returned from ThirdParty.restaurantApi().
    var api =  Aop.next.call(this,targetInfo);
    
    // Function that will be added to the API
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