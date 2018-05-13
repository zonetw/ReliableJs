var AnimalKingdom = AnimalKingdom || {};

AnimalKingdom.marsupial = function(name, nocturnal){
  
  var instanceName = name,
      instanceIsNocturnal = nocturnal;
  
  return {
    getName: function(){
      return instanceName;
    },
    getIsNocturnal: function(){
      return instanceIsNocturnal;
    }
  }
}

AnimalKingdom.kangaroo = function(name){
  var baseMarsupial = AnimalKingdom.marsupial(name, false);
  
  baseMarsupial.hop = function(){
    return baseMarsupial.getName() + ' just hopped!';  
  };
  
  return baseMarsupial;
}

var jester = AnimalKingdom.kangaroo('Jester');
console.log(jester.getName());         // 'Jester'
console.log(jester.getIsNocturnal());  // false
console.log(jester.hop());             // 'Jester just hopped!'