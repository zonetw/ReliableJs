var Conference = Conference || {};

Conference.transportScheduler = function(auditService, transportCompanyFactory){
  'use strict';
  
  if(!auditService){
    throw new Error(Conference.transportScheduler.messages.noAuditService);
  }
  if(!transportCompanyFactory){
    throw new Error(Conference.transportScheduler.messages.noCompanyFactory);
  }
  
  return {
    scheduleTransportation : function scheduleTransportation(transportDetails){
      if(!transportDetails){
        throw new Error(Conference.transportScheduler.messages.noDetails);
      }
      var company;
      
      company = transportCompanyFactory.create(transportDetails);
      
      return company.schedulePickup(transportDetails)
        .then(function successful(confirmation){
          auditService.logReservation(transportDetails, confirmation);
          return confirmation;
        });
    }
  };
};

Conference.transportScheduler.messages = {
  noAuditService: "An audit service instance must be provided.",
  noCompanyFactory: "A transport company factory instance must be provided.",
  noDetails: "A transportDetails instance must be provided"
};