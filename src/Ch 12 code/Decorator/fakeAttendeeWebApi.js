var Conference = Conference || {};

// A fake version of attendeeWebApi. It has the same methods as the real one,
// but is entirely client-side.
Conference.fakeAttendeeWebApi = function(){
  'use strict';
  
  var attendees = []; // Fake database table.
      
  return {
    
    // Pretend to POST the attendee to the server.
    // Returns a Promise that resolves to a copy of the attendee
    // (to mimic getting a new version from the server), which 
    // will at that point have a primary key (attendeeId) that was
    // assigned by the database.
    // If a test requires the Promise to reject, use a spy.
    post: function post(attendee) {
      return new Promise( function(resolve, reject) {
        // setTimeout, even with a delay of only 5 milliseconds, causes
        // the resolution of the promise to be delayed to the next turn.
        setTimeout(function pretendPostingToServer() {
          var copyOfAttendee = attendee.copy();
          copyOfAttendee.setId(attendees.length+1);
          attendees.push(copyOfAttendee);
          resolve(copyOfAttendee);
        },5);
      });
    },
    
    // Return a Promise for all attendees. This Promise always resolves,
    // but in testing a spy can make it reject if necessary.
    getAll: function getAll() {
      return new Promise( function(resolve,reject) {
        // This setTimeout has a shorter delay than post's,
        // to imitate the conditions observed in real life.
        setTimeout(function pretendToGetAllFromServer() {
          var copies = [];
          attendees.forEach(function(a) {
            copies.push(a.copy());
          });
          resolve(copies);
        },1);
      });
    }
  };
};

