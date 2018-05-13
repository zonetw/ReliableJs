describe('Conference.attendeeCollection',function(){
  'use strict';
  
  describe('contains(attendee)', function(){
    // contains tests
  });
  describe('add(attendee)', function(){
    // add tests
  });
  describe('remove(attendee)', function(){
    // remove tests
  });
  
  describe('iterate(callback)', function(){
    var collection, callbackSpy;
    
    // Helper functions 
    function addAttendeesToCollection(attendeeArray){
      attendeeArray.forEach(function(attendee){
        collection.add(attendee);
      });
    }
    
    function verifyCallbackWasExecutedForEachAttendee(attendeeArray){
      // ensure that the spy was called once for each element
      expect(callbackSpy.calls.count()).toBe(attendeeArray.length); 
      
      // ensure that the first argument provided to the spy
      // for each call is the corresponding attendee
      var allCalls = callbackSpy.calls.all();
      for(var i = 0; i < allCalls.length; i++){
        expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
      }
    }
    
    beforeEach(function(){
      collection = Conference.attendeeCollection();
      callbackSpy = jasmine.createSpy();
    });
    
    it('does not execute the callback when the collection is empty', function(){
      collection.iterate(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });
    
    it('executes the callback once for a single element collection', function(){
      var attendees = [
        Conference.attendee('Pete', 'Mitchell')
      ];
      addAttendeesToCollection(attendees);
      
      collection.iterate(callbackSpy);
      
      verifyCallbackWasExecutedForEachAttendee(attendees);
    });
    
    it('executes the callback once for each element in a collection', function(){
      var attendees = [
        Conference.attendee('Tom', 'Kazansky'),
        Conference.attendee('Charlotte', 'Blackwood'),
        Conference.attendee('Mike', 'Metcalf')
      ];
      addAttendeesToCollection(attendees);
      
      collection.iterate(callbackSpy);
      
      verifyCallbackWasExecutedForEachAttendee(attendees);
    });
  });
});