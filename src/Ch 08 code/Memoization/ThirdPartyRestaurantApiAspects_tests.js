describe('ThirdParty.restaurantApi() aspects', function() {
  'use strict';
  
  var api = ThirdParty.restaurantApi();

  describe('added member getRestaurantsNearConference(cuisine)', function() {
    var returnFromUnderlyingFunction = 'something',
        cuisine = 'Vegan';
    beforeEach(function() {
      spyOn(api,'getRestaurantsWithinRadius')
        .and.returnValue(returnFromUnderlyingFunction);
    });
    
    it('calls getRestaurantsWithinRadius with the correct args', function() {
      api.getRestaurantsNearConference(cuisine);
      expect(api.getRestaurantsWithinRadius).toHaveBeenCalledWith(
        '415 Summer St, Boston, MA 02210',2.0,cuisine);
    });
    
    it('returns the value from getRestaurantsWithinRadius', function() {
      var ret = api.getRestaurantsNearConference(cuisine);
      expect(ret).toBe(returnFromUnderlyingFunction);
    });
  });
});