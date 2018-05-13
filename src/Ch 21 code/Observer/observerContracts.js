var Conference = Conference || {};

Conference.observerContracts = function observerContracts() {
  'use strict';
  
  return {
    getContracts: function getContracts() {
      function isObserver(thing) {
        return typeof thing.update === 'function';
      }
      
      return [
        { name: 'observer',
          evaluator: isObserver
        }
      ];
    },
    
    attachValidators: function attachValidators(registry) {
      // No validators
    }
  };
};