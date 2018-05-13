var Conference = Conference || {};

Conference.outgoingLinkClickHandler = function(clickRecorder){
  'use strict';
  
  return {
    
    // retain a reference to the injected clickRecorder
    linkClickRecorder: clickRecorder,
    
    // Constructs an object containing details of the click
    // and records the click with the clickRecorder
    handleClick: function handleClick(){
      // construct a linkDetails object
      var clickDetails = {};
      
      this.linkClickRecorder.recordClick(clickDetails);
    }
  };
};