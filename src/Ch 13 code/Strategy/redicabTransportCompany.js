var Conference = Conference || {};
Conference.redicabTransportCompany = function(httpService){
  'use strict';

  var schedulePickupUrl = "http://redicab.com/schedulepickup";
  
  return{
    
    // schedules a pickup with RediCab.  Returns a promise
    // that resolves to the confirmation code returned by the
    // RediCab api.
    schedulePickup: function schedulePickup(transportDetails){
      var details = {
        passenger: transportDetails.passengerName,
        pickUp: "Conference Center",
        pickUpTime: transportDetails.departureTime,
        dropOff: "Airport",
        rateCode: "JavaScriptConference"
      };
      
      return httpService.post(schedulePickupUrl, details)
        .then(function resolve(confirmation){
          return confirmation.confirmationCode;
        });
    },
    
    // Returns the url that the pickup information should
    // be posted to
    getSchedulePickupUrl: function getSchedulePickupUrl(){
      return schedulePickupUrl;
    }
  };
};