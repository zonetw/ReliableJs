// The original attendee.js, with no trace of the registry
var Conference = Conference || {};
Conference.attendee = function(firstName, lastName){
  'use strict';
  
  var attendeeId,
    checkedIn = false,
    first = firstName || 'None', 
    last = lastName || 'None',
    checkInNumber;
  
  return {
    setId: function(id) {
      attendeeId = id;
    },
    getId: function() {
      return attendeeId;
    },
    
    getFullName: function(){
      return first + ' ' + last;
    },
    
    isCheckedIn: function(){
      return checkedIn;
    },
    
    checkIn: function(){
      checkedIn = true;
    },
    
    undoCheckIn: function() {
      checkedIn = false;
      checkInNumber = undefined;
    },
    
    setCheckInNumber: function(number) {
      checkInNumber = number;
    },
    
    getCheckInNumber: function() {
      return checkInNumber;
    }
  };
};
