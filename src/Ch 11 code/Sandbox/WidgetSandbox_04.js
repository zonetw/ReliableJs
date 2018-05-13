var Conference = Conference || {};

Conference.WidgetSandbox = function(){
  'use strict';
  
  // Ensure that Conference.WidgetSandbox(...) has been invoked using the
  // new keyword
  if(!(this instanceof Conference.WidgetSandbox)){
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }
  
  var widgetFunction,
      toolsToLoad = [],
      argsArray;
      
  // create a *real* array from arguments
  argsArray = Array.prototype.slice.call(arguments);
  
  // the widgetFunction will be the last element of the array; pop it off.
  widgetFunction = argsArray.pop();
  
  if(typeof widgetFunction !== "function"){
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }
  
  toolsToLoad = (argsArray[0] instanceof Array)?
    argsArray[0] :
    argsArray;
  
  toolsToLoad.forEach(function loadTool(toolName){
    if(!Conference.WidgetTools.hasOwnProperty(toolName)){
      throw new Error(Conference.WidgetSandbox.messages.unknownTool + toolName); 
    }
    
    Conference.WidgetTools[toolName](this);
  }, this); // ensure 'this' refers to the sandbox instance within the callback
  
  widgetFunction(this);
};

// Create the empty tools namespace
Conference.WidgetTools = {};

Conference.WidgetSandbox.messages = {
  mustBeCalledWithNew: "The WidgetSandbox function must be called with new",
  fcnMustBeProvided: "Widget function must be provided",
  unknownTool: "Unknown tool requested: "
};