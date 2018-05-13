var Game = Game || {};

// Encapsulates the logic (rules) of the game
Game.gameLogic = function gameLogic(mediator, rows, columns) {
  'use strict';
  
  var mommy = mediator;

  return {
    
    onPlayerMoved: function onPlayerMoved(caller, player) {
      if (caller !== mommy) {
        throw new Error(Game.gameLogic.messages.callerMustBeOriginalMediator);
      }
      // Make the logical representation of the game respond to player's move.
    }

    /*** Other function omitted for clarity. ***/
  };
};

Game.gameLogic.messages = {
  callerMustBeOriginalMediator: 'The caller parameter must be the mediator ' +
    'supplied when the object was instantiated.'
};