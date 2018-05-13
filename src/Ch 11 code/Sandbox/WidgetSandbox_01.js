var Conference = Conference || {};

Conference.WidgetSandbox = function(){
  'use strict';
  
  // Ensure that Conference.WidgetSandbox(...) has been invoked using the
  // new keyword
  if(!(this instanceof Conference.WidgetSandbox)){
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }
  
  var widgetFunction = arguments[0];
  
  if(typeof widgetFunction !== "function"){
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }
  
  widgetFunction(this);
};

Conference.WidgetSandbox.messages = {
  mustBeCalledWithNew: "The WidgetSandbox function must be called with new",
  fcnMustBeProvided: "Widget function must be provided"
};