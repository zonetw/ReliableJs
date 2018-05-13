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
      
  beforeEach(function() {
    spyOnProfileService = spyOn(profileService,'getProfile');
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
  });
});