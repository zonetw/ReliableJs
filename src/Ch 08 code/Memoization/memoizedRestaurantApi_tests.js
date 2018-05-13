describe('memoizedRestaurantsApi', function(){
  'use strict';

  var api,
      service,
      returnedFromService;
        
  beforeEach(function(){
    api = ThirdParty.restaurantApi();
    service = Conference.memoizedRestaurantApi(api);
    returnedFromService = {};
  });
  
  describe('getRestaurantsNearConference(cuisine)', function(){
    
    it('invokes the api\'s getRestaurantsNearConference with the expected '+
    'argument', function(){
      var cuisine = "BBQ";
      spyOn(api, 'getRestaurantsNearConference');
      service.getRestaurantsNearConference(cuisine);
      
      var args = api.getRestaurantsNearConference.calls.argsFor(0);
      expect(args[0]).toEqual(cuisine);
    });
    
    it('returns the value returned by the 3rd-party API', function(){
      spyOn(api, 'getRestaurantsNearConference')
        .and.returnValue(returnedFromService);
      var value = service.getRestaurantsNearConference("Asian Fusion");
      expect(value).toBe(returnedFromService);
    });
    
    it('makes one api request when the same cuisine is requested ' +
    'multiple times', function(){
      var cuisine = "BBQ";
      
      spyOn(api, 'getRestaurantsNearConference')
        .and.returnValue(returnedFromService);
      
      var iterations = 5;
      for(var i = 0; i < iterations; i++){
        var value = service.getRestaurantsNearConference(cuisine);
      }
      
      expect(api.getRestaurantsNearConference.calls.count()).toBe(1);
    });
    
    it('resolves to the same value when same cuisine is requested ' +
    'multiple times', function(){
      var cuisine = "American";
       
      
      spyOn(api, 'getRestaurantsNearConference')
        .and.returnValue(returnedFromService);
      
      var iterations = 5;
      for(var i = 0; i < iterations; i++){
        var value = service.getRestaurantsNearConference(cuisine);
        expect(value).toBe(returnedFromService);
      }
    });
  });
});