function valIncrementor(){
  this.val++;
}

var obj = {
  val: 0,
  incrementValue: valIncrementor
};

obj.incrementValue();
obj.incrementValue();
obj.incrementValue();

console.log("final value in object: " + obj.val);  // 3
