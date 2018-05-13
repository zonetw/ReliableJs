describe('borrow(borrower, donor, funcName)', function() { 
  'use strict';
  var borrow = ReliableJavaScript.utilities.borrow;
  it('causes borrower to execute the donated function', function() {
    var donor = { 
      subtract: function(minuend, subtrahend) {
        return minuend - subtrahend; 
      }
    },
    borrower = {};
    borrow(borrower, donor, 'subtract');
    expect(borrower.subtract(5,2)).toBe(3);
  });
});