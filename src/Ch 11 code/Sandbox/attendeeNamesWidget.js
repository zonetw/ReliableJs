var Conference = Conference || {};
Conference.Widgets = Conference.Widgets || {};

Conference.Widgets.attendeeNamesWidget = function(sandbox){
  'use strict';
  
  // Fail immediately if the expected tools aren't available
  if(!sandbox.dom){
    throw new Error(Conference.Widgets.messages.missingTool + 'dom');
  }
  if(!sandbox.attendeeNames){
    throw new Error(Conference.Widgets.messages.missingTool + 'attendeeNames');
  }
  
  // retrieve attendeeNames and add them to the dashboard
  sandbox.attendeeNames.getAll().then(function resolved(names){
    // use sandbox.dom to display the list of names
  }, function rejected(reason){
    // use sandbox.dom to present an error message in the place
    // of the widget
  });
};

Conference.Widgets.messages = {
  missingTool: "Missing tool: "
};