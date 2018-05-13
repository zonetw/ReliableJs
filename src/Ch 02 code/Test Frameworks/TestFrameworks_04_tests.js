describe('createReservation(passenger, flight, saver)', function(){
  var testPassenger = null, 
    testFlight = null,
    testReservation = null,
    testSaver = null;
    
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
    
    testSaver = new ReservationSaver();
    spyOn(testSaver, 'saveReservation');
    
    testReservation = createReservation(testPassenger, testFlight, testSaver);
  });
  
  it('assigns the provided passenger to the passengerInformantion property', function(){
    expect(testReservation.passengerInformation).toBe(testPassenger);
  });
  
  it('assigns the provided flight to the flightInformation property', function(){
    expect(testReservation.flightInformation).toBe(testFlight);
  });
  
  it('saves the reservation', function(){
    expect(testSaver.saveReservation).toHaveBeenCalled();
  });
});