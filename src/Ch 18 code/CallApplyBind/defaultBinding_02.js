 var obj = {
  val: 0,
  incrementValue: function incrementValue(){
    this.val++;
  }
}

// create a reference to the function defined in obj
var incrementRef = obj.incrementValue;

// execute the incrementValue function via the reference
incrementRef();
incrementRef();
incrementRef();

console.log("final value in object: " + obj.val);  // ???