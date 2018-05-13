var Conference = Conference || {};
Conference.Presentation = function(title, presenter) {
  'use strict';
  if (!(this instanceof Conference.Presentation)) {
    throw new Error(Conference.Presentation.messages.mustUseNew);
  }
  if (!title) {
    throw new Error(Conference.Presentation.messages.titleRequired);
  }
  this.title = title;
  this.presenter = presenter;
};

Conference.Presentation.messages = {
  mustUseNew: 'Presentation must be constructed with "new".',
  titleRequired: 'The title is required.'
};