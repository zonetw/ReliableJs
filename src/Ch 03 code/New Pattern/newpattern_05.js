function Marsupial(name, nocturnal){
  if(!(this instanceof Marsupial)){
    throw new Error("This object must be created with new");
  }
  this.name = name;
  this.isNocturnal = nocturnal;
}
// Each object instance shares one copy of isAwake
Marsupial.prototype.isAwake = function(isNight){
  return isNight === this.isNocturnal;
}
var maverick = new Marsupial('Maverick', true);
var slider = new Marsupial('Slider', false);

var isNightTime = true;

console.log(maverick.isAwake(isNightTime));       // true
console.log(slider.isAwake(isNightTime));         // false

// the objects share a single instance of isAwake
console.log(maverick.isAwake === slider.isAwake); // true