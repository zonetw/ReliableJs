var Conference = Conference || {};

Conference.recentRegistrationsService = function(registrationsService){
  'use strict';
  
    var registeredObservers = [],
        service = {
          // Adds observer to the list of observers that will receive
          // notifications when a new attendee registers.
          addObserver: function addObserver(observer){
            return registeredObservers.push(observer);
          },
          
          // Removes observer from the list of observers, if it exists.
          removeObserver: function removeObserver(observer){
            var index = registeredObservers.indexOf(observer);
            if(index >= 0){
              registeredObservers.splice(index, 1); 
            }
          },
          
          // Removes all observers,
          clearObservers: function clearObservers(){
            registeredObservers = [];
          },
          
          // Returns true if the provided observer is registered, false
          // otherwise.
          hasObserver: function hasObserver(observer){
            return registeredObservers.indexOf(observer) >= 0;
          },
          
          // Executes the update method provided by each of the registered
          // observers, providing the newly registered attendee, newAttendee, as
          // an argument.
          updateObservers: function updateObservers(newAttendee){
            registeredObservers.forEach(function executeObserver(observer){
              observer.update(newAttendee);
            });
          },
          
          // Causes the service to stop polling.  Once polling has been
          // stopped, it may not be restarted.
          stopPolling : function(){
            if(pollingProcess){
              clearInterval(pollingProcess);
              pollingProcess = false;
            }
          }
        },
        
        getNewAttendees = function getNewAttendees(){
          // calls the server and retrieves and returns a promise of an
          // array of the attendees that registered since the last time it 
          // polled.
          return new Promise(function(resolve, reject){
            // Code to communicate with the server has been omitted.
            resolve([]);
          });
        },
        pollingProcess = setInterval(function pollForNewAttendees(){
          getNewAttendees().then(function processNewAttendees(newAttendees){
            newAttendees.forEach(function updateWithNewAttendee(newAttendee){
              service.updateObservers(newAttendee);
            });
          });
        }, 15000);
      
      return service;
};