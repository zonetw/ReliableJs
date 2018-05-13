function Marsupial(name, nocturnal){
  if(!(this instanceof Marsupial)){
    throw new Error("This object must be created with new");
  }
  this.name = name;
  this.isNocturnal = nocturnal;
}
Marsupial.prototype.isAwake = function(isNight){
  return isNight == this.isNocturnal;
};

function Kangaroo(name){
  if(!(this instanceof Kangaroo)){
    throw new Error("This object must be created with new");
  }
  this.name = name;
  this.isNocturnal = false;
}

Kangaroo.prototype = new Marsupial();
Kangaroo.prototype.hop = function(){
  return this.name + " just hopped!";
}
var jester = new Kangaroo('Jester');
console.log(jester.name);

var isNightTime = false;
console.log(jester.isAwake(isNightTime)); // true
console.log(jester.hop());  // 'Jester just hopped!'

console.log(jester instanceof Kangaroo);  // true
console.log(jester instanceof Marsupial); // true