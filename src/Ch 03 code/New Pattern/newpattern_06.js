function Marsupial(name, nocturnal){
  this.name = name;
  this.isNocturnal = nocturnal;
}

var maverick = new Marsupial('Maverick', true);
maverick.prototype = {
  hop: function(){
    return "hoppity hop hop"
  }
}
var goose = new Marsupial('Goose', false);

console.log(maverick.isNocturnal); // true
console.log(maverick.name);        // "Maverick"

console.log(goose.isNocturnal);    // false
console.log(goose.name);           // "Goose"
