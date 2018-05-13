describe('attendeeWebApiDecorator', function() {
  'use strict';
  
  var decoratedWebApi,
      baseWebApi,
      underlyingFailure = 'Failure in underlying function';
      
  beforeEach(function() {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decoratedWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
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