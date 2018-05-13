"use strict";

function Counter(){
  
  // When the constructor function is invoked with the new keyword,
  // 'this' is bound to the new object
  this.val = 0;
}
Counter.prototype.incrementValue = function(){
    // referencing 'this' within the function will still rely
    // upon implicit binding to ensure that 'this' references
    // the object instance when the function is invoked.
    this.val++;
};

var cnt = new Counter();
var incrementRef = cnt.incrementValue;

// Execute the function via a reference, triggering an error
incrementRef();