describe("Conference.WidgetSandbox", function(){
  'use strict';
  
  describe("Constructor function", function(){
    
    it("throws if it has not been invoked with the 'new' keyword", function(){
      expect(function shouldThrow(){
        var sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });
    
    describe('new WidgetSandbox(toolsArray, widgetModule)', function(){
      // Tests behavior when the list of tools is provided as an
      // array
      
      it("throws if a widget function is not provided", function(){
        [null, undefined, 1, "SomeString", false].forEach(function testInvalid(val){
          expect(function shouldThrow(){
            var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });
      
      it("invokes the widget function with sandbox as an arg", function(){
        var widgetFcn = jasmine.createSpy();
        var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], 
          widgetFcn);
        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });
    });
    
    describe("new WidgetSandbox('tool1',..., 'toolN', widgetModule)", function(){
      // Tests behavior when the list of tools is provided as individual
      // arguments
      
      it("throws if a widget function is not provided", function(){
        [null, undefined, 1, "SomeString", false].forEach(function testInvalid(val){
          expect(function shouldThrow(){
            var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });
      
      it("invokes the widget function with sandbox as an arg", function(){
        var widgetFcn = jasmine.createSpy();
        var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', widgetFcn);
        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });
    });
  });
});