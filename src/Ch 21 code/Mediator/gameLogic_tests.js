describe('gameLogic', function() {
  'use strict';
  var rows = 5,
      columns = 4,
      numNodes = rows * columns,
      numPlayers = 2,
      numPaths = Game.pathIndex.count,
      fakeMediator = {
        onPlayerMoved: function(player) {},
        onBotMoveStart: function(bot) {},
        onBotHit: function(bot) {},
        endGame: function() {},
      };
  describe('construction', function() {
    it('creates the correct number of nodes', function() {
      
    });
    it('links every node to at least one other node', function() {
     var nodes = Game.gameLogic(fakeMediator,rows,columns)
          .getNodes();
      nodes.forEach(function isLinked(n) {
        var ix,
            foundPath = false;
        for (ix=0; ix<numPaths; ++ix) {
          if (n.getConnectedNode(ix)) {
            foundPath = true;
            break;
          }
        }
        expect(foundPath).toBe(true);
      });
    });
  });
  
  describe('getPlayers()', function() {
    it('returns the number of players given when the object was created',
    function() {
      var logic = Game.gameLogic(fakeMediator,rows,columns);
      expect(logic.getPlayers().length).toBe(numPlayers);
    }) ; 
  });
  
  describe('getNodes()',function() {
    it('returns the number of nodes given when object was created', function() {
      var logic = Game.gameLogic(fakeMediator,rows,columns);
      expect(logic.getNodes().length).toBe(numNodes);
    });
  }); 
  
  describe('getNumPaths()', function() {
    it('returns the number of paths from when the object was created',
    function(){
      expect(Game.gameLogic(fakeMediator,rows,columns)
        .getNumPaths()).toBe(numPaths);  
    });
  });
  
  describe('onPlayerMoved(player)', function() {
    var logic, nodes, player,bots, botsHit;
    beforeEach(function() {
      logic = Game.gameLogic(fakeMediator, rows,columns);
      nodes = logic.getNodes();
      player = logic.getPlayers()[1];
      player.setNode(nodes[0]);
      bots = logic.getBots();
      bots.forEach(function(bot) {
        bot.setNode(nodes[2]); // Safely out of the way.
      });
      botsHit = [];
      spyOn(fakeMediator,'onBotHit').and.callFake(function(bot) {
        botsHit.push(bot);
      });
    });
    it('does not trigger mediator.onBotHit if there is no bot on the new node',
    function(){
      logic.onPlayerMoved(player);
      expect(fakeMediator.onBotHit).not.toHaveBeenCalled();
    });
    it('triggers mediator.onBotHit if there is a bot on the new node',function(){
      bots[0].setNode(nodes[0]);
      logic.onPlayerMoved(player);
      expect(botsHit).toEqual([bots[0]]);
    });
    it('triggers mediator.onBotHit for each of multiple bots on the new node',
    function() {
      var botsToBeHit = [ bots[1], bots[3] ];
      botsToBeHit.forEach(function(bot) {
        bot.setNode(player.getNode());
      });
      logic.onPlayerMoved(player);
      expect(botsHit).toEqual(botsToBeHit);    
    });
  });
  
  describe('onBotMoveStart(bot)', function() {
    var logic, bots, ix;
    beforeEach(function() {
      logic = Game.gameLogic(fakeMediator, rows,columns);
      bots = logic.getBots();
      spyOn(fakeMediator,'endGame');
    });
    describe("when bot's new node is undefined",function() {
      it("does not trigger mediator.endGame if this is not the last bot",
      function() {
        for (ix=0; ix<bots.length-1/*just one shy*/; ++ix) {
          bots[ix].setNode(undefined);
          logic.onBotMoveStart(bots[ix]);
        }
        expect(fakeMediator.endGame).not.toHaveBeenCalled();
      });
      it("triggers mediator.endGame if this is the last bot",function() {
        bots.forEach(function(bot) {
          bot.setNode(undefined);
          logic.onBotMoveStart(bot);
        });
        expect(fakeMediator.endGame).toHaveBeenCalled();
      });
    });
    describe("when bot's new node is not undefined",function() {
      it("does not trigger mediator.endGame", function() {
        bots.forEach(function(bot) {
          logic.onBotMoveStart(bot);
        });
        expect(fakeMediator.endGame).not.toHaveBeenCalled();
      });
      it("allows the bot to be safe from capture", function() {
        var bot = bots[0],
            player = logic.getPlayers()[0];
        spyOn(fakeMediator,'onBotHit');
        logic.onBotMoveStart(bots[0]);
        player.setNode(bot.getNode());
        logic.onPlayerMoved(player);
        expect(fakeMediator.onBotHit).not.toHaveBeenCalledWith(bot);
      });
    });
  });
});