describe('Conference.checkedInAttendeeCounter', function(){
  'use strict';
  
  var counter;
  beforeEach(function(){
    counter = Conference.checkedInAttendeeCounter();
  });
  describe('increment()', function(){
    // increment tests
  });
  describe('getCount()', function(){
    // getCount tests
  });
  describe('countIfCheckedIn(attendee)', function(){
    var attendee;
    
    beforeEach(function(){
      attendee = Conference.attendee('Mike', 'Metcalf');
    });

    it('doesn\'t increment the count if the attendee isn\'t checked in', function(){
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(0);
    });
    it('increments the count if the attendee is checked in', function(){
      attendee.checkIn();
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(1);
    });
    it('doesn\'t need this to be the checkedInAttendeeCounter instance', function(){
      attendee.checkIn();
      // executes counter.countIfCheckedIn with this assigned to
      // an empty object
      counter.countIfCheckedIn.call({}, attendee);
      expect(counter.getCount()).toBe(1);
    });
  });
});