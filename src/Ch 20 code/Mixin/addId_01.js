var Conference = Conference || {};
Conference.mixins = Conference.mixins || {};

Conference.mixins.addId = function(){
  'use strict';
  
  if('getId' in this){
    throw new Error(Conference.mixins.addId.messages.triedToReplace + "getId");
  }
  if('setId' in this){
    throw new Error(Conference.mixins.addId.messages.triedToReplace + "setId");
  }
};
Conference.mixins.addId.messages = {
  triedToReplace: "mixin attempted to replace the existing property: "
};