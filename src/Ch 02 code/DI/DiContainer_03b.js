DiContainer = function() {
    // Ensure the object is made with a constructor.
  if (!(this instanceof DiContainer)) {
    return new DiContainer();
  }

  this.registrations = [];
};

DiContainer.prototype.messages = {
  registerRequiresArgs: 'The register function requires three arguments: ' +
    'a string, an array of strings, and a function.'
};

DiContainer.prototype.register = function(name,dependencies,func) {

  var ix;
  
  if (typeof name !== 'string'
  || !Array.isArray(dependencies)
  || typeof func !== 'function') {
    throw new Error(this.messages.registerRequiresArgs);
  }
  for (ix=0; ix<dependencies.length; ++ix) {
    if (typeof dependencies[ix] !== 'string') {
      throw new Error(this.messages.registerRequiresArgs);
    }
  }

  this.registrations[name] = { func: func };
};

DiContainer.prototype.get = function(name) {
  var registration = this.registrations[name];
  if (registration===undefined) {
    return undefined;
  }
  return registration.func();
};