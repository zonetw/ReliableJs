describe('fakeAttendeeWebApi', function() {
  'use strict';
  
  var webApi,
      attendeeA,
      attendeeB;
  beforeEach(function() {
    webApi = Conference.fakeAttendeeWebApi();
    attendeeA = Conference.attendee('Mariano','Tezanos');
    attendeeB = Conference.attendee('Gregorio ','Perez');
  });
  describe('post(attendee)', function() {
    it('if successful, resolves to an attendee with an ID',
    function(done/*See Chapter 6*/) {
      webApi.post(attendeeA).then(
        function promiseResolved(attendee) {
          expect(attendee.getId()).not.toBeUndefined();
          done();
        },
        function promiseRejected() {
          expect('Promise rejected').toBe(false);
          done();
        });
    });
  });
  
  describe('getAll()', function () {
    it('returns a resolved promise for all attendees posted'
    +' if you wait for their promises to resolve', function (done) {
      webApi.post(attendeeA)
      .then(function() {
        return webApi.post(attendeeB);
      })
      .then(function() {
        return webApi.getAll();
      })
      .then(
        function promiseResolved(attendees) {
          expect(attendees[0].getFullName()).toEqual(attendeeA.getFullName());
          expect(attendees[1].getFullName()).toEqual(attendeeB.getFullName());
          done();
        },
        function promiseRejected() {
          expect('Promise rejected').toBe(false);
          done();
        });
    });
    it('does not include attendees whose posts are not resolved',
    function(done) {
      webApi.post(attendeeA);
      webApi.post(attendeeB);
      webApi.getAll().then(
        function promiseResolved(attendees) {
          expect(attendees.length).toBe(0);
          done();
        },
        function promiseRejected() {
          expect('Promise rejected').toBe(false);
          done();
        });
    });
  });
});