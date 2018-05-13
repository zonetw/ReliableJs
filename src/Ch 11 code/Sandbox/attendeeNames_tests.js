describe("Conference.WidgetTools.attendeeNames", function(){
  'use strict';
  
  var attendeeWebApi,
      sandbox;
  
  beforeEach(function(){
    attendeeWebApi = Conference.attendeeWebApi();
    
    // the post method should NEVER be called.  Spy on it so that
    // it may be verified.
    spyOn(attendeeWebApi, 'post');
    
    // for the purpose of unit testing attendeeNames, sandbox
    // may be a bare object
    sandbox = {};
  });
  
  afterEach(function(){
    // After every test, make sure post was never called.
    expect(attendeeWebApi.post).not.toHaveBeenCalled();
  });
  
  it("adds itself to the provided sandbox object", function(){
    Conference.WidgetTools.attendeeNames(sandbox, attendeeWebApi);
    expect(sandbox.attendeeNames).not.toBeUndefined();
  });
  
  describe("attendeeNames.getAll()", function(){
    var attendees,
        attendeeNames;
        
    beforeEach(function(){
        Conference.WidgetTools.attendeeNames(sandbox, attendeeWebApi);
        
        // Populate an array of test attendees
        attendees = [
          Conference.attendee("Tom", "Kazansky"),
          Conference.attendee("Pete", "Mitchell"),
          Conference.attendee("Mary", "Metcalf")
        ];
        
        // Extract the names from the test attendees
        attendeeNames = [];
        attendees.forEach(function getNames(attendee){
          attendeeNames.push(attendee.getFullName());
        });
    });
    
    it("resolves to an empty array if there are no attendees", function(done){
      
      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise( function(resolve, reject){
          resolve([]); 
        })
      );
      
      sandbox.attendeeNames.getAll().then(function resolved(names){
        expect(names).toEqual([]);
        done();
      }, function rejected(reason){
        expect('Failed').toBe(false);
        done();
      });
      
    });
    
    it("resolves to the expected names if there are attendees", function(done){
      
      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise( function(resolve, reject){
          resolve(attendees); 
        })
      );
      
      sandbox.attendeeNames.getAll().then(function resolved(names){
        expect(names).toEqual(attendeeNames);
        done();
      }, function rejected(reason){
        expect('Failed').toBe(false);
        done();
      });
  
    });
    
    it("rejects with the underlying reason", function(done){
      var rejectionReason = "Reason for rejection";
      
      spyOn(attendeeWebApi, 'getAll').and.returnValue(
        new Promise( function(resolve, reject){
          reject(rejectionReason); 
        })
      );
      
      sandbox.attendeeNames.getAll().then(function resolved(names){
        expect('Resolved').toBe(false);
        done();
      }, function rejected(reason){
        expect(reason).toBe(rejectionReason);
        done();
      });
    });
  });
});