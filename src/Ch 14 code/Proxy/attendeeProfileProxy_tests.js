describe('attendeeProfileProxy(attendees, profileService,prefetchLimit)', 
function() {
  'use strict';
  var proxy = Conference.attendeeProfileProxy,
      profileService = Conference.attendeeProfileService(),
      attendees = [
        { attendeeId: 10, profileViews: "3" },
        { attendeeId: 11, profileViews: "0" },
        { attendeeId: 12 },
        { attendeeId: 13, profileViews: "3" },
        { attendeeId: 14, profileViews: "10"},
        { attendeeId: 15, profileViews: "2" },
        { attendeeId: 16, profileViews: "1" },
        ],
      spyOnProfileService;
      
  function makeServiceReturn(attendeeId) {
    return "Pretend this is the service's return value for attendeeId "
          + attendeeId;
  }
  
  beforeEach(function() {
    spyOnProfileService = spyOn(profileService,'getProfile')
      .and.callFake(function(attendeeId) {
        return makeServiceReturn(attendeeId);
      });
  });
  
  describe('initialization', function () {
    it('pre-fetches no profiles if prefetchLimit is not a positive number',
    function() {
      var notPositiveNumbers = [-1,0,undefined,'abc',function() {}];
      notPositiveNumbers.forEach(function(prefetchLimit) {
        proxy(attendees, profileService, prefetchLimit);
      });
      expect(spyOnProfileService.calls.count()).toBe(0);
    });
    it('pre-fetches all the profiles if prefetchLimit exceeds ' +
    'the number of attendees', function() {
      proxy(attendees, profileService, attendees.length+1);
      expect(spyOnProfileService.calls.count()).toBe(attendees.length);
    });
    it("pre-fetches the 'prefetchLimit' most popular profiles", function() {
      var prefetchLimit = 3;
      proxy(attendees, profileService, prefetchLimit);
      expect(spyOnProfileService.calls.count()).toBe(prefetchLimit);
      expect(spyOnProfileService).toHaveBeenCalledWith(14);
      expect(spyOnProfileService).toHaveBeenCalledWith(10);
      expect(spyOnProfileService).toHaveBeenCalledWith(13);
    });
  });
  
  describe('getProfile(attendeeId)', function() {
    var prefetchLimit = 3,
        proxyInstance;
        
    beforeEach(function() {
      proxyInstance = proxy(attendees, profileService, prefetchLimit);
    });
    
    it('returns a pre-fetched profile when it is requested',function() {
      var attendeeId = 13,
          profile = proxyInstance.getProfile(attendeeId);
      expect(profile).toBe(makeServiceReturn(attendeeId));
      expect(spyOnProfileService.calls.count()).toBe(prefetchLimit);
    });
    it('returns a non-pre-fetched profile when requested', function() {
      var attendeeId = 11,
          profile = proxyInstance.getProfile(attendeeId);
      expect(profile).toBe(makeServiceReturn(attendeeId));
      expect(spyOnProfileService.calls.count()).toBe(prefetchLimit+1);
    });
  });
});