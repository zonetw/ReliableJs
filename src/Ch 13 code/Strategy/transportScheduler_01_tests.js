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
      testDetails;
      
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
    });
    
    it("throws if transportDetails argument is not provided", function(){
      expect(function shouldThrow(){
        scheduler.scheduleTransportation();
      }).toThrowError(Conference.transportScheduler.messages.noDetails);
    });
    
    it("doesn't swallow exceptions thrown by company factory", function(){
      var companyFactoryError = "This was thrown by the company factory";
      spyOn(companyFactory, 'create').and.throwError(companyFactoryError);
      expect(function shouldThrow(){
        scheduler.scheduleTransportation(testDetails);
      }).toThrowError(companyFactoryError);
    });
    
  });
});