describe('gameLogic', function() {
  'use strict';
  
  var mediator = 'Pretend this is a mediator',
      player = 'Pretend this is a player',
      gameLogic = Game.gameLogic(mediator,6, 7);
      
  describe('onPlayerMoved(caller, player)', function() {
    
    it('throws if caller is not the original mediator', function() {
      expect(function() {
        gameLogic.onPlayerMoved('wrongKey', player);
      }).toThrowError(Game.gameLogic.messages.callerMustBeOriginalMediator);
    });
    
    it('does not throw if caller is the original mediator', function() {
      expect(function() {
        gameLogic.onPlayerMoved(mediator,player);
      }).not.toThrow();
    });
    
  });
});