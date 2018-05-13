var Conference = Conference || {};
Conference.polyfills = Conference.polyfills || {};

Conference.polyfills.arrayForEach = function(callbackFcn, thisObj){
  'use strict';

  if (!(this instanceof Array)){
    throw new Error("'this' is not an array");
  }
  if (typeof callbackFcn !== "function") {
    throw new Error(callbackFcn + ' is not a function');
  }
};