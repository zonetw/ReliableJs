var Game = Game || {};

// Encapsulates the logic (rules) of the game
Game.gameLogic = function gameLogic(mediator, rows, columns) {
  'use strict';

  return {
    
    onPlayerMoved: function onPlayerMoved(magicKey, player) {
      Game.gameLogic.keyToProtectedFunctions.assertMatches(magicKey);
      // Make the logical representation of the game respond to player's move.
    }

    /*** Other function omitted for clarity. ***/
  };
};

Game.gameLogic.messages = {
  callerMustBeOriginalMediator: 'The caller parameter must be the mediator ' +
    'supplied when the object was instantiated.'
};

Game.gameLogic.keyToProtectedFunctions = Game.readOnceKey();