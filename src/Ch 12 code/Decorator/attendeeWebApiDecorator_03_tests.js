describe('attendeeWebApiDecorator', function() {
  'use strict';
  
  var decoratedWebApi,
      baseWebApi,
      attendeeA,
      attendeeB,
      underlyingFailure = 'Failure in underlying function';
  
  beforeEach(function() {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decoratedWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
    attendeeA = Conference.attendee('Mariano','Tezanos');
    attendeeB = Conference.attendee('Gregorio','Perez');
  });
  
  describe('post(attendee)', function() {
    
    describe('on success of the underlying post', function() {
      it('returns a Promise that resolves to an attendee with ID', 
      function(done) {
        decoratedWebApi.post(attendeeA).then(
          function onSuccess(attendee) {
            expect(attendee.getFullName()).toBe(attendeeA.getFullName());
            expect(attendee.getId()).not.toBeUndefined();
            done();
          },
          function onFailure() {
            expect('Failed').toBe(false);
            done();
          });
      });
    });
    
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
    
    describe('on success of underlying getAll', function() {
      it('returns a Promise for all processed records, '
      +'if there are none pending',function(done) {
        spyOn(baseWebApi,'getAll').and.returnValue(
          new Promise( function(resolve,reject) {
            setTimeout(function() {
              resolve([attendeeA,attendeeB]);
            },1);
          }));
        decoratedWebApi.getAll().then(
          function onSuccess(attendees) {
            expect(attendees.length).toBe(2);
            done();
          },
          function onFailure() {
            expect('Failed in getAll').toBe(false);
            done();
          });
      });
    });
    
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