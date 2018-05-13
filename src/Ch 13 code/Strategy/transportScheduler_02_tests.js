describe("Conference.transportScheduler", function(){
  'use strict';
  
  describe("module function", function(){
    // Simple tests to ensure that required dependencies have been provided
    
    it("throws if audit service argument is not provided", function(){
      expect(function shouldThrow(){
        var scheduler = Conference.transportScheduler(null, {});
      }).toThrowError(Conference.transportScheduler.messages.noAuditService);
    });
    
    it("throws if company factory argument is not provided", function(){
      expect(function shouldThrow(){
        var scheduler = Conference.transportScheduler({}, null);
      }).toThrowError(Conference.transportScheduler.messages.noCompanyFactory);
    });
  });
  
  describe("scheduleTransportation(transportDetails)", function(){
    var scheduler,
      auditService,
      companyFactory,
      testDetails,
      fakeCompany,
      confirmationNumber;
      
    beforeEach(function(){
      // Create instances of the dependencies to inject into the
      // transport scheduler instance; retain references so their
      // methods may be spied upon in tests.
      auditService = Conference.transportCompanyAuditService();
      companyFactory = Conference.transportCompanyFactory();
      
      // The instance of transportScheduler under test
      scheduler = Conference.transportScheduler(auditService, companyFactory);
      
      // Since companyFactory.create(transportDetails) will be
      // mocked in the tests, testDetails doesn't need to
      // be a real instance of a transportDetails object
      testDetails = {};
      
      confirmationNumber = "ABC-123-XYZ";
      
      // create a fake transport module that implements the schedulePickup
      // function.  By default, the returned Promise resolves to 
      // confirmationNumber.  Spy on schedulePickup if a rejected promise
      // is needed.
      fakeCompany = {
        schedulePickup : function schedulePickup(transportDetails){
          return new Promise(function(resolve, reject){
            resolve(confirmationNumber);    
          }); 
        }
      };
    });
    
    it("throws if transportDetails argument is not provided", function(){
      expect(function shouldThrow(){
        scheduler.scheduleTransportation();
      }).toThrowError(Conference.transportScheduler.messages.noDetails);
    });
    
    it("doesn't swallow exceptions thrown by company factory", function(){
      var companyFactoryError = "This was thrown by the company factory";
      spyOn(companyFactory, "create").and.throwError(companyFactoryError);
      expect(function shouldThrow(){
        scheduler.scheduleTransportation(testDetails);
      }).toThrowError(companyFactoryError);
    });
    
    it("retrieves the company module from the company factory", function(){
      spyOn(companyFactory, "create").and.returnValue(fakeCompany);
      
      scheduler.scheduleTransportation(testDetails);
      
      expect(companyFactory.create).toHaveBeenCalledWith(testDetails);
    });

    it("invokes the company's schedulePickup function", function(){
      spyOn(companyFactory, "create").and.returnValue(fakeCompany);
      
      // fakeCompany is configured to return a resolved promise; simply
      // call through
      spyOn(fakeCompany, "schedulePickup").and.callThrough();
      
      scheduler.scheduleTransportation(testDetails);
      
      expect(fakeCompany.schedulePickup).toHaveBeenCalledWith(testDetails);
    });
    
    describe("Successful scheduling", function(){
      beforeEach(function(){
        spyOn(companyFactory, "create").and.returnValue(fakeCompany);
      });
      
      it("resolves to the returned confirmation number", function(done){
        scheduler.scheduleTransportation(testDetails)
          .then(function resolved(confirmation){
            expect(confirmation).toEqual(confirmationNumber);
            done();
          }, function rejected(reason){
            expect("Should not have been rejected").toBe(false);
            done();
          });
      });
      
      it("logs with audit service", function(done){
        spyOn(auditService, "logReservation");
        
        scheduler.scheduleTransportation(testDetails)
          .then(function resolved(confirmation){
            expect(auditService.logReservation)
              .toHaveBeenCalledWith(testDetails, confirmationNumber);
            done();
          }, function rejected(reason){
            expect("Should not have been rejected").toBe(false);
            done();
          });
      });  
    });
    
    describe("Unsuccessful scheduling", function(){
      var rejectionReason;
      
      beforeEach(function(){
        spyOn(companyFactory, "create").and.returnValue(fakeCompany);
        
        rejectionReason = "Was rejected";
        
        // Set up sheduleRide to return a rejected promise
        spyOn(fakeCompany, "schedulePickup")
          .and.returnValue(new Promise(function(resolve, reject){
            reject(rejectionReason);
          }));
      });
      
      it("allows the rejected Promise to flow to calling code", function(done){
        scheduler.scheduleTransportation(testDetails)
          .then(function resolved(confirmation){
            expect("Should not have been resolved").toBe(false);
            done();
          }, function rejected(reason){
            expect(reason).toEqual(rejectionReason);
            done();
          });
      });
      
      it("doesn't log anything with the audit service", function(done){
        spyOn(auditService, "logReservation");
        
        scheduler.scheduleTransportation(testDetails)
          .then(function resolved(confirmation){
            expect("Should not have been resolved").toBe(false);
            done();
          }, function rejected(reason){
            expect(auditService.logReservation).not.toHaveBeenCalled();
            done();
          });
      });
    }); 
  });
});