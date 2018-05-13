var Conference = Conference || {};

Conference.presenterEvaluation = function(){
  'use strict';
  
  var presenter = "";
  
  return{
    
    // Sets the name of the presenter this evaluation pertains to.  Returns
    // the evaluation instance on which it was invoked, making it chainable.
    setPresenter: function setPresenter(presenterName){
      presenter = presenterName;
      return this;
    },
    
    // returns the name of the presenter this evaluation pertains to.
    getPresenter: function getPresenter(){
      return presenter;
    }
  };
};