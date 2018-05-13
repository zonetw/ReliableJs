function incrementValue(){
  this.val++;
};
// functions can have properties
incrementValue.val = 0;

incrementValue();  // 1
incrementValue();  // 2
incrementValue();  // 3

console.log("final value: " + incrementValue.val);  // ???