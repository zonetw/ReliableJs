describe('VendorPresentation', function() {
  'use strict';
  var title = 'How to Write Wonderful JavaScript',
      presenter = 'Rock Star',
      vendor = 'JxTools',
      product = 'The JxToolkit';
      
  describe('object creation', function() {
    it('throws if "new" is not used', function() {
      expect(function createWithoutNew() {
        Conference.VendorPresentation(title,presenter);
      }).toThrowError( Conference.VendorPresentation.messages.mustUseNew);
    });
    
    it('succeeds if "new" is used', function() {
      new Conference.Presentation(title,undefined,vendor); // does not throw
    });
    
    it('throws if the title is not given', function() {
      expect(function createWithoutTitle() {
        new Conference.VendorPresentation(undefined,undefined,vendor);
      }).toThrowError(Conference.Presentation.messages.titleRequired);
    });
    
    it('throws if the vendor is not given', function() {
      expect(function createWithoutVendor() {
        new Conference.VendorPresentation(title);
      }).toThrowError( Conference.VendorPresentation.messages.vendorRequired);
    });
  });
});