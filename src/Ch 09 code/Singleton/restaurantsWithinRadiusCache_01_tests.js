describe('Conference.caches.RestaurantsWithinRadiusCache', function(){
  "use strict";

  describe('getInstance', function(){
    it('always returns the same instance', function(){
      
      // ensure that .getInstance returns the same object
      // (.toBe uses reference equality)
      expect(Conference.caches.RestaurantsWithinRadiusCache.getInstance())
        .toBe(Conference.caches.RestaurantsWithinRadiusCache.getInstance());
    });
  });
});