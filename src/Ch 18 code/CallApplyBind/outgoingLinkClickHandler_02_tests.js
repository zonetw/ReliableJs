describe("Conference.outgoingLinkClickHandler", function(){
  'use strict';
  
  var clickRecorder,
      clickHandler;
  
  beforeEach(function(){
    clickRecorder = Conference.outgoingLinkClickRecorder();
    spyOn(clickRecorder, "recordClick");
    
    clickHandler = Conference.outgoingLinkClickHandler(clickRecorder);
  });
  
  describe("handleClick()", function(){
    it("records a click if executed via the its containing object", function(){
      clickHandler.handleClick();
      expect(clickRecorder.recordClick).toHaveBeenCalled();
    });
    
    it("records a click if provided undefined as its context", function(){
      clickHandler.handleClick.call(undefined);
      expect(clickRecorder.recordClick).toHaveBeenCalled();
    });
    
    it("records a click if provided a bare object as its context", function(){
      clickHandler.handleClick.call({});
      expect(clickRecorder.recordClick).toHaveBeenCalled();
    });
  });

});