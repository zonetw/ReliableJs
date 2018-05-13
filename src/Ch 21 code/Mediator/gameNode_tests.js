describe('gameNode', function() {
  'use strict';
  var gameNode = Game.gameNode,
      normalPoint = Game.normalPoint;

  describe('getPoint()', function() {
    it('returns the point that was passed to gameNode(point)', function() {
      var pt = normalPoint();
      var node = gameNode(pt); 
      expect(node.getPoint()).toBe(pt);
    });
  });
  
  describe('setConnectedNode(otherNode,pathIndex / getConnectedNode(pathIndex)',
  function() {
    it('function as a pair, with get getting what was set',function() {
      var nodeA = gameNode();
      var nodeB = gameNode();
      var pathIndex = 2;
      nodeA.setConnectedNode(nodeB,pathIndex);
      expect(nodeA.getConnectedNode(pathIndex)).toBe(nodeB);
    });
  });
  
  describe('connect(otherNode, pathIndex)', function() {
    function forEachPathIndex(expectation) {
      var pathIndex;
      for (pathIndex=0; pathIndex<4; ++pathIndex) {
        var a = gameNode();
        var b = gameNode();
        a.connect(b,pathIndex);
        expectation(a,b,pathIndex);
      }
    }
    function complementaryPathIndex(pathIndex) {
      return pathIndex===0 ? 3 :
             pathIndex===3 ? 0 :
             pathIndex===1 ? 2 :
             1;
    }
    it('connects the other node to this node through the pathIndex',function(){
      forEachPathIndex(function(a,b,pathIndex) {
        expect(a.getConnectedNode(pathIndex)).toBe(b);
      });
    });
    it('connects this node to the other one through the complementary '+
    'pathIndex', function() {
      forEachPathIndex(function(a,b,pathIndex) {
        expect(b.getConnectedNode(complementaryPathIndex(pathIndex))).toBe(a);
      });      
    });
    it('throws if this node already has a connection at pathIndex', function(){
      var a = gameNode();
      var b = gameNode();
      var c = gameNode();
      var pathIndex = 2;
      a.connect(b,pathIndex);
      expect(function() {
        a.connect(c,pathIndex);
      }).toThrowError(a.messages.alreadyConnected);
    });
    it('throws if otherNode already has a connection at the complementary '+
    'pathIndex', function(){
      var a = gameNode();
      var b = gameNode();
      var c = gameNode();
      var pathIndex = 2;
      a.connect(b,pathIndex);
      expect(function() {
        c.connect(b,pathIndex);
      }).toThrowError(c.messages.alreadyConnected);      
    });
  });
});