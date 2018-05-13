Attendee = function(service, messenger, attendeeId) {
   // Ensure created with 'new'
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }
  
  this.attendeeId = attendeeId;
  
  this.service = service;
  this.messenger = messenger; 
};
