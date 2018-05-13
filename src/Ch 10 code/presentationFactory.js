var Conference = Conference || {};
Conference.presentationFactory = function presentationFactory() {
  'use strict';
  return {
    // Create a Presentation or one of its descendants, depending
    // on the properties of the obj parameter.
    create: function(obj) {
      var baseProperties = [ 'title', 'presenter'],
          vendorProperties = ['vendor', 'product'],
          allProperties = baseProperties.concat(vendorProperties),
          p, 
          ix;
      for (p in obj) {
        if (allProperties.indexOf(p) <0){
          throw new Error(
            Conference.presentationFactory.messages.unexpectedProperty + p);
        }
      }
      for (ix=0; ix<vendorProperties.length; ++ix) {
        if (obj.hasOwnProperty(vendorProperties[ix])) {
          return new Conference.VendorPresentation(
            obj.title, obj.presenter, obj.vendor,obj.product);
        }
      }
      return new Conference.Presentation(obj.title,obj.presenter);
    }
  };
};

Conference.presentationFactory.messages = {
  unexpectedProperty: 'The creation parameter had an unexpected property '
};