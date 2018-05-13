function Marsupial(name, nocturnal){
  if(!(this instanceof Marsupial)){
    return new Marsupial(name, nocturnal);
  }
  this.name = name;
  this.isNocturnal = nocturnal;
}

var slider = Marsupial('Slider', true);

console.log(slider.name);  // 'Slider'