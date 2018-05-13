var Conference = Conference || {};

// Call this function to install aspects that will verify that
// attendees created by Conference.attendee(firstName, lastName)
// are valid.
Conference.attendeeContracts = function attendeeContracts(registry) {
    'use strict';

	var attendeePersonalInfo = 'Conference.attendee.personalInfo',
        attendeeCheckInManagement = 'Conference.attendee.checkInManagement';
  
	function fulfillsPersonalInfo(att) {
	  return typeof att.setId === 'function' &&
		     typeof att.getId === 'function' &&
		     typeof att.getFullName === 'function';
	}
	  
	function fulfillsCheckInManagement(att) {
	  return typeof att.getId === 'function' &&
		     typeof att.isCheckedIn === 'function' &&
		     typeof att.checkIn === 'function' &&
		     typeof att.undoCheckIn === 'function' &&
		     typeof att.setCheckInNumber === 'function' &&
		     typeof att.getCheckInNumber === 'function';  
	}
	  
	registry.define(attendeePersonalInfo, fulfillsPersonalInfo);  
	registry.define(attendeeCheckInManagement, fulfillsCheckInManagement);

	registry.attachReturnValidator('attendee',Conference,
		  attendeePersonalInfo);
	registry.attachReturnValidator('attendee',Conference,
		  attendeeCheckInManagement);
};

// Sample usage:
// In application startup, instantiate a registry and attach aspects.
var registry = ReliableJavaScript.contractRegistry();
Conference.attendeeContracts(registry);
// Aspect installations for other modules would follow.

// Later, when an attendee is created, the aspects will ensure
// that it is valid.
var a = Conference.attendee('Rock','Star'); // Does not throw.