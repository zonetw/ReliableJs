var ReliableJavaScript = ReliableJavaScript || {};

ReliableJavaScript.addValues = function(value1, value2){
  // addValues accepts two arguments and expects
  // that 'this' has a method 'printResult'
  this.printResult(value1 + value2);
};

// Define an object that has a printResult function
var contextObject = {
  
  printResult: function printResult(toPrint){
    console.log("Result: " + toPrint);
  }
  
};

// Execute the addValues function using its call method. 
// Provide contextObject as the object to which 'this' should be bound.
// Also, provide 2 and 3 as the values that addValues will add together

ReliableJavaScript.addValues.call(contextObject, 2, 3); // "Result: 5"

// Execute the addValues function using its apply method.
// Again. provide contextObject as the object to which 'this' should be bound.
// Also, provide an array containing the values 2 and 3 as the arguments that
// will be added together. 
ReliableJavaScript.addValues.apply(contextObject, [2, 3]); // "Result: 5"