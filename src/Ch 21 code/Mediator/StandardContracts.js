// StandardContracts.js, introduced in Chapter 17

var ReliableJavaScript = ReliableJavaScript || {};

// An array of contracts for system-defined types. Add them to a registry 
// with ReliableJavaScript.ContractRegistry.defineMultiple.
ReliableJavaScript.StandardContracts = (function() {
 'use strict';
 
  //------------------
  // Basic types
  //------------------
  
  function isUndefined(thing) {
    return typeof thing === 'undefined';
  }
  
  function isBoolean(thing) {
    return typeof thing === 'boolean';
  }
  
  function isString(thing) {
    return typeof thing === 'string';  
  }
  
  function isNumber(thing) {
    return typeof thing === 'number';
  }
  
  function isFunction(thing) {
    return typeof thing === 'function';
  }
  
  function isObject(thing) {
    return typeof thing === 'object';
  }
  
  //-------------------
  // Nearly basic types
  //-------------------
  
  function isArray(thing) {
    return Array.isArray(thing);
  }
  
  function isNonEmptyString(thing) {
    return isString(thing) && thing.length>0;
  }
  
  function isNonBlankString(thing) {
    return isString(thing) && /^ *$/.test(thing)===false;
  }
  
  // Thanks to http://stackoverflow.com/questions/14636536/
  //   how-to-check-if-a-variable-is-an-integer-in-javascript
  function isInteger(thing) {
    return !isNaN(thing) &&
         (function(x) { return (x | 0) === x; })(parseFloat(thing));
  }
  
  function isNonNegativeInteger(thing) {
    return isInteger(thing) && thing>=0;
  }
  
  function isPositiveInteger(thing) {
    return isInteger(thing) && thing > 0;
  }
  
  return [
    { name: 'undefined',          evaluator: isUndefined },
    { name: 'boolean',            evaluator: isBoolean },
    { name: 'string',             evaluator: isString },
    { name: 'number',             evaluator: isNumber },
    { name: 'function',           evaluator: isFunction },
    { name: 'object',             evaluator: isObject },
    { name: 'array',              evaluator: isArray },
    { name: 'nonEmptyString',     evaluator: isNonEmptyString },
    { name: 'nonBlankString',     evaluator: isNonBlankString },
    { name: 'integer',            evaluator: isInteger },
    { name: 'nonNegativeInteger', evaluator: isNonNegativeInteger },
    { name: 'positiveInteger',    evaluator: isPositiveInteger },
  ];
  
}());