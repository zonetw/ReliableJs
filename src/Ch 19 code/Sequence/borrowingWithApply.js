var Conference = Conference || {};
Conference.polyfills = Conference.polyfills || {};

//-----------------------------------------------------------------
// Create the polyfill, then apply the aspect, then borrow it.
//-----------------------------------------------------------------

Conference.polyfills.forEachWithEarlyAspect = function(callbackFcn, thisObj){
  var i;
  
  for(i = 0; i < this.length; i++){
    callbackFcn.call(thisObj, this[i], i, this);
  }
};

Aop.before('forEachWithEarlyAspect',function isObjectWithLength(obj){
  if (typeof(obj) !== 'object' || isNaN(this.length)) {
    throw new Error('The call site for forEach must be array-like.');
  }
},Conference.polyfills);

var objWithEarlyAspect = { /* no length property */ };
objWithEarlyAspect.forEach = function() {
  var args = Array.prototype.slice.call(arguments);
  return Conference.polyfills.forEachWithEarlyAspect.apply(this,args);
};

//-----------------------------------------------------------------
// Create the polyfill, then apply the aspect, then borrow it.
//-----------------------------------------------------------------

Conference.polyfills.forEachWithLateAspect = function(callbackFcn, thisObj){
  var i;
  
  for(i = 0; i < this.length; i++){
    callbackFcn.call(thisObj, this[i], i, this);
  }
};

var objWithLateAspect = { /* no length property */ };
objWithLateAspect.forEach = function() {
  var args = Array.prototype.slice.call(arguments);
  return Conference.polyfills.forEachWithLateAspect.apply(this,args);
};

// Applying the aspect afterwards is NOT too late since we used 'call'.
Aop.before('forEachWithLateAspect',function isObjectWithLength(obj){
  if (typeof(obj) !== 'object' || isNaN(this.length)) {
    throw new Error('The call site for forEach must be array-like.');
  }
},Conference.polyfills);
