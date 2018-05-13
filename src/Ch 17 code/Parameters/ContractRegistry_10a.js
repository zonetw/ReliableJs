var ReliableJavaScript = ReliableJavaScript || {};
ReliableJavaScript.ContractRegistry = function() {
  
  var registry = {};
  
  if (!(this instanceof ReliableJavaScript.ContractRegistry)) {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.newRequired);
  }

  this.define = function(contractName, evaluator) {
    if (typeof contractName !== 'string' ) {
      throw new Error(ReliableJavaScript.ContractRegistry.messages.nameMustBeString);
    }
    if (typeof evaluator !== 'function') {
      throw new Error(ReliableJavaScript.ContractRegistry.messages.evaluatorMustBeFunction);
    }
    registry[contractName] = evaluator;
    return this;
  };
    
  this.fulfills = function fulfills(contractName, obj) {
    if (!registry[contractName]) {
      throw new Error(this.getMessageForNameNotRegistered(contractName));
    }
    return registry[contractName](obj);
  };
};
    
ReliableJavaScript.ContractRegistry.prototype.assert =
function assert(contractName,obj) {
  if (!this.fulfills(contractName,obj)) {
    throw new Error(this.getMessageForFailedContract(contractName,obj));
  }
  return this;
};

ReliableJavaScript.ContractRegistry.prototype.multipleFulfills =
function multipleFulfills(validator, args) {
  var self = this,
      index;
      
  // Evaluate one element in the validator array (only called when
  // validator is an array).
  function validateWithContractNameString(v) {
    var ix,
        contractNames = v.split(',');
    for (ix=0; ix<contractNames.length; ++ix) {
      if (!self.fulfills(contractNames[ix],args[ix])) {
        return false;
      }
    }
    return true;
  }
  
  if (Array.isArray(validator)) {
    validator.forEach(function assertString(elem) {
      if (typeof elem !== 'string' ) {
        throw new Error(ReliableJavaScript.ContractRegistry.messages.validatorsInvalid);
      }
    });
  } else if (typeof validator !== 'function' &&
  typeof validator !== 'string') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.validatorsInvalid);
  }   
  
  if (!Array.isArray(args) &&
  (!args || typeof args !== 'object' || args.length===undefined)) {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.argsMustBeArrayLike);
  }
  
  if (typeof validator === 'string' ) {
    return self.fulfills(validator,args);
  }  
  if (Array.isArray(validator)) {
    for (index=0; index<validator.length; ++index) {
      if (validateWithContractNameString(validator[index])) {
        return true;
      }
    }
    return false;
  }
  if (typeof validator === 'function' ) {
    return validator.apply(self,args);
  }
};

ReliableJavaScript.ContractRegistry.prototype.attachReturnValidator =
function attachReturnValidator(
funcName, funcObj, contractName) {
  var self = this;
  if (typeof funcName !== 'string') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.funcNameMustBeString);
  }  
  if (typeof funcObj !== 'object') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.funcObjMustBeObject);
  }   
  if (typeof contractName !== 'string') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.nameMustBeString);
  } 
  
  Aop.around(funcName,     
    function validateReturn(targetInfo) {
      var ret = Aop.next(targetInfo);
      self.assert(contractName,ret);
      return ret;
    }, funcObj);
    
  return this;
};
  
ReliableJavaScript.ContractRegistry.messages = {
  newRequired: 'The contract registry must be instantiated with "new".',
  nameMustBeString: 'The contract name must be a string of at least ' +
    'one character.',
  evaluatorMustBeFunction: 'The evaluator must be a function.',
  nameMustBeRegistered: "The contract '_' is not in the registry.",
  funcNameMustBeString: 'The function name must be a non-empty string',
  funcObjMustBeObject: 'The object being decorated must be an object.',
  validatorsInvalid: 
    'The validators argument must be a string; an array of strings, each ' +
    'a comma-separated list of contract names; or a function.',
  argsMustBeArrayLike: 'The args argument must be array-like.',
  argsFailedContract: 'The arguments failed the contract',
  failedContract: "The following does not fulfill contract '_': ",
  contractsArrayInvalid: "The contracts parameter must be an array of " +
    "objects, each having name and evaluator properties."
};
  
ReliableJavaScript.ContractRegistry.prototype.getMessageForNameNotRegistered =
function getMessageForNameNotRegistered(
contractName) {
  return ReliableJavaScript.ContractRegistry.messages.nameMustBeRegistered
    .replace('_',contractName);
};

ReliableJavaScript.ContractRegistry.prototype.getMessageForFailedContract =
function getMessageForFailedContract(
contractName, obj) {
  return ReliableJavaScript.ContractRegistry.messages.failedContract
      .replace('_',contractName)+ obj;
};
