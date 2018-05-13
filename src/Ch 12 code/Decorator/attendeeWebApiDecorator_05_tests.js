describe('attendeeWebApiDecorator', function() {
  'use strict';
  
  var decoratedWebApi,
      baseWebApi,
      attendeeA,
      attendeeB,
      underlyingFailure = 'Failure in underlying function';
  
  // Execute decoratedWebApi.getAll(), expecting it to return a resolved
  // Promise.
  // done        - The prevailing Jasmine done() function for async support.
  // expectation - A function that gives expectations on the returned 
  //               attendees.
  function getAllWithSuccessExpectation(done,expectation) {
    decoratedWebApi.getAll().then(
      function onSuccess(attendees) {
        expectation(attendees);
        done();
      },
      function onFailure() {
        expect('Failed in getAll').toBe(false);
        done();
      });
  }
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
      it('causes an immediate getAll to include the record without ID',
      function(done) {
        decoratedWebApi.post(attendeeA);
        // Execute getAll without waiting for the post to resolve.
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees.length).toBe(1);
          expect(attendees[0].getId()).toBeUndefined();
        });
      });
      it('causes a delayed getAll to include the record with ID', 
      function(done) {
        decoratedWebApi.post(attendeeA).then(function() {
          // This time execute getAll after post resolves.
          getAllWithSuccessExpectation(done, function onSuccess(attendees) {
            expect(attendees.length).toBe(1);
            expect(attendees[0].getId()).not.toBeUndefined();
          });
        });
      });
      it('fills in IDs of records already appended to getAll',function(done){
        var recordsFromGetAll, promiseFromPostA;
        // Issue the post and don't wait for it.
        promiseFromPostA = decoratedWebApi.post(attendeeA);
        // Immediately issue the getAll, and capture its results.
        decoratedWebApi.getAll().then(function onSuccess(attendees) {
          recordsFromGetAll = attendees;
          expect(recordsFromGetAll[0].getId()).toBeUndefined();
        });
        // Now wait for the post to finally resolve. (Remember that
        // its timeout is longer than getAll's.) When it does resolve,
        // We should see the attendeeId appear in the pending record that
        // getAll() obtained.
        promiseFromPostA.then(function() {
          expect(recordsFromGetAll[0].getId()).not.toBeUndefined();
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
        getAllWithSuccessExpectation(done,function onSuccess(attendees) {
          expect(attendees.length).toBe(2);
        });
      });
      it('returns a Promise for all processed records plus all pending ones',
      function(done) {
        decoratedWebApi.post(attendeeA).then(function() {
          decoratedWebApi.post(attendeeB); // Leave pending.
          getAllWithSuccessExpectation(done,function onSuccess(attendees) {
            expect(attendees.length).toBe(2);
            expect(attendees[0].getId()).not.toBeUndefined();
            expect(attendees[1].getId()).toBeUndefined();
          });
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