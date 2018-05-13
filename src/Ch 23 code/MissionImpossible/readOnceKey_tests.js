describe('readOnceKey', function() {
  'use strict';
  
  var readOnceKey;
  beforeEach(function() {
    readOnceKey = Game.readOnceKey();
  });
  
  describe('getKey()', function() {
    
    it('returns something with the first call', function() {
      expect(readOnceKey.getKey()).not.toBeUndefined();
    });
    
    it('throws on the second call', function() {
      readOnceKey.getKey();
      
      expect(function() {
        readOnceKey.getKey();
      }).toThrowError(Game.readOnceKey.messages.onlyOnce);
    });
    
    it('cannot be replaced with an impostor', function() {
      expect(function() {
        readOnceKey['getKey'] = function() { return 'Fake!'; }
      }).toThrow();      
    }); 
  });
  
  describe('assertMatches(key)', function() {
    
    it('throws if "key" is not the correct one', function() {
      expect(function() {
        readOnceKey.assertMatches('badKey');
      }).toThrowError(Game.readOnceKey.messages.badKey);
    });
    
    it('does not throw if "key" is correct', function() {
      var magicKey = readOnceKey.getKey();
      expect(function() {
        readOnceKey.assertMatches(magicKey);
      }).not.toThrow();
    });
    
    it('cannot be replaced with an impostor', function() {
      expect(function() {
        readOnceKey['assertMatches'] = function() { }
      }).toThrow();      
    });    
  });
});