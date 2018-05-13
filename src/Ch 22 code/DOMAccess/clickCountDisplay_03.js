var Conference = Conference || {};
Conference.clickCountDisplay = function(options){
  'use strict';
  
  var clickCount = 0;

  // Production code would verify that 
  // options is defined and that its properties
  // are of the expected type.

  var clickCounter = {
    getClickCount: function getClickCount(){
      return clickCount;  
    },
    
    updateCountDisplay: function updateCountDisplay(){
      options.updateElement.text(clickCount);
    },
    
    incrementCountAndUpdateDisplay: function incrementCountAndUpdateDisplay(){
      clickCount++;
      this.updateCountDisplay();
    }
  };
  
  options.triggerElement.on('click', function clickBinder(){
    clickCounter.incrementCountAndUpdateDisplay(); 
  });
  
  return clickCounter;
};