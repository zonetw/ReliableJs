var Game = Game || {};

// The Game's ContractRegistry, implemented as a singleton.
Game.ConferenceContractRegistry = (function() {
  'use strict';
  
  var registry = new ReliableJavaScript.ContractRegistry();
  
  var contractModules = [
      Game.normalPointContracts(),
      Game.gameNodeContracts(),
      Game.playerContracts(),
      Game.botContracts(),
      Game.gameLogicContracts(),
      Game.mediatorContracts(),
      // Add more modules here.
    ];
  
  registry.defineMultiple(ReliableJavaScript.StandardContracts);
  
  contractModules.forEach(function(m) {
    registry.defineMultiple(m.getContracts(registry));
  });
  
  contractModules.forEach(function(m) {
    m.attachValidators(registry);
  });
  
  return registry;
}());