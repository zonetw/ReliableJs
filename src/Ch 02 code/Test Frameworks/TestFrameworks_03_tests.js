describe('createReservation(passenger, flight)', function(){
  var testPassenger = null, 
    testFlight = null,
    testReservation = null;
    
  beforeEach(function(){
    testPassenger = {
      firstName: 'Pete',
      lastName: 'Mitchell'
    };
    
    testFlight = {
      number: '3443',
      carrier: 'AceAir',
      destination: 'Miramar, CA'
    };
    
    testReservation = createReservation(testPassenger, testFlight);
  });
  
  it('assigns passenger to the passengerInformation property', function(){
    expect(testReservation.passengerInformation).toBe(testPassenger);
  });
  
  it('assigns flight to the flightInformation property', function(){
    expect(testReservation.flightInformation).toBe(testFlight);
  });
});