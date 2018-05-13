describe('player', function() {
  'use strict';
  var player,
      fakeMediator;
      
  beforeEach(function() {
    fakeMediator = {
      onPlayerMoved: function() {}
    };
    player = Game.player(fakeMediator);
  });
  
  describe('getId()', function() {
    it('returns a unique integer ID', function() {
      var player2 = Game.player(fakeMediator);
      expect(player2.getId()).not.toBe(player.getId());
    });
  });
  
  describe('setNode(gameNode)', function() {
    it('causes getNode() to return the node', function() {
      var node = Game.gameNode();
      player.setNode(node);
      expect(player.getNode()).toBe(node);
    });
  });
  
  describe('move(pathIndex)', function() {
    var originalNode, newNode;
    beforeEach(function() {
      originalNode = Game.gameNode();
      newNode = Game.gameNode();
      player.setNode(originalNode);
    });
    
    describe('if there is a path at that index', function() {
      var pathIndex = 2;
      beforeEach(function() {
        originalNode.connect(newNode, pathIndex);
      });
      
      it('moves the player to the new point', function() {
        player.move(pathIndex);
        expect(player.getNode()).toBe(newNode);
      });
      it('informs the mediator of the movement', function() {
        spyOn(fakeMediator,'onPlayerMoved');
        player.move(pathIndex);
        expect(fakeMediator.onPlayerMoved).toHaveBeenCalledWith(player);
      });
      it('returns true', function() {
        expect(player.move(pathIndex)).toBe(true);
      });
    });
    
    describe('if there is no path at that index', function() {
      it('keeps the player at the same node', function() {
        player.move(2);
        expect(player.getNode()).toBe(originalNode);
      });
      it('returns false', function() {
        expect(player.move(2)).toBe(false);
      });
    });
  });
});