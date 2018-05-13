var Conference = Conference || {};

Conference.checkInRecorder = function(){
  'use strict';
  
  var messages = {
    mustBeCheckedIn: 'The attendee must be marked as checked in.',
    httpFailure: 'The HTTP request failed.'
  };
  
  return {
    getMessages: function() {
      return messages;
    },
    
    recordCheckIn: function(attendee) {
      return new Promise( function(resolve, reject) {
        if (attendee.isCheckedIn()) {
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange=function onreadystatechange() {
            if (xhr.readyState==4) {
              if (xhr.status==200) {
                resolve(xhr.responseText);
              } else {
                reject(new Error(messages.httpFailure));
              }
            }
          };
          xhr.open("POST","/checkin/" + attendee.getId(),true);
          xhr.send();
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    }
  };
};
