describe('Conference.checkInRecorder', function() {
  'use strict';
  
  var attendee, checkInRecorder;
  beforeEach(function() {
    attendee = Conference.attendee('Tom','Jones');
    checkInRecorder = Conference.checkInRecorder();
  });
  
  describe('recordCheckIn(attendee)', function() {
    
    it('returns a Promise fulfilled with a checkInNumber ' +
       'if attendee is checked in', function(done) {
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect(typeof actualCheckInNumber).toBe('number');
          done();
        },
        function promiseRejected() {
          expect('The promise was rejected').toBe(false);
          done();
        });
    });
    
    it('returns a Promise rejected with an Error ' +
       'if attendee is not checked in', function(done) {
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved() {
          expect('The promise was resolved').toBe(false);
          done();
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().mustBeCheckedIn);
          done();
        });
    });
  });
});
