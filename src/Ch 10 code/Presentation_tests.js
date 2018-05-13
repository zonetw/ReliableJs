describe('Presentation', function() {
  'use strict';
  var title = 'How to Write Wonderful JavaScript',
      presenter = 'Rock Star';
      
  describe('object creation', function() {
    it('throws if "new" is not used', function() {
      expect(function createWithoutNew() {
        Conference.Presentation(title);
      }).toThrowError(Conference.Presentation.messages.mustUseNew);
    });
    
    it('succeeds if "new" is used', function() {
      new Conference.Presentation(title); // does not throw
    });
    
    it('throws if the title is not given', function() {
      expect(function createWithoutTitle() {
        new Conference.Presentation();
      }).toThrowError(Conference.Presentation.messages.titleRequired);
    });
  });
});