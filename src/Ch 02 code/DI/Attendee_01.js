Attendee = function(attendeeId) {
  
  // Ensure created with 'new'
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }
  
  this.attendeeId = attendeeId;
  
  this.service = new ConferenceWebSvc();
  this.messenger = new Messenger();
};

// Attempt to reserve a seat at the given session.
// Give a message about success or failure.
Attendee.prototype.reserve = function(sessionId) {
  if (this.service.reserve(this.attendeeId, sessionId)) {
    this.messenger.success('Your seat has been reserved!' +
      ' You may make up to ' + this.service.getRemainingReservations() +
      ' additional reservations.');
  }  else {
    this.messenger.failure('Sorry; your seat could not be reserved.');
  }
};
