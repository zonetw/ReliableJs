var Conference = Conference || {};

Conference.checkInRecorder = function() {
  'use strict';
  
  var messages = {
    mustBeCheckedIn: 'The attendee must be marked as checked in.'
  };
  
  return {
    getMessages: function() {
      return messages;
    },
  
    recordCheckIn: function(attendee) {
      return new Promise( function(resolve, reject) {
        if (attendee.isCheckedIn()) {
          resolve(4444); // For now, resolve with any number.
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    }
  };
};

