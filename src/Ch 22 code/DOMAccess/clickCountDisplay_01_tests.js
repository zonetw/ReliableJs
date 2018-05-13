describe("Conference.clickCountDisplay", function(){
  'use strict';
  
  var display;
  
  beforeEach(function(){
    display = Conference.clickCountDisplay();
  });
  
  it("initializes the click count to 0", function(){
    expect(display.getClickCount()).toEqual(0);
  });
  
  describe("incrementCountAndUpdateDisplay()", function(){
    it("increments the click count", function(){
      var initialCount = display.getClickCount();
      display.incrementCountAndUpdateDisplay();
      expect(display.getClickCount()).toEqual(initialCount + 1);
    });
    
    it("executes the updateCountDisplay function", function(){
      spyOn(display, "updateCountDisplay");
      display.incrementCountAndUpdateDisplay();
      expect(display.updateCountDisplay).toHaveBeenCalled();
    });
  });
});