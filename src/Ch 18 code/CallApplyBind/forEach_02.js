var Conference = Conference || {};
Conference.polyfills = Conference.polyfills || {};

Conference.polyfills.arrayForEach = function(callbackFcn, thisObj){
  'use strict';
  
  var i;
  
  if (typeof callbackFcn !== "function") {
    throw new Error(callbackFcn + ' is not a function');
  }
  
  for(i = 0; i < this.length; i++){
    callbackFcn();
  }
};