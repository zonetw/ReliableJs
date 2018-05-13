var Conference = Conference || {};
Conference.VendorPresentation = function(title, presenter,vendor,product) {
  'use strict';
  if (!(this instanceof Conference.VendorPresentation)) {
    throw new Error(
      Conference.VendorPresentation.messages.mustUseNew);
  }  
  if (!vendor) {
    throw new Error(Conference.VendorPresentation.messages.vendorRequired);
  }
  Conference.Presentation.call(this,title,presenter);
  this.vendor = vendor;
  this.product = product;
};

Conference.VendorPresentation.prototype 
  = Object.create(Conference.Presentation.prototype);
  
Conference.VendorPresentation.messages = {
  mustUseNew: 'VendorPresentation must be constructed with "new".',
  vendorRequired: 'The vendor is required.'
};