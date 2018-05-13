describe('mediator', function() {
  'use strict';
  var gameNodes,
      numNodes = 10,
      fakeDisplay,
      fakeLogic,
      fakePlayer0, fakePlayer1, fakePlayers;
  beforeEach(function() {
    var nodeIx;
    gameNodes = [];
    for (nodeIx=0; nodeIx<numNodes; ++nodeIx) {
      gameNodes.push(Game.gameNode());
    }    
    fakeDisplay = {
      onPlayerMoved: function(player) {},
      onBotMoveStart: function(bot) {},
      endGame: function() {},
    };
    fakePlayer0 = {
      activate: function() {},
      deactivate: function() {},
    };
    fakePlayer1 = {
      activate: function() {},
      deactivate: function() {},
    };
    fakePlayers = [ fakePlayer0, fakePlayer1 ];
    fakeLogic = {
      getPlayers: function() { return fakePlayers; },
      onPlayerMoved: function(player) {},
      onBotMoveStart: function(bot) {},
      onBotMoveEnd: function(bot) {},
      getNodes: function() { return gameNodes; },
      getBots: function() { return []; }
    };
    spyOn(Game,'svgDisplay').and.returnValue(fakeDisplay);
    spyOn(Game,'gameLogic').and.returnValue(fakeLogic);
    spyOn(fakeDisplay,'onPlayerMoved');
    spyOn(fakeDisplay,'endGame');
    spyOn(fakeLogic,'onPlayerMoved');
  });
  
  describe('startGame()', function() {
    it('activates both players', function() {
      var mediator = Game.mediator();
      spyOn(fakePlayer0,'activate');
      spyOn(fakePlayer1,'activate');
      mediator.startGame();
      expect(fakePlayer0.activate).toHaveBeenCalled();
      expect(fakePlayer1.activate).toHaveBeenCalled();
    });
  });
  
  describe('onPlayerMoved(player)', function() {
    var player;
    beforeEach(function() {
      var mediator = Game.mediator(),
          node = Game.gameNode();
      player = Game.player(mediator);
      player.setNode(node); // Pretend just moved here.
      mediator.onPlayerMoved(player);
    });
    it("informs the board of the player's new location", function() {
      expect(fakeLogic.onPlayerMoved).toHaveBeenCalledWith(player);
    });
    it("informs the display of the player's new location", function() {
      expect(fakeDisplay.onPlayerMoved).toHaveBeenCalledWith(player);
    });
  });
  
  describe('onBotMoveStart(bot)', function() {
    it('tells the game logic to start moving the bot, ' +
    'then tells the display to move it', function() {
      var node = Game.gameNode(),
          mediator = Game.mediator(),
          bot = Game.bot(mediator),
          logicMoveBotStarted = false,
          displayMovedBot = false;
      bot.setNode(node); // Pretend just moved here.
      spyOn(fakeLogic,'onBotMoveStart').and.callFake(function(bot) {
        expect(logicMoveBotStarted).toBe(false);
        expect(displayMovedBot).toBe(false);
        logicMoveBotStarted = true;
      });
      spyOn(fakeDisplay,'onBotMoveStart').and.callFake(function(bot) {
        expect(logicMoveBotStarted).toBe(true);
        expect(displayMovedBot).toBe(false);
        displayMovedBot = true;
      });
      mediator.onBotMoveStart(bot);
      expect(logicMoveBotStarted).toBe(true);
      expect(displayMovedBot).toBe(true);
    });
  });
  
  describe('onBotMoveEnd(bot)', function() {
    it('tells the game logic to finish moving the bot', function() {
      var mediator = Game.mediator(),
          bot = Game.bot(mediator);
      spyOn(fakeLogic,'onBotMoveEnd');
      mediator.onBotMoveEnd(bot);
      expect(fakeLogic.onBotMoveEnd).toHaveBeenCalledWith(bot);
    });
  });

  describe('onBotHit(bot)', function() {
    var mediator, bot;
    beforeEach(function() {
      var node = Game.gameNode();
      mediator = Game.mediator();
      bot = Game.bot(mediator);
      bot.setNode(node);
      spyOn(fakeLogic,'onBotMoveStart');
      spyOn(fakeDisplay,'onBotMoveStart');
      mediator.onBotHit(bot);
    });
    it('sets its node to undefined', function() {
      expect(bot.getNode()).toBeUndefined();
    });
    it('tells the game logic to remove the bot', function(){
      expect(fakeLogic.onBotMoveStart).toHaveBeenCalledWith(bot);
    });
    it('tells the display to remove the bot', function() {
      expect(fakeDisplay.onBotMoveStart).toHaveBeenCalledWith(bot);
    });
  });
  
  describe('endGame()', function() {
    var fakeElement, mediator;
    beforeEach(function() {
      mediator = Game.mediator();
      fakeElement = {
        removeEventListener: function() {}
      };
      spyOn(document,'getElementById').and.returnValue(fakeElement);
      spyOn(fakeElement,'removeEventListener');
      jasmine.clock().install();
    });
    afterEach(jasmine.clock().uninstall);
    it('deactivates both players', function() {
      var mediator = Game.mediator();
      spyOn(fakePlayer0,'deactivate');
      spyOn(fakePlayer1,'deactivate');
      mediator.endGame();
      expect(fakePlayer0.deactivate).toHaveBeenCalled();
      expect(fakePlayer1.deactivate).toHaveBeenCalled();
    });
    it('tells the display to announce the end of the game', function() {
      mediator.endGame();      
      jasmine.clock().tick(10000);
      expect(fakeDisplay.endGame).toHaveBeenCalled();
    });
  });
});