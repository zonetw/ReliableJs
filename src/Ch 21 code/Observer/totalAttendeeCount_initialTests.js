describe("Conference.totalAttendeeCount", function(){
  'use strict';
  
  var recentRegistrations;
  
  beforeEach(function(){
    recentRegistrations = Conference.recentRegistrationsService();
    // we don't want the service polling; immediately stop it.
    recentRegistrations.stopPolling();
  });
  
  it("adds itself as an observer to the recentRegistrationsService", function(){
    spyOn(recentRegistrations, "addObserver");
    var countDisplay = Conference.totalAttendeeCount(0, recentRegistrations);
    expect(recentRegistrations.addObserver).toHaveBeenCalledWith(countDisplay);
  });
  
  describe("getCount()", function(){
    it("returns the initial count if update() has not been called", function(){
      var countDisplay = Conference.totalAttendeeCount(0, recentRegistrations);
      expect(countDisplay.getCount()).toEqual(0);
    });
  });
  
  describe("update(newAttendee)", function(){
    it("increments the count of attendees", function(){
      var initialCount = 0,
          countDisplay = Conference.totalAttendeeCount(initialCount,
            recentRegistrations);
      countDisplay.update(Conference.attendee("Tom", "Kasansky"));
      expect(countDisplay.getCount()).toEqual(initialCount + 1);
    });
  });
});