describe('calculateUpgradeMileages(tripMileages, memberMultiplier', function(){
  var testPassenger = null;
  
  beforeEach(function(){
    testPassenger = {
      firstName : 'Seth',
      lastName : 'Richards',
      tripMileages : [
        500,
        600,
        3400,
        2500
      ]
    };
  });

  it('returns original mileages when multiplier is 1.0', function(){
    expect(calculateUpgradeMileages(testPassenger.tripMileages, 1.0)).toEqual(testPassenger.tripMileages);
  });

  it('returns expected mileages when the memberMultiplier is 3.0', function(){
      var expectedResults = [], multiplier = 3.0;
      
      for(var i = 0; i<testPassenger.tripMileages.length; i++){
        expectedResults[i] = testPassenger.tripMileages[i] * multiplier;
      }
  
      expect(calculateUpgradeMileages(testPassenger.tripMileages, multiplier))
        .toEqual(expectedResults);
    });

});