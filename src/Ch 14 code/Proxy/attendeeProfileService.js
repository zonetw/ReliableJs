var Conference = Conference || {};
Conference.attendeeProfileService = function() { 
  'use strict'; 
  var messages = {
    httpFailure: 'The HTTP request failed.'
  };
  return {
    // Return a Promise for the profile of an attendee
    getProfile: function(attendeeId) {
      return new Promise( function(resolve, reject) {
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
        xhr.open("GET","profile/" + attendeeId, true);
        xhr.send();
      });
    }
  };
};