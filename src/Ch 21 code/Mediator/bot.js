var Game = Game || {};

Game.bot = function bot(mediator) {
  'use strict';
  var node, 
  id = (Game.bot.nextId === undefined ? Game.bot.nextId=0 : ++Game.bot.nextId),
  maxPathIx = 3;
  
  var me = {
    getId: function() {
      return id;
    },
    
    // Set the bot's node.
    // Set to undefined if bot is no longer on the board.
    setNode: function setNode(gameNode) {
      node = gameNode;
    },
   
    getNode: function getNode() {
      return node;
    },
    
    // Cause the bot to move every so many tenths of a second.
    setMoveInterval: function setMoveInterval(frequencyInTenths) {
      setInterval(function moveTimer() {
        var pathIx,
            choiceIx,
            availablePaths = [];
        if (me.getNode()===undefined) {
          return;
        }
        for (pathIx=0; pathIx<=maxPathIx; ++pathIx) {
          if (node.getConnectedNode(pathIx)) {
            availablePaths.push(pathIx);
          }
        }
        choiceIx=Math.floor(Math.random()*availablePaths.length);
        pathIx = availablePaths[choiceIx];
        me.setNode(node.getConnectedNode(pathIx));
        mediator.onBotMoveStart(me);
      },frequencyInTenths*1000/10);
    },
  };
  
  return me;
};