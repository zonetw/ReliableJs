describe('bot',function() {
    var bot,
      fakeMediator;
      
  beforeEach(function() {
    fakeMediator = {
      onBotMoveStart: function() {}
    };
    
    bot = Game.bot(fakeMediator);
  });
  
  describe('getId()', function() {
    it('returns a unique integer ID', function() {
      var bot2 = Game.bot(fakeMediator);
      expect(bot2.getId()).not.toBe(bot.getId());
    });
  });
  
  describe('setNode(gameNode)', function() {
    it('causes getNode() to return the node', function() {
      var node = Game.gameNode();
      bot.setNode(node);
      expect(bot.getNode()).toBe(node);
    });
  });
  
  describe('setMoveInterval(frequencyTenths)',function(){
    beforeEach(jasmine.clock().install);
    afterEach(jasmine.clock().uninstall);
    it('causes mediator.onBotMoveStart to be called with the given frequency',
    function() {
      var freq = 5,
          nodeA = Game.gameNode(),
          nodeB = Game.gameNode();
      for (var pathIndex=0; pathIndex<3; ++pathIndex) {
        nodeA.connect(nodeB,pathIndex);
      }
      bot.setNode(nodeA);
      spyOn(fakeMediator,'onBotMoveStart');
      bot.setMoveInterval(freq);
      
      jasmine.clock().tick(freq*100 /*tenths to milliseconds*/);
      jasmine.clock().tick(freq*100 /*tenths to milliseconds*/);
      jasmine.clock().tick(freq*100 /*tenths to milliseconds*/);
      
      expect(fakeMediator.onBotMoveStart).toHaveBeenCalledWith(bot);
      expect(fakeMediator.onBotMoveStart.calls.count()).toBe(3);
    });
  });
});