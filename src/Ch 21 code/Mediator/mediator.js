var Game = Game || {};

Game.mediator = function mediator() {
  'use strict';
  
  var logic,
      display,
      startTime,
      svgElement = document.getElementById('gameSvg');
  
  function moveBotStartInLogicAndOnDisplay(bot) {
    logic.onBotMoveStart(bot);
    display.onBotMoveStart(bot);  
  }
  
  var med = {
    
    startGame: function startGame() {
      logic.getPlayers().forEach(function(player){
        player.activate(document.getElementById('gameInput'));
      });
      startTime = new Date();
    },

    // Player calls this when he has moved.
    onPlayerMoved: function onPlayerMoved(player) {
      logic.onPlayerMoved(player);
      display.onPlayerMoved(player);
    },
    
    // Bot calls this function when it starts to move.
    onBotMoveStart: function onBotMoveStart(bot) {
      moveBotStartInLogicAndOnDisplay(bot);
    },
    
    // Bot calls this function when it has completed a move.
    onBotMoveEnd: function onBotMoveEnd(bot) {
      logic.onBotMoveEnd(bot);
    },
    
    // GameLogic calls this function when a bot is hit.
    onBotHit: function onBotHit(bot) {
      bot.setNode(undefined);
      moveBotStartInLogicAndOnDisplay(bot);
    },
    
    // GameLogic calls this function to end the game.
    endGame: function endGame() {
      var millisecondsToWin = new Date() - startTime;
      logic.getPlayers().forEach(function(player){
        player.deactivate();
      });
      // Use setTimeout to give the display a chance to remove the last bot
      // before we ask it to display the winning message.
      setTimeout(function() {
        display.endGame(millisecondsToWin);  
      },500);
    }
  };
     
  logic = Game.gameLogic(med,6,7);
  display = Game.svgDisplay(med,svgElement,logic);
    
  return med;
};