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
      registry[contractName] = evaluator;
    },
        
    fulfills: function fulfills(contractName, obj) {
      if (!registry[contractName]) {
        throw new Error(this.getMessageForNameNotRegistered(contractName));
      }
      return registry[contractName](obj);      
    },
    
    assert: function assert(contractName,obj) {
      if (!this.fulfills(contractName,obj)) {
        throw new Error(this.getMessageForFailedContract(contractName,obj));
      }
    },
    
    messages: {
      nameMustBeString: 'The contract name must be a string',
      evaluatorMustBeFunction: 'The evaluator must be a function',
      nameMustBeRegistered: "The contract '_' is not in the registry",
      failedContract: "The following does not fulfill contract '_': "
    },
    
    getMessageForNameNotRegistered: function getMessageForNameNotRegistered(
    contractName) {
      return this.messages.nameMustBeRegistered.replace('_',contractName);
    },
    
    getMessageForFailedContract: function getMessageForFailedContract(
    contractName, obj) {
      return this.messages.failedContract
          .replace('_',contractName)+ obj;
    }
  };
};