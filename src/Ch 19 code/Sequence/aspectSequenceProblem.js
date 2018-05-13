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
  if (typeof(obj) !== 'object' || 
  !(typeof this.length === 'number' && isFinite(this.length) &&
  Math.floor(this.length) === this.length && this.length>=0)) {  
    throw new Error('The call site for forEach must be array-like.');
  }
},Conference.polyfills);

var objWithEarlyAspect = { /* no length property */ };
objWithEarlyAspect.forEach = Conference.polyfills.forEachWithEarlyAspect;

//-----------------------------------------------------------------
// Create the polyfill, borrow it, then apply the aspect. (Wrong!)
//-----------------------------------------------------------------

Conference.polyfills.forEachWithLateAspect = function(callbackFcn, thisObj){
  var i;
  
  for(i = 0; i < this.length; i++){
    callbackFcn.call(thisObj, this[i], i, this);
  }
};

var objWithLateAspect = { /* no length property */ };
objWithLateAspect.forEach = Conference.polyfills.forEachWithLateAspect;

// Applying the aspect too late!
Aop.before('forEachWithLateAspect',function isObjectWithLength(obj){
  if (typeof(obj) !== 'object' ||
  !(typeof this.length === 'number' && isFinite(this.length) &&
  Math.floor(this.length) === this.length && this.length>=0)) {  
    throw new Error('The call site for forEach must be array-like.');
  }
},Conference.polyfills);
