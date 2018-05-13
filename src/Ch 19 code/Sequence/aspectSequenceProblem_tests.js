describe('aspect application', function() { 
  'use strict';
  function doNothing() {
  }
  it('works when aspect applied before borrowing', 
  function() {
    expect(function() {
      objWithEarlyAspect.forEach(doNothing);
    }).toThrow();
  });
  it('works when aspect applied after borrowing',
  function() {
    expect(function() {
      objWithLateAspect.forEach(doNothing);
    }).toThrow();    
  });
});