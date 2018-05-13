var Conference = Conference || {};
// The Conference's ContractRegistry, implemented as a singleton.
Conference.ConferenceContractRegistry = (function() {
  'use strict';

  var registry = new ReliableJavaScript.ContractRegistry();
  
  var contractModules = [
      Conference.observerContracts(),
      Conference.recentRegistrationsServiceContracts(),
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
