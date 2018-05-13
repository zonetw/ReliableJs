describe("Conference.presenterEvaluation", function(){
  'use strict';
  
  var evaluation;
  
  beforeEach(function(){
    evaluation = Conference.presenterEvaluation();  
  });
  
  describe("exposes chainable setter functions", function(){
      it("that return the instance on which the setter was invoked", function(){
        
        // Create an array that contains a valid invocation (passes data
        // validation, etc.) of each of the functions that should be 
        // chainable.
        var validCalls = [
          function(ev){ return ev.setPresenter("presenter name"); },
          function(ev){ return ev.setPresentation("presentation name"); }
        ];
        
        // Ensure that each of the functions in validCalls returns
        // evaluation, making it chainable.
        validCalls.forEach(function ensureReturnsThis(fcn){
          expect(fcn(evaluation)).toBe(evaluation);
        });
        
      });
  });
  
  describe("setPresenter(presenterName)", function(){
    
    it("stores the presenter name", function(){
      var name = "Meg Ryan";
      evaluation.setPresenter(name);
      expect(evaluation.getPresenter()).toEqual(name);
    });
    
  });
  
});