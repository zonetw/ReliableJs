Aop = {
  around: function(fnName, advice, fnObj) {
    var originalFn = fnObj[fnName];
    fnObj[fnName] = function () {
      return advice.call(this, {fn:originalFn, args:arguments});
    };
  },
  
  next: function(targetInfo) {
  //This function was built up in these steps, test-by-test:
  //      targetInfo.fn();
  //      targetInfo.fn.apply({}, targetInfo.args);
  //return targetInfo.fn.apply({}, targetInfo.args);
    return targetInfo.fn.apply(this,targetInfo.args);
  }
};
