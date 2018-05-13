var obj = {
  val: 0,
  incrementValue: function incrementValue(){
    "use strict";
    // in strict mode, 'this' is bound to undefined rather than window
    // by default.
    this.val++;
  }
};

// create a reference to the function defined in obj
var incrementRef = obj.incrementValue;

// execute the incrementValue function via the reference
incrementRef();  // will generate an error