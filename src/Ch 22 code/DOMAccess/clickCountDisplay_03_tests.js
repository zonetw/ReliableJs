describe("Conference.clickCountDisplay", function(){
  'use strict';

  var display,
      displayElement,
      clickElement;
  
  beforeEach(function(){
    // Create a jQuery element from a string that defines the DOM element
    displayElement = $("<span></span>");
    // and append it to the body
    $('body').append(displayElement);
    
    // Create the click element and append it to the body
    clickElement = $("<button></button>");
    $('body').append(clickElement);
    
    var options = {
      updateElement : displayElement,
      triggerElement : clickElement
    };
    
    display = Conference.clickCountDisplay(options);
  });
  
  afterEach(function(){
    displayElement.remove();  
    clickElement.remove();
  });
  
  it("initializes the click count to 0", function(){
    expect(display.getClickCount()).toEqual(0);
  });
  
  it("executes incrementCountAndUpdateDisplay when the trigger " +
     "element is clicked", function(){
    spyOn(display, "incrementCountAndUpdateDisplay");
    clickElement.trigger('click');
    expect(display.incrementCountAndUpdateDisplay).toHaveBeenCalled();
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
    
    it("sets the text of the updateElement", function(){
      display.incrementCountAndUpdateDisplay();
      expect(displayElement).toHaveText(display.getClickCount());
      display.incrementCountAndUpdateDisplay();
      expect(displayElement).toHaveText(display.getClickCount());
    });
  });
  
  describe("updateCountDisplay()", function(){
    it("displays 0 if the count hasn't been incremented", function(){
      expect(displayElement).toHaveText("");
      display.updateCountDisplay();
      expect(displayElement).toHaveText("0");
    });
  });
});