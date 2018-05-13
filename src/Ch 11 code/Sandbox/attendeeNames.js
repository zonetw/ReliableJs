var Conference = Conference || {};
Conference.WidgetTools = Conference.WidgetTools || {};

Conference.WidgetTools.attendeeNames = function(sandbox, 
  injectedAttendeeWebApi){
  
  'use strict';

  // Allow the attendeeWebApi to be optionally injected; useful for unit-testing
  var attendeeWebApi = injectedAttendeeWebApi || Conference.attendeeWebApi();
  
  sandbox.attendeeNames = {
    
    // Returns a promise that resolves to an array of attendee names
    getAll: function getAll(){
      return attendeeWebApi.getAll()
        .then(function extractNames(attendees){
          // extract and return only the full name of each attendee
          var names = [];
          attendees.forEach(function addName(attendee){
            names.push(attendee.getFullName());
          });
          return names;
        });
    }
  };
};