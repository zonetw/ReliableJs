var Game = Game || {};

Game.mediator = function mediator() {
  'use strict';
  
  // The magicKey is a secret shared in the mediator family.
  // It is a private reference to a private, non-reproducible object.
  var magicKey = {},
  
      // Encapsulates the logic (rules) of the game.
      // In this version, gameLogic is embedded in mediator so it can
      // see the magicKey.
      gameLogic = function gameLogic(mediator, rows, columns) {
    
        return {
        
          // Reflect a player's movement to his current node, 
          // and end the game if appropriate.
          onPlayerMoved: function onPlayerMoved(key, player) {
            if (key !== magicKey) {
              throw new Error('Only the mediator may call this function.');
            } 
            // Make the logical representation of the game 
            // respond to player's move.
          }
      
          /*** Other function omitted for clarity. ***/
        };
      },
      
      // The mediator, which will be returned.
      med = {
    
        // Player calls this when he moves. Mediator informs other components.
        onPlayerMoved: function onPlayerMoved(player) {
          logic.onPlayerMoved(magicKey, player);
          display.onPlayerMoved(player);
        },
        
        /*** Other functions omitted for clarity. ***/
      },
  
      svgElement = document.getElementById('gameSvg');
     
  logic = Game.gameLogic(med,6,7);
  display = Game.svgDisplay(med,svgElement,logic);
    
  return med;
};