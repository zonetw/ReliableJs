var Game = Game || {};

Game.normalPointContracts = function normalPointContracts() {
  'use strict';
  
  return {
    getContracts: function getContracts() {
      function isNormalCoordinate(thing) {
        return typeof thing === 'number' &&
               thing >= 0 &&
               thing < 1;
      }
      
      function isNormalPoint(thing) {
        return typeof thing === 'object' &&
               isNormalCoordinate(thing.x) &&
               isNormalCoordinate(thing.y);
      }
      
      return [
        { name: 'normalCoordinate',
          evaluator: isNormalCoordinate
        },
        { name: 'normalPoint',
          evaluator: isNormalPoint
        }
      ];
    },
    
    attachValidators: function attachValidators(registry) {
      // Arguments passed to the constructor are options, but if supplied
      // they must be normalCoordinates.
      registry.attachArgumentsValidator('normalPoint', Game,
        [ 'undefined,undefined',
          'normalCoordinate,undefined',
          'undefined,normalCoordinate',
          'normalCoordinate','normalCoordinate' ]);
         
      registry.attachReturnValidator('normalPoint',Game,'normalPoint');
    }
  };
};