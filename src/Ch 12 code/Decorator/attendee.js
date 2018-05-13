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
    },
    
    // Tells whether this attendee is the same person as another attendee.
    // To keep things simple, the comparison is based on the name only.
    // In real life, there would be other data such as a date of birth.
    isSamePersonAs: function(otherAttendee) {
        return otherAttendee !== undefined
        && otherAttendee.getFullName() === this.getFullName();
    },
    
    // Return a copy of this attendee
    copy: function() {
      var copy = Conference.attendee(first,last);
      copy.setId(this.getId());
      copy.checkIn(this.isCheckedIn());
      copy.setCheckInNumber(this.getCheckInNumber());
      return copy;
    }
  };
};

