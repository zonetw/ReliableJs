describe('createReservation(passenger, flight)', function(){
  it('assigns the provided passenger to the passengerInfo property', function(){
    var testPassenger = {
      firstName: 'Pete',
      lastName: 'Mitchell'
    };
    
    var testFlight = {
      number: '3443',
      carrier: 'AceAir',
      destination: 'Miramar, CA'
    }; 
    
    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.passengerInfo).toBe(testPassenger);
  });
  
  it('assigns the provided flight to the flightInfo property', function(){
    var testPassenger = {
      firstName: 'Pete',
      lastName: 'Mitchell'
    };
    
    var testFlight = {
      number: '3443',
      carrier: 'AceAir',
      destination: 'Miramar, CA'
    }; 
    
    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.flightInfo).toBe(testFlight);
  });
});