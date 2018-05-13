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
        spyOn(checkInRecorder,'recordCheckIn').and.returnValue(
          Promise.resolve(checkInNumber));
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
        checkInService.checkIn(attendee).then(
          function promiseResolved() {
            expect(attendee.getCheckInNumber()).toBe(checkInNumber);
            done();
          },
          function promiseRejected() {
            expect('This failure branch was executed').toBe(false);
            done();
          });
        });
      });

    describe('when checkInRecorder fails', function() {
      var recorderError = 'Check-in recording failed!';
      beforeEach(function() {
        spyOn(checkInRecorder,'recordCheckIn').and.returnValue(
          Promise.reject(new Error(recorderError)));
        spyOn(attendee,'undoCheckIn');
      }); 

      it("returns a Promise rejected with the expected reason", function(done) {
        checkInService.checkIn(attendee).then(
          function promiseResolved() {
            expect('This success function to execute').toBe(false);
            done();
          },
          function promiseRejected(reason) {
            expect(reason.message).toBe(recorderError);
            done();
          });
      });
      
      it("undoes the attendee's checkin", function(done) {
        checkInService.checkIn(attendee).then(
          function promiseResolved() {
            expect('This success function to execute').toBe(false);
            done();
          },
          function promiseRejected(reason) {
            expect(attendee.undoCheckIn).toHaveBeenCalled();
            done();
          });
      });
    });
  });
});
      
      
