var Game = Game || {};

Game.player = function player(mediator) {
  'use strict';
  
  var me,
      node, 
      id = (Game.player.nextId === undefined ?
            Game.player.nextId=0 :
            ++Game.player.nextId),
      listenEvent = "keydown",
      elementWithKeydownAttached,
      // The first player gets keys 1-4 (keycodes 49-52)
      // The second player gets keys 6-9 (keycodes 54-58)
      keycodeForPath0 = id%2 ? 54 : 49;
   
  function handleKeydown(e) {
    var pathIx = e.keyCode - keycodeForPath0;
    if (pathIx>=0 && pathIx < Game.pathIndex.count) {
      me.move(pathIx);
    }
  }
  
  me = {
    getId: function() {
      return id;
    },
    
    setNode: function setNode(gameNode) {
      node = gameNode;
    },
   
    getNode: function getNode() {
      return node;
    },
    
    activate: function activate(elementForKeydown) {
      elementWithKeydownAttached = elementForKeydown;
      elementWithKeydownAttached.addEventListener(listenEvent,handleKeydown);
    },
    
    deactivate: function deactivate() {
      if (elementWithKeydownAttached) {
        elementWithKeydownAttached.removeEventListener(
            listenEvent,handleKeydown);
      }
    },
    
    // Attempt to move the player along the given path (designated
    // by a path index). Return true on success or false on failure.
    move: function move(pathIndex) {
      if (node.getConnectedNode(pathIndex)) {
        me.setNode(node.getConnectedNode(pathIndex));
        mediator.onPlayerMoved(me);
        return true;
      }
      return false;
    }
  };
  
  return me;
};