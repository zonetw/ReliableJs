function Marsupial(name, nocturnal){
  if(!(this instanceof Marsupial)){
    throw new Error("This object must be created with new");
  }
  this.name = name;
  this.isNocturnal = nocturnal;
}

var slider = Marsupial('Slider', true);