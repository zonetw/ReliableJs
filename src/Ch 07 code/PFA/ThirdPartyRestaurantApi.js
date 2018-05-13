// API provided by 3rd Party

var ThirdParty = ThirdParty || {};
ThirdParty.restaurantApi = function(){
  'use strict';
  
  return {
    // Returns a Promise to return an array of restaurants serving the 
    // specified cuisine within radiusMiles of the provided address
    getRestaurantsWithinRadius: function(address, radiusMiles, cuisine){
      // Promise resolves to an array of objects that look like:
      // {
      //   name: "Bill's Burgers",
      //   address: "123 Main St, AnyTown, 44444"
      // }
    }
  }; 
};
