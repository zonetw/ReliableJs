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
    contractName = contractName.trim();
    if (contractName.length === 0){
      throw new Error(ReliableJavaScript.ContractRegistry.messages.nameMustBeString);
    }
    if (typeof evaluator !== 'function') {
      throw new Error(ReliableJavaScript.ContractRegistry.messages.evaluatorMustBeFunction);
    }
    registry[contractName] = evaluator;
    return this;
  };
    
  this.fulfills = function fulfills(contractName, obj) {
    if (typeof contractName === 'string') {
      contractName = contractName.trim();
    }
    if (!registry[contractName]) {
      throw new Error(this.getMessageForNameNotRegistered(contractName));
    }
    return registry[contractName](obj);
  };
};
    
ReliableJavaScript.ContractRegistry.prototype.defineMultiple =
function assert(contracts) {
  var self=this,
      ix;
  if (!Array.isArray(contracts)) {
    throw new Error(
      ReliableJavaScript.ContractRegistry.messages.contractsArrayInvalid);
  }
  for (ix=0; ix<contracts.length; ++ix) {
    if (!contracts[ix].name || !contracts[ix].evaluator) {
      throw new Error(
        ReliableJavaScript.ContractRegistry.messages.contractsArrayInvalid);
    }
  }
  contracts.forEach(function defineContract(c) {
    self.define(c.name, c.evaluator);
  });
  return this;
};
    
ReliableJavaScript.ContractRegistry.prototype.assert =
function assert(contractName,obj) {
  if (!this.fulfills(contractName,obj)) {
    throw new Error(this.getMessageForFailedContract(contractName,obj));
  }
  return this;
};
    
// Returns true or false according to whether the elements of 
// arguemnts 'args' conform to the validator.
// The validator can be one of the following:
// A contractName that has been registered with contractRegistry.define.
//    The named contract will be applied to 'args' as a whole.
// An array of strings, with each string a comma-separated list of 
//    contract names. Each element of the array represents an acceptable
//    overload of the function. For each comma-separated list of contract
//    names, the first contract will be applied to the
//    elements of 'args', the second to the second, and so on. If an
//    element in the array is  empty, then the corresponding argument is 
//    not subject to a contract. Extra arguments are also not checked.
// A function that will be called with this registry as the first
//    argument, and the arguments to the guarded function as the remaining
//    arguments. It should throw an error if any argument is invalid.
ReliableJavaScript.ContractRegistry.prototype.multipleFulfills =
function multipleFulfills(validator, args) {
  var self = this,
      index;
  
  // Evaluate one element in the validator array (only called when
  // validator is an array).
  function validateWithContractNameString(v) {
    var ix,
        contractNames = v.split(/ *, */);
    for (ix=0; ix<contractNames.length; ++ix) {
      if (contractNames[ix].length===0) {
        continue;
      }
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
    return validator.length===0;
  }
  if (typeof validator === 'function' ) {
    return validator.apply(self,args);
  }
};
    
ReliableJavaScript.ContractRegistry.prototype.multipleAssert =
function multipleAssert(validator,args) {
  if (!this.multipleFulfills(validator,args)) {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.argsFailedContract);
  }
  return this;
};
    
// Attach an argument validator to function 'funcName' of object 'funcObj'.
// The validator is as described for assertMultiple.
ReliableJavaScript.ContractRegistry.prototype.attachArgumentsValidator =
function attachArgumentsValidator(funcName, funcObj, validator) {
  var self = this;
  function validateStringOrUndefined(contractName) {
    if (contractName!==undefined && typeof contractName !== 'string') {
      throw new Error(ReliableJavaScript.ContractRegistry.messages.namesMustBeStringArray);
    }
  }
  if (typeof funcName !== 'string') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.funcNameMustBeString);
  }  
  if (typeof funcObj !== 'object') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.funcObjMustBeObject);
  } 
  if (Array.isArray(validator)) {
    validator.forEach(function assertStringNullOrUndefined(v) {
      if (typeof v !== 'string' &&
      typeof v !== 'undefined') {
        throw new Error(ReliableJavaScript.ContractRegistry.messages.validatorsInvalid);
      }
    });
  } else if (typeof validator !== 'function' &&
  typeof validator !== 'string') {
    throw new Error(ReliableJavaScript.ContractRegistry.messages.validatorsInvalid);
  }

  Aop.before(funcName, function validateArguments() {
      self.multipleAssert(validator,arguments);
  }, funcObj );
  
  return this;
};
  
ReliableJavaScript.ContractRegistry.prototype.attachReturnValidator =
function attachReturnValidator(funcName, funcObj, contractName) {
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
