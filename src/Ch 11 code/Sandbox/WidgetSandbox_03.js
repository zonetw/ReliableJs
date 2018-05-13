var Conference = Conference || {};

Conference.WidgetSandbox = function(){
  'use strict';
  
  // Ensure that Conference.WidgetSandbox(...) has been invoked using the
  // new keyword
  if(!(this instanceof Conference.WidgetSandbox)){
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }
  
  var widgetFunction = arguments[arguments.length - 1],
      toolsToLoad = [];
  
  if(typeof widgetFunction !== "function"){
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }
  
  if(arguments[0] instanceof Array){
    toolsToLoad = arguments[0];
  }
  
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
  fcnMustBeProvided: "Widget fucntion must be provided",
  unknownTool: "Unknown tool requested: "
};