function Marsupial(name, nocturnal){
  this.name = name;
  this.isNocturnal = nocturnal;
}

var maverick = new Marsupial('Maverick', true);
var slider = new Marsupial('Slider', false);

console.log(maverick.isNocturnal); // true 
console.log(maverick.name);        // "Maverick"

console.log(slider.isNocturnal);   // false
console.log(slider.name);          // "Slider"
