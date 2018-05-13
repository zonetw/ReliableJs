var Conference = Conference || {};

// The Conference application's ContractRegistry, implemented as
// a singleton.
Conference.ConferenceContractRegistry = (function() {
  
  var registry = new ReliableJavaScript.ContractRegistry();
  
  var contractModules = [
      Conference.attendeeContracts(),
      // Add more modules here.
    ];
  
  registry.defineMultiple(ReliableJavaScript.StandardContracts);
  
  contractModules.forEach(function(m) {
    registry.defineMultiple(m.getContracts());
  });
  
  contractModules.forEach(function(m) {
    m.attachValidators(registry);
  });
  
  return registry;
}());
