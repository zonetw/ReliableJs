var Conference = Conference || {};
Conference.mixins = Conference.mixins || {};

Conference.mixins.addId = function(){
  'use strict';
  
  var id;
  
  if('getId' in this){
    throw new Error(Conference.mixins.addId.messages.triedToReplace + "getId");
  }
  if('setId' in this){
    throw new Error(Conference.mixins.addId.messages.triedToReplace + "setId");
  }
  
  this.getId = function getId(){
    return id;
  };
  
  this.setId = function setId(idValue){
    id = idValue;
  };
};
Conference.mixins.addId.messages = {
  triedToReplace: "mixin attempted to replace the existing property: "
};