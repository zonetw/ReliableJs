var Game = Game || {};

// Make one node to which a Player may travel.
// normalPoint may be a Game.normalPoint or undefined, in which case
//   a random point will be generated.
Game.gameNode = function gameNode(normalPoint) {
  'use strict';
  
  var point = normalPoint || Game.normalPoint(),
      connectedNodes = [];
  
  function oneWayConnect(node,otherNode,pathIndex) {
    if (node.getConnectedNode(pathIndex)) {
      throw  new Error(node.messages.alreadyConnected);
    }
    node.setConnectedNode(otherNode,pathIndex);
  }
  var ret = {
    getPoint: function getPoint() {
      return point;
    },
    
    getConnectedNode: function getConnectedNode(pathIndex) {
      return connectedNodes[pathIndex];
    },
    
    setConnectedNode: function setConnectedNode( node,pathIndex) {
      connectedNodes[pathIndex] = node;
    },

    // Establish a two-way connection with otherNode, at pathIndex.
    // Throws if either this node or otherNode already had a 
    // connection at that pathIndex
    connect: function connect(otherNode, pathIndex) {
      oneWayConnect(ret,otherNode, pathIndex);
      oneWayConnect(otherNode,ret,Game.pathIndex.complementaryIndex(pathIndex));
    },
    
    messages: {
      alreadyConnected: 'There is already a connection at that path index.'
    }
  };
  
  return ret;
};