describe("Conference.WidgetSandbox", function(){
  'use strict';
  
  describe("Constructor function", function(){
    var widgetFcnSpy;
    
    beforeEach(function(){
      // Add test tools so the tests aren't dependent upon
      // the existence of actual tools
      Conference.WidgetTools.tool1 = function(sandbox){
        return {};
      };
      Conference.WidgetTools.tool2 = function(sandbox){
        return {};
      };
      
      // create a spy that may be used as the widget function 
      widgetFcnSpy = jasmine.createSpy();
    });
    
    afterEach(function(){
      // remove the test tools
      delete Conference.WidgetTools.tool1;
      delete Conference.WidgetTools.tool2;
    });
    
    it("throws if it has not been invoked with the 'new' keyword", function(){
      expect(function shouldThrow(){
        var sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });
    
    describe('new WidgetSandbox(toolsArray, widgetFcn)', function(){
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
        var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], 
          widgetFcnSpy);
        expect(widgetFcnSpy).toHaveBeenCalledWith(sandbox);
      });
      
      it("throws if an invalid tool is specified", function(){
        var badTool = 'badTool';
        expect(function shouldThrow(){
          var sandbox = new Conference.WidgetSandbox(['tool1', badTool],
            widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool+badTool);
      });
      
      it("invokes the tool module function with the sandbox", function(){
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');
        var sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], 
          widgetFcnSpy);
        expect(Conference.WidgetTools.tool1)
          .toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2)
          .toHaveBeenCalledWith(sandbox);
      });
    });
    
    describe("new WidgetSandbox('tool1',..., 'toolN', widgetFcn)", function(){
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
        var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', 
          widgetFcnSpy);
        expect(widgetFcnSpy).toHaveBeenCalledWith(sandbox);
      });
      
      it("throws if an invalid tool is specified", function(){
        var badTool = 'badTool';
        expect(function shouldThrow(){
          var sandbox = new Conference.WidgetSandbox('tool1', badTool,
            widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool+badTool);
      });
      
      it("invokes the tool module function with the sandbox", function(){
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');
        var sandbox = new Conference.WidgetSandbox('tool1', 'tool2', 
          widgetFcnSpy);
        expect(Conference.WidgetTools.tool1)
          .toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2)
          .toHaveBeenCalledWith(sandbox);
      });
    });
  });
});