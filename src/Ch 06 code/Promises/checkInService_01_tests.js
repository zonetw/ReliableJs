describe('Conference.checkInService', function(){
  'use strict';
  
  var checkInService,
      checkInRecorder,
      attendee;

  beforeEach(function(){
    checkInRecorder = Conference.checkInRecorder();
    checkInService = Conference.checkInService(checkInRecorder);
    attendee = Conference.attendee('Sam', 'Wells');
  });
  
  describe('checkInService.checkIn(attendee)', function(){
    
    describe('when checkInRecorder succeeds ', function() {
      var checkInNumber = 1234;
      beforeEach(function() {
        spyOn(checkInRecorder,'recordCheckIn').and.callFake(function() {
          return Promise.resolve(checkInNumber);
        }); 
      });
      
      // Same tests as in Chapter 5
      it('marks the attendee checked in', function() {
        checkInService.checkIn(attendee);
        expect(attendee.isCheckedIn()).toBe(true);
      });
      it('records the check-in', function() {
        checkInService.checkIn(attendee);
        expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
      });
      
      // New test for Chapter 6
      it("sets the attendee's checkInNumber", function(done) {
        checkInService.checkIn(attendee);
        expect(attendee.getCheckInNumber()).toBe(checkInNumber);
      });
    });
  });
});