describe('presentationFactory', function() {
  'use strict';
  var factory = Conference.presentationFactory(),
      baseParameter = {
        title: 'How to Write Wonderful JavaScript',
        presenter: 'Rock Star'
      };
  
  describe('create(objectLiteral)',function() {
    it('throws if the parameter has unexpected properties', function() {
      var badProp = 'badProperty';
      function createWithUnexpectedProperties() {
        var badParam = {};
        badParam[badProp] = 'unexpected!';
        factory.create(badParam);
      }
      expect(createWithUnexpectedProperties).toThrowError(
        Conference.presentationFactory.messages.unexpectedProperty + badProp);
    });
    
    describe('with only base properties',function() {
      var fakePresentation = { title: 'How to Fake a Presentation' },
          spyOnConstructor,
          returnedPresentation;
          
      beforeEach(function() {
        spyOnConstructor = spyOn(Conference,'Presentation')
          .and.returnValue(fakePresentation);
        returnedPresentation = factory.create(baseParameter);
      });
      
      it("passes all values to Presentation's constructor", function() {
        expect(spyOnConstructor).toHaveBeenCalledWith(
          baseParameter.title, baseParameter.presenter); 
      });
      
      it("calls the Presentation's constructor exactly once", function() {
        expect(spyOnConstructor.calls.count()).toBe(1);
      });
      
      it('returns the Presentation constructed', function() {
        expect(factory.create(baseParameter)).toBe(fakePresentation);
      });
    });
  
    describe('with at least one VendorPresentation property', function() {
      var vendorParameter = {
          title: 'How to Write Wonderful JavaScript',
          presenter: 'Rock Star',
          vendor: 'JxTools',
          product: 'The JxToolkit'
        },
        fakeVendorPresentation = { title: vendorParameter.title },
        spyOnConstructor;
        
      beforeEach(function() {
        spyOnConstructor = spyOn(Conference,'VendorPresentation')
          .and.returnValue(fakeVendorPresentation);
      });
        
      it('attempts to create a VendorPresentation', function() {
        var expectedCallCount = 0;
        function createParam(propName) {
          var param = {},
              p;
          for (p in baseParameter) {
            param[p] = baseParameter[p];
          }
          param[propName] = vendorParameter[propName];
          return param;
        }
        // Create a parameter that has just each vendor property in turn
        ['vendor','product'].forEach(function(propName) {
          var param = createParam(propName);
          var presentation = factory.create(param);
          expect(spyOnConstructor.calls.count()).toBe(++expectedCallCount);
        });
      });
      
      it("passes all values to VendorPresentation's constructor",function() {
        factory.create(vendorParameter);
        expect(spyOnConstructor).toHaveBeenCalledWith(
          vendorParameter.title, vendorParameter.presenter,
          vendorParameter.vendor, vendorParameter.product);
      });
      
      it("calls the VendorPresentation's constructor exactly once", function() {
        factory.create(vendorParameter);
        expect(spyOnConstructor.calls.count()).toBe(1);
      });
      
      it('returns the VendorPresentation constructed', function() {
        expect(factory.create(vendorParameter)).toBe(fakeVendorPresentation);
      });
    });
  });
});