var ReliableJavaScript = ReliableJavaScript || {};
ReliableJavaScript.contractRegistry = function() {
  'use strict';
  var registry = {};
    
  return {
    define: function define(contractName, evaluator) {
      if (typeof contractName !== 'string') {
        throw new Error(this.messages.nameMustBeString);
      }
      if (typeof evaluator !== 'function') {
        throw new Error(this.messages.evaluatorMustBeFunction);
      }
    },
        
    fulfills: function fulfills(contractName, obj) {
      if (!registry[contractName]) {
        throw new Error(this.getMessageForNameNotRegistered(contractName));
      }
    },
    
    messages: {
      nameMustBeString: 'The contract name must be a string',
      evaluatorMustBeFunction: 'The evaluator must be a function',
      nameMustBeRegistered: "The contract '_' is not in the registry",
    },
    
    getMessageForNameNotRegistered: function getMessageForNameNotRegistered(
    contractName) {
      return this.messages.nameMustBeRegistered.replace('_',contractName);
    },
  };
};