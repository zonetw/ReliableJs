describe('gameLogic', function() {
  'use strict';
  
  var mediator = 'Pretend this is a mediator',
      player = 'Pretend this is a player',
      gameLogic = Game.gameLogic(mediator,6, 7);
      
  describe('onPlayerMoved(magicKey, player)', function() {
    
    it('asserts that "magicKey" is the correct one', function() {
      expect(function() {
        gameLogic.onPlayerMoved('bad key', player);
      }).toThrowError(Game.readOnceKey.messages.badKey);
    });
    
  });
});