describe('attendeeWebApiDecorator', function() {
  'use strict';
  
  var decoratedWebApi,
      baseWebApi,
      attendeeA,
      underlyingFailure = 'Failure in underlying function';
  
  beforeEach(function() {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decoratedWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
    attendeeA = Conference.attendee('Mariano','Tezanos');
  });
  
  describe('post(attendee)', function() {

    describe('on failure of the underlying post', function() {
      beforeEach(function() {
        // Cause the base's post to fail, but not until the next turn.
       spyOn(baseWebApi,'post').and.returnValue(
        new Promise( function(resolve,reject) {
          setTimeout(function() {
            reject(underlyingFailure);
          },5);
        }));       
      });
      it('returns a Promise rejected with the underlying reason',function(done) {
        decoratedWebApi.post(attendeeA).then(
          function onSuccessfulPost() {
            expect('Post succeeded').toBe(false);
            done();
          },
          function onRejectedPost(reason) {
            expect(reason).toBe(underlyingFailure);
            done();
          });
      });
    });
    describe('when called for an attendee just posted', function() {
      it('returns a rejected promise',function(done) {
        decoratedWebApi.post(attendeeA);
        decoratedWebApi.post(attendeeA).then(
          function onSuccess() {
            expect('Post succeeded').toBe(false);
            done();
          },
          function onFailure(error) {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe(
              decoratedWebApi.getMessages().postPending);
            done();
          });
      });
    }); 
  });
  
  describe('getAll()', function() {

    describe('on failure of underlying getAll', function() {
      it('returns the underlying rejected Promise', function(done) {
        spyOn(baseWebApi,'getAll').and.returnValue(
          new Promise( function(resolve,reject) {
            setTimeout(function() {
              reject(underlyingFailure);
            },1);
          }));  
        decoratedWebApi.getAll().then(
          function onSuccess() {
            expect('Underlying getAll succeeded').toBe(false);
            done();
          },
          function onFailure(reason) {
            expect(reason).toBe(underlyingFailure);
            done();
          });
      });
    });
  });
});