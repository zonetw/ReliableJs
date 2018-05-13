var ReliableJavaScript = ReliableJavaScript || {};
ReliableJavaScript.contractRegistry = function() {
  'use strict';
  
  return {
    define: function define(contractName, evaluator) {
      if (typeof contractName !== 'string') {
        throw new Error(this.messages.nameMustBeString);
      }
      if (typeof evaluator !== 'function') {
        throw new Error(this.messages.evaluatorMustBeFunction);
      }
    },
    
    messages: {
      nameMustBeString: 'The contract name must be a string',
      evaluatorMustBeFunction: 'The evaluator must be a function',
    }
  };
};