function createReservation(passenger, flight, saver){
   var reservation = {
    passengerInformation: passenger,
    flightInformation: flight
  };
  
  saver.saveReservation(reservation);
  return reservation;
}

// ReservationSaver created by Charlotte
function ReservationSaver(){
  this.saveReservation = function(reservation){
    // Complex code that interacts with a web service
    // to save the reservation
  };
}