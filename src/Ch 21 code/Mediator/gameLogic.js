var Game = Game || {};

// Encapsulates the logic (rules) of the game
Game.gameLogic = function gameLogic(mediator, rows, columns) {
  'use strict';
  
  var numNodes = rows*columns,
     
      players = [],
      bots = [],
      nodes = [],
      numPlayers = 2,
      numBots = 5,
      pathIndex = Game.pathIndex, // Alias
      numPaths = Game.pathIndex.count,
      nodeIx,
      ix,
      safeBots = []; // Bots that are currently moving, therefore safe.
  
  // Construct the board and its connections.
  (function() {
    var ixRow, ixColumn, point, node,
        rowSpacing = 1 / (rows+1),
        columnSpacing = 1 / (columns+1);
    for (ixRow=0; ixRow<rows; ++ixRow) {
      for (ixColumn = 0; ixColumn<columns; ++ixColumn) {
        point = Game.normalPoint((ixColumn+1)*columnSpacing, (ixRow+1)*rowSpacing);
        node = Game.gameNode(point);
        nodes.push(node);
        // Connect to previous column
        if (ixColumn>0) {
          node.connect(nodes[nodes.length-2],pathIndex.left);
        }
        // Connect to previous row.
        if (ixRow>0) {
          node.connect(nodes[nodes.length-1-columns],pathIndex.up);
        } 
      }
    }
  }());
  
  // Create players and distribute them across the nodes.
  (function() {
    for (ix=0; ix<numPlayers; ++ix) {
      var plyr = Game.player(mediator);
      nodeIx = numNodes/(ix+1) - 1;
      plyr.setNode(nodes[nodeIx]); 
      players.push(plyr);
    }
  }());
  
  // Create the bots on random nodes.
  (function() {
  for (ix=0; ix<numBots; ++ix) {
    var bot = Game.bot(mediator);
    nodeIx = Math.floor(Math.random()*numNodes);
    bot.setNode(nodes[nodeIx]);
    bots.push(bot);
    bot.setMoveInterval(7+Math.floor(Math.random()*5));
  }
  }());
  
  function isBotSafe(bot) {
    return safeBots.indexOf(bot) >= 0;
  }
  
  function makeBotSafe(bot) {
   if (!isBotSafe(bot)) {
      safeBots.push(bot);
   }
  }
  
  function makeBotUnsafe(bot) {
    var ix = safeBots.indexOf(bot);
    if (ix>=0) {
      safeBots.splice(ix,1);
    }
  }
  
  var ret = {

    getPlayers: function getPlayers() {
      return players;
    },
    
    getBots: function getBots() {
      return bots;
    },
    
    getNodes: function getNodes() {
      return nodes;
    },
    
    getNumPaths: function getNumPaths() {
      return numPaths;
    },
    
    // Reflect a player's movement to his current node, 
    // and end the game if appropriate.
    onPlayerMoved: function onPlayerMoved(player) {
      var ix;
      for (ix=0; ix<numBots; ++ix) {
        if (player.getNode() === bots[ix].getNode() &&
         !isBotSafe(bots[ix])) {
          mediator.onBotHit(bots[ix]);
        }
      }
    },
    
    // Start to move a bot. The start and end events are separated because
    // the bot is safe while moving.
    onBotMoveStart: function onBotMoveStart(bot) {
      var botsEliminated = 0;
      if (bot.getNode() === undefined) {
        bots.forEach(function(b) {
          if (b.getNode()===undefined) {
            ++botsEliminated;
          }
        });
        if (botsEliminated >= numBots) {
          mediator.endGame();
        }
      } else {
        makeBotSafe(bot);
      }    
    },
    
    // Finish moving a bot, making it no longer safe from capture.
    onBotMoveEnd: function onBotMoveEnd(bot) {
      makeBotUnsafe(bot);
    }
  };
  
  return ret;
};