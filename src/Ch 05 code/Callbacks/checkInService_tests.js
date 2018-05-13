describe('Conference.checkInService', function(){
  'use strict';
  
  var checkInService,
      checkInRecorder,
      attendee;
      
  beforeEach(function(){
    checkInRecorder = Conference.checkInRecorder();
    spyOn(checkInRecorder, 'recordCheckIn');
    
    // Inject the checkInRecorder, with the spy configured on
    // its recordCheckIn function
    checkInService = Conference.checkInService(checkInRecorder);
    
    attendee = Conference.attendee('Sam', 'Wells');
  });
  
  describe('checkInService.checkIn(attendee)', function(){
    it('marks the attendee checked in', function(){
      checkInService.checkIn(attendee);
      expect(attendee.isCheckedIn()).toBe(true);
    });
    it('records the check-in', function(){
      checkInService.checkIn(attendee);
      expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
    });
  });
});