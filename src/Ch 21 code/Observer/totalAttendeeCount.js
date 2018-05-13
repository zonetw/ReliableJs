var Conference = Conference || {};

Conference.totalAttendeeCount = function(initialCount, 
                                         recentRegistrationsService){
  'use strict';
  
  var currentCount = initialCount,
      registrations = recentRegistrationsService,
      render = function render(){
        // renders the current count in the DOM.
      };
      
  var module = {
    // Returns the total count of attendees that is displayed in the UI.
    getCount: function(){
      return currentCount;
    },
    
    // Increments the total count of attendees.
    update: function update(newAttendee){
      currentCount++;
      render();
    }
  };
  
  // Add module as an observer of the recentRegistrationsService
  registrations.addObserver(module);
  
  return module;
};