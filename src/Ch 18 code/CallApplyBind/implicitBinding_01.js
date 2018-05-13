var obj = {
  val: 0,
  incrementValue: function incrementValue(){
    this.val++;
  }
};

obj.incrementValue();
obj.incrementValue();
obj.incrementValue();

console.log("final value in object: " + obj.val);  // ???
