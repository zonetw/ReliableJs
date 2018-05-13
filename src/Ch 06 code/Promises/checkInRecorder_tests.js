describe('Conference.checkInRecorder', function() {
  'use strict';
  
  var attendee, checkInRecorder;
  beforeEach(function() {
    attendee = Conference.attendee('Tom','Jones');
    attendee.setId(777)
    checkInRecorder = Conference.checkInRecorder();
    
    // Install Jasmine's XMLHttpRequest-mocking library
    jasmine.Ajax.install();
  });
  
  afterEach(function() {
    // Let normal XMLHttpRequests take place when done.
    jasmine.Ajax.uninstall();
  });
  
  describe('recordCheckIn(attendee)', function() {
    
    it('returns a Promise fulfilled with a checkInNumber ' +
       'if attendee is checked in '+
       'and the HTTP request succeeds', function() {
      var expectedCheckInNumber = 1234,
          request;
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect(actualCheckInNumber).toBe(expectedCheckInNumber);
          done();        },
        function promiseRejected() {
          expect('The promise was rejected').toBe(false);
        });
       request = jasmine.Ajax.requests.mostRecent();
       expect(request.url).toBe('/checkin/' + attendee.getId());
       request.response({
         "status": 200,
         "contentType": "text/plain",
         "responseText": expectedCheckInNumber
       });
    });
    
    it('returns a Promise rejected with the correct message ' +
       'if attendee is checked in '+
       'and the HTTP request fails', function() {
      var request;
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect('The promise was resolved').toBe(false);
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().httpFailure);
        });
       request = jasmine.Ajax.requests.mostRecent();
       expect(request.url).toBe('/checkin/' + attendee.getId());
       request.response({
         "status": 404,
         "contentType": "text/plain",
         "responseText": "Some error message."
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
