describe("redicabTransportCompany", function(){
  'use strict';
  
  var httpService,
      company,
      details,
      expectedData,
      testConfirmation;
  
  beforeEach(function(){
    httpService = Conference.httpService();
    
    company = Conference.redicabTransportCompany(httpService);
    
    details = {
      transportCompany: "RediCab",
      passengerName: "Pete Mitchell",
      departureTime: "7:30 PM" 
    };
    
    // based on details, data posted should look like:
    expectedData = {
      passenger: details.passengerName,
      pickUp: "Conference Center",
      pickUpTime: details.departureTime,
      dropOff: "Airport",
      rateCode: "JavaScriptConference"
    };
    
    // An object similar to that returned by the RediCab api
    testConfirmation = {
      confirmationCode: "AAA-BBB-CCC",
      anticipatedCharge: 34.00
    };
  });
  
  describe("schedulePickup(transportDetails)", function(){
    it("posts the expected data to the correct url", function(){

      spyOn(httpService, 'post')
        .and.callFake(function fake(url, data){
          expect(data).toEqual(expectedData);
          expect(url).toEqual(company.getSchedulePickupUrl());

          return new Promise(function(resolve, reject){
            resolve(testConfirmation);
          });
        });
      
      company.schedulePickup(details);
      
    });
    
    it("resolves to the confirmation number", function(done){
      spyOn(httpService, 'post')
        .and.returnValue(new Promise(function(resolve, reject){
            resolve(testConfirmation);
          })
        );
      
      company.schedulePickup(details).then(function resolved(confirmation){
        expect(confirmation).toEqual(testConfirmation.confirmationCode);
        done();
      }, function rejected(reason){
        expect("Should not have been rejected").toBe(false);
        done();
      });
    });
  });
});