describe('normalPoint', function() {
  'use strict';
  var normalPoint = Game.normalPoint; // Alias for convenience
  describe('normalPoint(xNormal, yNormal)', function() {
    var pretendRandomNumber = 0.33;
    
    it('sets x to xNormal if xNormal was supplied', function(){
      var pt = normalPoint(0.5);
      expect(pt.x).toBe(0.5);
    });
    it('sets x to a random value [0-1) if xNormal was not supplied', function(){
      spyOn(Math,'random').and.callFake(function() {
        return pretendRandomNumber;
      });
      var pt = normalPoint();
      expect(pt.x).toBe(pretendRandomNumber);
    });
    
    it('sets y to yNormal if yNormal was supplied', function(){
      var pt = normalPoint(0,0.5);
      expect(pt.y).toBe(0.5);
    });
    it('sets y to a random value [0-1) if yNormal was not supplied', function(){
      spyOn(Math,'random').and.callFake(function() {
        return pretendRandomNumber;
      });
      var pt = normalPoint(0.9,undefined);
      expect(pt.y).toBe(pretendRandomNumber);
    });    
  });
});