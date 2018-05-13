describe('Conference.attendee', function() {
  'use strict';
  
  var attendee, firstName, lastName;
  beforeEach(function() {
    firstName = 'Tom';
    lastName = 'Jones';
    attendee = Conference.attendee(firstName, lastName);
  });
  it('sets and gets the primary key with setId(id) and getId()',function() {
    var id = 1234;
    attendee.setId(id);
    expect(attendee.getId()).toBe(id);
  });
  it('offers the full name with getFullName()', function() {
    expect(attendee.getFullName()).toBe(firstName + ' ' + lastName);
  });
  it('is initially not checked in', function() {
    expect(attendee.isCheckedIn()).toBe(false);
  });
  it('is checked in after a call to checkIn()', function() {
    attendee.checkIn();
    expect(attendee.isCheckedIn()).toBe(true);
  });
  it('is no longer checked in after undoCheckIn()', function() {
    attendee.checkIn();
    attendee.undoCheckIn();
    expect(attendee.isCheckedIn()).toBe(false);
  });
  it('sets the checkin number with setCheckInNumber() ' +
     'and gets it with getCheckInNumber()',function() {
    var checkInNumber = 5555;
    attendee.setCheckInNumber(checkInNumber);
    expect(attendee.getCheckInNumber()).toBe(checkInNumber);
  });
});