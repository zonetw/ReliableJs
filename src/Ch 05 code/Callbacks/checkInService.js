var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder){
  "use strict";
  
  // retain a reference to the injected checkInRecorder
  var recorder = checkInRecorder;
  
  return {
    checkIn: function(attendee){
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
    }
  };
};

