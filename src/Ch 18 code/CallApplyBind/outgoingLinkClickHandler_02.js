var Conference = Conference || {};

Conference.outgoingLinkClickHandler = function(clickRecorder){
  'use strict';
  
  var handler = {
    
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
  
  // replace handler.handleClick with a new copy of the function that
  // is permanently bound to handler
  handler.handleClick = handler.handleClick.bind(handler);
  
  return handler;
};