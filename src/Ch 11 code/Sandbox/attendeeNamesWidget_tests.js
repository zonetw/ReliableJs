describe("Conference.Widgets.attendeeNamesWidget(sandbox)", function(){
  'use strict';
  
  var sandbox;
  beforeEach(function(){
    sandbox = {};
  });
  
  it("throws if the dom tool isn't available", function(){
    expect(function shouldThrow(){
      Conference.Widgets.attendeeNamesWidget(sandbox);
    }).toThrowError(Conference.Widgets.messages.missingTool + 'dom');
  });
  
  it("throws if the attendeeNames tool isn't available", function(){
    expect(function shouldThrow(){
      sandbox.dom = {};
      Conference.Widgets.attendeeNamesWidget(sandbox);
    }).toThrowError(Conference.Widgets.messages.missingTool + 'attendeeNames');
  });
  
  // Additional tests that ensure the attendeeNamesWidget functions as expected
});