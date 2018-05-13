var Game = Game || {};

// A NormalPoint is one whose x and y values range from
// 0 to 1 (including 0; not including 1)
// xNormal and yNormal must be in that range.
// If one or both is missing, a random coordinate will be generated.
Game.normalPoint = function(xNormal,yNormal) {
  'use strict';
  
  function makeCoordinate(c) {
    return c===undefined ? Math.random() : c;
  }
  
  return {
    x: makeCoordinate(xNormal),
    y: makeCoordinate(yNormal)
  };
};
