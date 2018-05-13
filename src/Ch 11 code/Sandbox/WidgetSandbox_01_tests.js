describe("Conference.WidgetSandbox", function(){
  'use strict';
  
  describe("Constructor function", function(){
    it("throws if it has not been invoked with the 'new' keyword", function(){
      expect(function shouldThrow(){
        var sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });
    
    it("throws if a widget function is not provided", function(){
      [null, undefined, 1, "SomeString", false].forEach(function testInvalid(notAFcn){
        expect(function shouldThrow(){
          var sandbox = new Conference.WidgetSandbox(notAFcn);
        }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
      });
    });
    
    it("invokes the widget function with the sandbox as an arg", function(){
      var widgetFcn = jasmine.createSpy();
      var sandbox = new Conference.WidgetSandbox(widgetFcn);
      expect(widgetFcn).toHaveBeenCalledWith(sandbox);
    });
  });
});