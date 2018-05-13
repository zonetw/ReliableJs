var Game = Game || {};

Game.readOnceKey = function readOnceKey() {
  'use strict';
  var magicKey = {},
      alreadyRead = false,
      ret = {}; // The read-once key that will be returned
      
  function getKey() {
    if (alreadyRead) {
      throw new Error(Game.readOnceKey.messages.onlyOnce);
    }
    alreadyRead = true;
    return magicKey;
  }      
  function assertMatches(key) {
    if (key !== magicKey) {
      throw new Error(Game.readOnceKey.messages.badKey);
    }
  }

  Object.defineProperty(ret, 'getKey', { value: getKey });
  Object.defineProperty(ret, 'assertMatches', { value: assertMatches });    
  return ret; 
};

Game.readOnceKey.messages = {
  onlyOnce: 'The readOnceKey may only be read once.',  
  badKey: 'The supplied key was incorrect. ' +
          'Have you violated an architectural constraint?'
};