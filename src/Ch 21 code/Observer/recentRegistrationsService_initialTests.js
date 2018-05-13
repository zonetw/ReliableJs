describe("recentRegistrationsService", function(){
  'use strict';
  
  var service,
      observer1,
      observer2;
  
  beforeEach(function(){
    service = Conference.recentRegistrationsService();  
    observer1 = {
      update: function update(){ }
    };
    observer2 = {
      update: function update(){ }
    };
  });
  
  afterEach(function(){
    service.stopPolling();
    service.clearObservers();
  });
  
  describe("addObserver(observer) and hasObserver(observer)", function(){

    describe("with a single observer", function(){
      it("hasObserver returns false if observer hasn't been added", function(){
        expect(service.hasObserver(observer1)).toBe(false);
      });
      
      it("hasObserver returns true if observer has been added", function(){
        service.addObserver(observer1);
        expect(service.hasObserver(observer1)).toBe(true);
      });
  });
    
    describe("with multiple observers", function(){
      it("returns false if observer hasn't been added", function(){
        service.addObserver(observer1);
        expect(service.hasObserver(observer2)).toBe(false);
      });
      
      it("returns true for all added observers", function(){
        service.addObserver(observer1);
        service.addObserver(observer2);
        expect(service.hasObserver(observer1)).toBe(true);
        expect(service.hasObserver(observer2)).toBe(true);
      });
    });
  });
  
  describe("removeObserver(observer)", function(){
    describe("with a single observer", function(){
      it("has no effect if observer hasn't been added", function(){
        // add observer1
        service.addObserver(observer1);
        
        // try to remove observer2
        service.removeObserver(observer2);
        
        expect(service.hasObserver(observer1)).toBe(true);
        expect(service.hasObserver(observer2)).toBe(false);
      });
      it("removes observer if it has been added", function(){
        service.addObserver(observer1);
        expect(service.hasObserver(observer1)).toBe(true);
        service.removeObserver(observer1);
        expect(service.hasObserver(observer1)).toBe(false);
      });  
    });
    describe("with multiple observers", function(){
      it("only removes the specified observer", function(){
        service.addObserver(observer1);
        service.addObserver(observer2);
        
        service.removeObserver(observer2);
        
        expect(service.hasObserver(observer1)).toBe(true);
        expect(service.hasObserver(observer2)).toBe(false);
      });
    });
  });
  
  describe("updateObservers(newAttendee)", function(){
    var registration;
    
    beforeEach(function(){
      registration = { };
      spyOn(observer1, "update");
      spyOn(observer2, "update");
    });
    
    describe("with a single observer", function(){
      it("executes the observer's update function", function(){
        service.addObserver(observer1);
        service.updateObservers(registration);
        expect(observer1.update).toHaveBeenCalledWith(registration);
      });
      it("doesn't execute update function of removed observer", function(){
        service.addObserver(observer1);
        service.removeObserver(observer1);
        
        service.updateObservers(registration);
        expect(observer1.update).not.toHaveBeenCalledWith(registration);
      });  
    });
    describe("with multiple observers", function(){
      it("executes the observer's update function", function(){
        service.addObserver(observer1);
        service.addObserver(observer2);
        
        service.updateObservers(registration);
        
        expect(observer1.update).toHaveBeenCalledWith(registration);
        expect(observer2.update).toHaveBeenCalledWith(registration);
      });
      
      it("doesn't execute update function of removed observer", function(){
        service.addObserver(observer1);
        service.addObserver(observer2);
        service.removeObserver(observer2);
        
        service.updateObservers(registration);
        
        expect(observer1.update).toHaveBeenCalledWith(registration);
        expect(observer2.update).not.toHaveBeenCalledWith(registration);
      });
    });
  });
});