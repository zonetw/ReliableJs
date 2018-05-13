describe("Conference.presenterEvaluation", function(){
  'use strict';
  
  var evaluation;
  
  beforeEach(function(){
    evaluation = Conference.presenterEvaluation();  
  });
  
  describe("setPresenter(presenterName)", function(){
    
    it("returns the instance on which it was invoked", function(){
      expect(evaluation.setPresenter("Presenter Name")).toBe(evaluation);
    });
    
    it("stores the presenter name", function(){
      var name = "Meg Ryan";
      evaluation.setPresenter(name);
      expect(evaluation.getPresenter()).toEqual(name);
    });
    
  });
  
});